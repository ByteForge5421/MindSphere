const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const helmet = require('helmet');
const Sentry = require('@sentry/node');
const { initializeChatSocket } = require('./socket/chatSocket');
const { startAnalyticsJob } = require('./jobs/analyticsJob');

// Load environment variables
dotenv.config();

// Initialize Sentry for error tracking and performance monitoring
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    environment: process.env.NODE_ENV || 'development',
  });
}

// Initialize express app
const app = express();

// Sentry request handler middleware - must be early in the middleware chain
if (process.env.SENTRY_DSN) {
  app.use(Sentry.Handlers.requestHandler());
}

// --- START: MODIFIED CORS CONFIGURATION ---

// 1. Create a list of all websites you want to allow
const allowedOrigins = [
  'https://mindsphere-ai.netlify.app',
  'http://localhost:3000',                     // For local testing (change port if needed, e.g., 5173 for Vite)
  'http://localhost:8080'                      // Common port for Vite projects
];

// 2. Create the CORS options object
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl) and requests from our list
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('This origin is not allowed by CORS policy'));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 200 // Important for preflight requests
};

// 3. Use the updated CORS options in your app. This replaces the old app.use(cors()).
app.use(cors(corsOptions));
// Handle preflight requests for all routes
app.options('*', cors(corsOptions));


// --- END: MODIFIED CORS CONFIGURATION ---


// Middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rate limiter for AI endpoints
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many AI requests. Please try again later."
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.get('/health', (req, res) => res.status(200).send('OK')); // EB healthcheck

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/mood', require('./routes/mood'));
app.use('/api/recommendations', require('./routes/recommendations'));
app.use('/api/journal', require('./routes/journal'));
app.use('/api/dashboard', aiLimiter, require('./routes/dashboard'));
app.use('/api/community', require('./routes/community'));
app.use('/api/tokens', require('./routes/tokens'));
app.use("/api/plants",require('./routes/plants'));
app.use('/api/mood', require('./routes/geminiMood'));
app.use('/api/messages', require('./routes/messages'));

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    
    // Start analytics background job
    startAnalyticsJob();
    console.log('Analytics background job started');
    
    // Optional: Run seed script if specified
    if (process.env.SEED_DATA === 'true') {
      require('./scripts/seedData');
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));

  
// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Sentry error handler middleware - must be after all other middleware and routes
if (process.env.SENTRY_DSN) {
  app.use(Sentry.Handlers.errorHandler());
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

// --- START: SOCKET.IO SETUP ---

// Create HTTP server from Express app
const server = http.createServer(app);

// Initialize Socket.IO with CORS configuration
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
  }
});

// --- START: SOCKET.IO AUTHENTICATION MIDDLEWARE ---

/**
 * Socket.IO Authentication Middleware
 * Verifies JWT token during connection handshake
 * Rejects connection if token is missing or invalid
 */
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error('Authentication error: token missing'));
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Extract user ID from token - support both formats (ROBUSTNESS)
    // Format 1: { user: { id: '...' } }
    // Format 2: { id: '...' }
    const userId = decoded.user?.id || decoded.id;

    if (!userId) {
      return next(new Error('Authentication error: user ID not found in token'));
    }

    // Attach user to socket for later use in handlers
    socket.user = {
      id: userId
    };

    console.log(`[Socket] User ${socket.user.id} authenticated`);
    next();
  } catch (err) {
    console.error('[Socket] Authentication error:', err.message);
    next(new Error('Authentication error: invalid token'));
  }
});

// --- END: SOCKET.IO AUTHENTICATION MIDDLEWARE ---

// Initialize chat socket handlers
initializeChatSocket(io);

// --- END: SOCKET.IO SETUP ---

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server ready for real-time messaging`);
});  
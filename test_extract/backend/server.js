const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// --- START: MODIFIED CORS CONFIGURATION ---

// 1. Create a list of all websites you want to allow
const allowedOrigins = [
  'https://main.djppq1baqy0dq.amplifyapp.com', // Your Amplify frontend
  'https://mindsphere.onrender.com',           // Your Render frontend
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/community', require('./routes/community'));
app.use('/api/tokens', require('./routes/tokens'));
app.use("/api/plants",require('./routes/plants'));
const groupRoutes = require("./routes/group.js");
app.use("/api", groupRoutes);
app.use('/api/mood', require('./routes/geminiMood'));

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    
    // Optional: Run seed script if specified
    if (process.env.SEED_DATA === 'true') {
      require('./scripts/seedData');
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));

  
// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
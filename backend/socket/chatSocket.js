const Message = require('../models/Message');
const Community = require('../models/Community');
const User = require('../models/User');
const { trackEvent } = require('../services/eventService');

/**
 * In-memory storage for tracking online users
 * Map<userId, socketId>
 */
const onlineUsers = new Map();

/**
 * Initialize Socket.IO event handlers for real-time messaging
 * @param {Socket.IO.Server} io - Socket.IO server instance
 */
function initializeChatSocket(io) {
  io.on('connection', (socket) => {
    console.log(`[Socket] User connected: ${socket.id}`);

    /**
     * Event: user:connect
     * Acknowledges user connection and registers them as online
     * No payload needed - user is already authenticated via JWT
     */
    socket.on('user:connect', (data) => {
      try {
        // User identity is already verified via JWT authentication middleware
        const userId = socket.user.id;

        if (!userId) {
          socket.emit('error', { message: 'User authentication failed' });
          return;
        }

        // Add user to online users map
        onlineUsers.set(userId, socket.id);
        console.log(`[Socket] User ${userId} is online (${socket.id}). Online users: ${onlineUsers.size}`);

        // Broadcast to all clients that user is online
        io.emit('presence:online', { userId });

        // Send current online users to the connecting client
        const onlineUserIds = Array.from(onlineUsers.keys());
        socket.emit('presence:users', { onlineUsers: onlineUserIds });
      } catch (err) {
        console.error('[Socket] Error in user:connect:', err);
        socket.emit('error', { message: 'Error connecting user' });
      }
    });

    /**
     * Event: community:join
     * Allows an authenticated user to join a specific community room
     * Payload: { communityId }
     * Validates user is an actual member of the community (SECURITY)
     */
    socket.on('community:join', async (data) => {
      try {
        const { communityId } = data;
        const userId = socket.user.id;

        // Validate required fields
        if (!communityId) {
          socket.emit('error', { message: 'Community ID is required' });
          return;
        }

        if (!userId) {
          socket.emit('error', { message: 'User authentication failed' });
          return;
        }

        // Verify community exists
        const community = await Community.findById(communityId);
        if (!community) {
          socket.emit('error', { message: 'Community not found' });
          return;
        }

        // Verify user is a member of the community (SECURITY)
        const isMember = community.members.some(
          member => member.toString() === userId
        );
        if (!isMember) {
          socket.emit('error', { message: 'You are not a member of this community' });
          return;
        }

        // Join the socket to a room named after the community ID
        socket.join(communityId);
        console.log(`[Socket] User ${userId} joined community room: ${communityId}`);

        // Emit acknowledgment
        socket.emit('community:joined', {
          communityId,
          message: `Successfully joined ${community.name}`
        });
      } catch (err) {
        console.error('[Socket] Error in community:join:', err);
        socket.emit('error', { message: 'Error joining community' });
      }
    });

    /**
     * Event: message:send
     * Handles incoming messages and broadcasts them to the community room
     * Payload: { communityId, content }
     * senderId is obtained from authenticated socket.user.id
     */
    socket.on('message:send', async (data) => {
      try {
        const { communityId, content } = data;
        const senderId = socket.user.id;  // ← Use authenticated user ID

        // Validate input
        if (!communityId || !content) {
          socket.emit('error', { 
            message: 'Community ID and content are required' 
          });
          return;
        }

        if (!senderId) {
          socket.emit('error', { 
            message: 'User authentication failed' 
          });
          return;
        }

        // Verify community exists
        const community = await Community.findById(communityId);
        if (!community) {
          socket.emit('error', { message: 'Community not found' });
          return;
        }

        // Verify sender is a member of the community
        const isMember = community.members.some(
          member => member.toString() === senderId
        );
        if (!isMember) {
          socket.emit('error', { 
            message: 'You must be a member of this community to post messages' 
          });
          return;
        }

        // Create message document in MongoDB
        const newMessage = new Message({
          communityId,
          senderId,
          content
        });

        const savedMessage = await newMessage.save();

        // Populate sender info in a single query (OPTIMIZATION)
        await savedMessage.populate('senderId', 'name profilePicture');

        // Track analytics event for message sent
        await trackEvent(senderId.toString(), 'message_sent', {
          communityId,
          messageLength: content.length
        });

        // Transform response to match frontend message structure
        const broadcastMessage = {
          _id: savedMessage._id,
          content: savedMessage.content,
          createdAt: savedMessage.createdAt,
          user: {
            _id: savedMessage.senderId._id,
            name: savedMessage.senderId.name,
            profilePicture: savedMessage.senderId.profilePicture
          }
        };

        // Broadcast message to all users in the community EXCEPT sender (OPTIMIZATION)
        // Prevents duplicate message on sender's client (sender handles optimistically)
        socket.to(communityId).emit('message:new', broadcastMessage);
        console.log(`[Socket] Message sent to community ${communityId}:`, savedMessage._id);
      } catch (err) {
        console.error('[Socket] Error in message:send:', err);
        socket.emit('error', { message: 'Error sending message' });
      }
    });

    /**
     * Event: message:typing
     * Broadcasts typing indicator to community room (except sender)
     * Payload: { communityId }
     * userId is obtained from authenticated socket.user.id
     */
    socket.on('message:typing', async (data) => {
      try {
        const { communityId } = data;
        const userId = socket.user.id;

        // Validate required fields
        if (!communityId) {
          socket.emit('error', { message: 'Community ID is required' });
          return;
        }

        if (!userId) {
          socket.emit('error', { message: 'User authentication failed' });
          return;
        }

        // Broadcast typing indicator to all users in the room except sender
        socket.to(communityId).emit('message:typing', {
          communityId,
          userId
        });

        console.log(`[Socket] User ${userId} is typing in community ${communityId}`);
      } catch (err) {
        console.error('[Socket] Error in message:typing:', err);
      }
    });

    /**
     * Event: message:stop_typing
     * Broadcasts stop typing indicator to community room (except sender)
     * Payload: { communityId }
     * userId is obtained from authenticated socket.user.id
     */
    socket.on('message:stop_typing', async (data) => {
      try {
        const { communityId } = data;
        const userId = socket.user.id;

        // Validate required fields
        if (!communityId) {
          socket.emit('error', { message: 'Community ID is required' });
          return;
        }

        if (!userId) {
          socket.emit('error', { message: 'User authentication failed' });
          return;
        }

        // Broadcast stop typing indicator to all users in the room except sender
        socket.to(communityId).emit('message:stop_typing', {
          communityId,
          userId
        });

        console.log(`[Socket] User ${userId} stopped typing in community ${communityId}`);
      } catch (err) {
        console.error('[Socket] Error in message:stop_typing:', err);
      }
    });

    /**
     * Event: disconnect
     * Handle socket disconnection and remove user from online users
     * Only authenticated sockets (with socket.user) reach this point
     */
    socket.on('disconnect', () => {
      try {
        const userId = socket.user?.id;

        if (userId) {
          // Remove user from online users map
          onlineUsers.delete(userId);
          console.log(`[Socket] User ${userId} is offline. Online users remaining: ${onlineUsers.size}`);

          // Broadcast to all clients that user is offline
          io.emit('presence:offline', { userId });
        } else {
          console.log(`[Socket] Socket disconnected (no user context): ${socket.id}`);
        }
      } catch (err) {
        console.error('[Socket] Error in disconnect:', err);
      }
    });

    /**
     * Event: error handler
     */
    socket.on('error', (error) => {
      console.error(`[Socket] Error for user ${socket.id}:`, error);
    });
  });
}

module.exports = { initializeChatSocket };

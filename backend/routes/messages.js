const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');
const Community = require('../models/Community');

// @route   POST /api/messages
// @desc    Create a new message in a community
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { communityId, content } = req.body;

    // Validate input
    if (!communityId || !content) {
      return res.status(400).json({ message: 'Community ID and content are required' });
    }

    // Check if community exists
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    // Check if user is a member of the community
    if (!community.members.some(member => member.toString() === req.user.id.toString())) {
      return res.status(403).json({ message: 'Must be a member to post messages' });
    }

    // Create the message
    const newMessage = new Message({
      communityId,
      senderId: req.user.id,
      content
    });

    const message = await newMessage.save();

    // Populate sender info for response (matches frontend expectations)
    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'name profilePicture');

    // Transform response to match frontend message structure (user instead of senderId)
    const responseMessage = {
      _id: populatedMessage._id,
      content: populatedMessage.content,
      createdAt: populatedMessage.createdAt,
      user: {
        _id: populatedMessage.senderId._id,
        name: populatedMessage.senderId.name,
        profilePicture: populatedMessage.senderId.profilePicture
      }
    };

    res.status(201).json(responseMessage);
  } catch (err) {
    console.error('Error creating message:', err);
    res.status(500).json({ message: 'Error creating message' });
  }
});

// @route   GET /api/messages/:communityId
// @desc    Get messages from a community with pagination
// @access  Private
// @query   limit=50 (default), before=<timestamp> (for older messages)
router.get('/:communityId', auth, async (req, res) => {
  try {
    const { communityId } = req.params;
    const { limit = 50, before } = req.query;

    // Check if community exists
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    // Build query
    let query = Message.find({ communityId });

    // If 'before' timestamp is provided, fetch older messages
    if (before) {
      const beforeDate = new Date(before);
      query = query.where('createdAt').lt(beforeDate);
    }

    // Fetch messages sorted by createdAt ascending (oldest first)
    const messages = await query
      .populate('senderId', 'name profilePicture')
      .sort({ createdAt: 1 })
      .limit(parseInt(limit));

    // Transform response to match frontend message structure
    const transformedMessages = messages.map(msg => ({
      _id: msg._id,
      content: msg.content,
      createdAt: msg.createdAt,
      user: {
        _id: msg.senderId._id,
        name: msg.senderId.name,
        profilePicture: msg.senderId.profilePicture
      }
    }));

    res.json(transformedMessages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

module.exports = router;

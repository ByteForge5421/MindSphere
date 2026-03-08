const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { trackEventMiddleware } = require('../middleware/eventTracker');
const Community = require('../models/Community');
const User = require('../models/User');
const Message = require('../models/Message');
const { trackEvent } = require('../services/eventService');
// const Token = require('../models/Token'); // Removed

// @route   GET api/community
// @desc    Get all community groups
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const groups = await Community.find()
      .sort({ createdAt: -1 })
      .populate('members', 'name profilePicture');
    
    res.json(groups);
  } catch (err) {
    console.error('Error fetching community groups:', err);
    res.status(500).json({ message: 'Error fetching community groups' });
  }
});

// @route   GET api/community/:id
// @desc    Get a specific community group (metadata only, no messages)
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const group = await Community.findById(req.params.id)
      .populate('members', 'name profilePicture');
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    res.json(group);
  } catch (err) {
    console.error('Error fetching community group:', err);
    res.status(500).json({ message: 'Error fetching community group' });
  }
});

// @route   POST api/community
// @desc    Create a new community group
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, category } = req.body;
    
    if (!name || !description || !category) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    const newGroup = new Community({
      name,
      description,
      category,
      members: [req.user.id]
    });
    
    const group = await newGroup.save();
    
    const populatedGroup = await Community.findById(group._id)
      .populate('members', 'name profilePicture');
    
    // --- Token awarding logic removed ---

    res.status(201).json(populatedGroup);
  } catch (err) {
    console.error('Error creating community group:', err);
    res.status(500).json({ message: 'Error creating community group' });
  }
});

// @route   POST api/community/:id/join
// @desc    Join a community group
// @access  Private
router.post('/:id/join', auth, trackEventMiddleware('community_joined'), async (req, res) => {
  try {
    const group = await Community.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    if (group.members.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already a member of this group' });
    }
    
    group.members.push(req.user.id);
    await group.save();
    
    // Track analytics event for community join
    await trackEvent(req.user.id.toString(), 'community_joined', {
      communityId: req.params.id
    });
    
    const populatedGroup = await Community.findById(group._id)
      .populate('members', 'name profilePicture');
    
    res.json(populatedGroup);
  } catch (err) {
    console.error('Error joining community group:', err);
    res.status(500).json({ message: 'Error joining community group' });
  }
});

// @route   POST api/community/:id/leave
// @desc    Leave a community group
// @access  Private
router.post('/:id/leave', auth, async (req, res) => {
  try {
    const group = await Community.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    if (!group.members.includes(req.user.id)) {
      return res.status(400).json({ message: 'Not a member of this group' });
    }
    
    group.members = group.members.filter(
      member => member.toString() !== req.user.id.toString()
    );
    
    await group.save();
    
    const populatedGroup = await Community.findById(group._id)
      .populate('members', 'name profilePicture');
    
    res.json(populatedGroup);
  } catch (err) {
    console.error('Error leaving community group:', err);
    res.status(500).json({ message: 'Error leaving community group' });
  }
});

// @route   POST api/community/:id/message
// @desc    Post a message to a community group (DEPRECATED: use POST /api/messages instead)
// @access  Private
router.post('/:id/message', auth, async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Message content is required' });
    }
    
    const group = await Community.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    if (!group.members.some(member => member.toString() === req.user.id.toString())) {
      return res.status(403).json({ message: 'Must be a member to post messages' });
    }
    
    // Create message in Message collection instead of embedding
    const newMessage = new Message({
      communityId: req.params.id,
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
    
    res.json(responseMessage);
  } catch (err) {
    console.error('Error posting message:', err);
    res.status(500).json({ message: 'Error posting message' });
  }
});

// @route   GET api/community/:id/messages
// @desc    Get messages from a community group (DEPRECATED: use GET /api/messages/:communityId instead)
// @access  Private
router.get('/:id/messages', auth, async (req, res) => {
  try {
    const group = await Community.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // Fetch messages from Message collection
    const messages = await Message.find({ communityId: req.params.id })
      .populate('senderId', 'name profilePicture')
      .sort({ createdAt: 1 });
    
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

// @route   POST api/community/seed
// @desc    Create initial community groups (for development)
// @access  Private/Admin
router.post('/seed', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const existingGroups = await Community.countDocuments();
    
    if (existingGroups > 0) {
      return res.status(400).json({ message: 'Community groups already exist' });
    }
    
    const sampleGroups = [
      {
        name: 'Anxiety Support',
        description: 'A safe space to share experiences and coping strategies for anxiety.',
        category: 'support',
        members: [req.user.id]
      },
      {
        name: 'Mindfulness Practice',
        description: 'Group dedicated to sharing mindfulness techniques and daily practices.',
        category: 'wellness',
        members: [req.user.id]
      },
      {
        name: 'Student Mental Health',
        description: 'Support group for students dealing with academic stress and pressure.',
        category: 'students',
        members: [req.user.id]
      },
      {
        name: 'Mood Boosters',
        description: 'Share positive experiences, achievements, and things that lift your mood.',
        category: 'positivity',
        members: [req.user.id]
      },
      {
        name: 'Sleep Better',
        description: 'Discussion group for improving sleep quality and addressing sleep issues.',
        category: 'wellness',
        members: [req.user.id]
      }
    ];
    
    await Community.insertMany(sampleGroups);
    
    const groups = await Community.find()
      .populate('members', 'name profilePicture');
    
    res.json(groups);
  } catch (err) {
    console.error('Error seeding community groups:', err);
    res.status(500).json({ message: 'Error seeding community groups' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { trackEventMiddleware } = require('../middleware/eventTracker');
const Journal = require('../models/Journal');
const axios = require('axios');
const { trackEvent } = require('../services/eventService');

// @route   GET api/journal
// @desc    Get user's journal entries
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Journal.countDocuments({ user: req.user.id });
    const journals = await Journal.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    res.json({ data: journals, page, limit, total });
  } catch (err) {
    console.error('Error fetching journal entries:', err);
    res.status(500).json({ message: 'Error fetching journal entries' });
  }
});

// @route   POST api/journal
// @desc    Create a new journal entry
// @access  Private
router.post('/', auth, [
  body('title').notEmpty().withMessage('Title is required').trim(),
  body('content').notEmpty().withMessage('Content is required'),
], trackEventMiddleware("journal_created"), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, content, isPrivate, tags } = req.body;
    
    // Get mood analysis for journal content
    let mood = null;
    
    try {
      const response = await axios.post(`${process.env.AI_SERVICE_URL}/analyze-text`, {
        text: content
      });
      
      mood = response.data.mood;
    } catch (err) {
      console.error('Error analyzing journal mood:', err);
    }
    
    // Create new journal entry
    const newJournal = new Journal({
      user: req.user.id,
      title,
      content,
      mood,
      tags: tags || [],
      isPrivate: isPrivate !== undefined ? isPrivate : true
    });
    
    const journal = await newJournal.save();
    
    // Track analytics event for journal created
    await trackEvent(req.user.id.toString(), 'journal_created', {
      wordCount: content.split(' ').length
    });
    
    res.json(journal);
  } catch (err) {
    console.error('Error creating journal entry:', err);
    res.status(500).json({ message: 'Error creating journal entry' });
  }
});


// Put this ABOVE the /:id route
router.get('/entries', auth, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const total = await Journal.countDocuments({ user: req.user.id });
  const journals = await Journal.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  res.json({ data: journals, page, limit, total });
});


// @route   GET api/journal/:id
// @desc    Get a journal entry by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const journal = await Journal.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!journal) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }
    
    res.json(journal);
  } catch (err) {
    console.error('Error fetching journal entry:', err);
    res.status(500).json({ message: 'Error fetching journal entry' });
  }
});

// @route   PUT api/journal/:id
// @desc    Update a journal entry
// @access  Private
router.put('/:id', auth, [
  body('title').optional().notEmpty().withMessage('Title cannot be empty').trim(),
  body('content').optional().notEmpty().withMessage('Content cannot be empty'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, content, isPrivate, tags } = req.body;
    
    // Check if journal exists
    let journal = await Journal.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!journal) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }
    
    // Get mood analysis if content has changed
    let mood = journal.mood;
    
    if (content && content !== journal.content) {
      try {
        const response = await axios.post(`${process.env.AI_SERVICE_URL}/analyze-text`, {
          text: content
        });
        
        mood = response.data.mood;
      } catch (err) {
        console.error('Error analyzing updated journal mood:', err);
      }
    }
    
    // Update journal fields
    const journalFields = {};
    if (title) journalFields.title = title;
    if (content) journalFields.content = content;
    if (isPrivate !== undefined) journalFields.isPrivate = isPrivate;
    if (tags) journalFields.tags = tags;
    journalFields.mood = mood;
    
    // Update journal
    journal = await Journal.findByIdAndUpdate(
      req.params.id,
      { $set: journalFields },
      { new: true }
    );
    
    res.json(journal);
  } catch (err) {
    console.error('Error updating journal entry:', err);
    res.status(500).json({ message: 'Error updating journal entry' });
  }
});

// @route   DELETE api/journal/:id
// @desc    Delete a journal entry
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if journal exists
    const journal = await Journal.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!journal) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }
    
    // Delete journal
    await Journal.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Journal entry removed' });
  } catch (err) {
    console.error('Error deleting journal entry:', err);
    res.status(500).json({ message: 'Error deleting journal entry' });
  }
});

module.exports = router;

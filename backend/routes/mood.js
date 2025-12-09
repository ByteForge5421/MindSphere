const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { trackEventMiddleware } = require('../middleware/eventTracker');
const CheckIn = require('../models/CheckIn');
const User = require('../models/User');
const { trackEvent } = require('../services/eventService');

// @route   POST api/mood/check-in
// @desc    Save mood check-in (bina AI analysis ke)
// @access  Private
router.post('/check-in', auth, [
  body('moodScore').isInt({ min: 1, max: 10 }).withMessage('Mood score must be between 1 and 10'),
  body('energyLevel').isInt({ min: 1, max: 10 }).withMessage('Energy level must be between 1 and 10'),
  body('method').isIn(['voice', 'text']).withMessage('Method must be voice or text'),
], trackEventMiddleware('mood_logged'), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Ab frontend se sirf ye data aa raha hai
    const { 
      moodScore, 
      energyLevel, 
      method,
      text
    } = req.body;
    
    // AI se aane wala data (mood, emotionalState, etc.) ab null ya undefined hoga
    const newCheckIn = new CheckIn({
      user: req.user.id,
      moodScore,
      energyLevel,
      method,
      text: text || null
      // mood, emotionalState, detectedEmotions, sentimentScore ab save nahi honge
    });
    
    const checkIn = await newCheckIn.save();
    
    const user = await User.findById(req.user.id);
    
    if (!user.streak.lastCheckIn) {
      user.streak.count = 1;
      user.streak.lastCheckIn = new Date();
      user.streak.plantLevel = 'sprout';
    } else {
      const lastCheckIn = new Date(user.streak.lastCheckIn);
      const today = new Date();
      lastCheckIn.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((today - lastCheckIn) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        user.streak.count += 1;
        user.streak.lastCheckIn = new Date();
        
        if (user.streak.count >= 14) user.streak.plantLevel = 'tree';
        else if (user.streak.count >= 7) user.streak.plantLevel = 'flower';
        else if (user.streak.count >= 3) user.streak.plantLevel = 'leaf';
      } else if (diffDays > 1) {
        user.streak.count = 1;
        user.streak.lastCheckIn = new Date();
        user.streak.plantLevel = 'sprout';
      }
    }
    
    await user.save();

    // Track analytics event for mood logged
    await trackEvent(req.user.id.toString(), 'mood_logged', {
      mood: moodScore
    });

    res.json({
      checkIn,
      streak: user.streak,
    });
  } catch (err) {
    console.error('Error saving check-in:', err);
    res.status(500).json({ message: 'Error saving check-in' });
  }
});

// @route   GET api/mood/history
// @desc    Get user's mood history
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await CheckIn.countDocuments({ user: req.user.id });
    const checkIns = await CheckIn.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    res.json({ data: checkIns, page, limit, total });
  } catch (err) {
    console.error('Error fetching mood history:', err);
    res.status(500).json({ message: 'Error fetching mood history' });
  }
});

module.exports = router;
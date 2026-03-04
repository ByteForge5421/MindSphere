const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const CheckIn = require('../models/CheckIn');
const User = require('../models/User');

// @route   POST api/mood/check-in
// @desc    Save mood check-in (bina AI analysis ke)
// @access  Private
router.post('/check-in', auth, async (req, res) => {
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
    const checkIns = await CheckIn.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json(checkIns);
  } catch (err) {
    console.error('Error fetching mood history:', err);
    res.status(500).json({ message: 'Error fetching mood history' });
  }
});

module.exports = router;
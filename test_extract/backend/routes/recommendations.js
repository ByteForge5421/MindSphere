const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    res.json([]); 
  } catch (err) {
    console.error('Error in recommendations route:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
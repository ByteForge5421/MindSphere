// routes/plants.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

router.get("/growth", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("streak");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      streakCount: user.streak.count,
      plantLevel: user.streak.plantLevel,
      lastCheckIn: user.streak.lastCheckIn,
    });
  } catch (err) {
    console.error("Error fetching plant growth data:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

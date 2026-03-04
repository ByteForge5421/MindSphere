// routes/plants.js
const express = require("express");
const router = express.Router();

router.get("/growth", (req, res) => {
  res.json({
    streakCount: 5,
    plantLevel: "sprout",
    lastCheckIn: new Date().toISOString(),
    nextLevelAt: 7,
  });
});

module.exports=router;

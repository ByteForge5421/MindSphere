const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const auth = require("../middleware/auth");
const { getSuggestions } = require("../services/geminiService");

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many AI requests. Please try again later."
  }
});

router.post("/suggestions", auth, aiLimiter, async (req, res) => {
  try {
    const { userInput } = req.body;
    if (!userInput) {
      return res.status(400).json({ error: "userInput is required" });
    }

    const suggestions = await getSuggestions(userInput);
    res.json({ suggestions });
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({ error: "Failed to fetch suggestions" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const { getSuggestions } = require("../services/geminiService");

router.post("/suggestions", async (req, res) => {
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

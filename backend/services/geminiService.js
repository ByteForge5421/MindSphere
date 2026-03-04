require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function getSuggestions(userInput) {
  try {
    const prompt = `
User mood/input: "${userInput}"

Give 2 short, practical, comforting suggestions.
Respond ONLY in English.
Be a little informal and friendly.
Return strictly a bullet point list.
Also suggest:
- one related music
- one related article I might like to read.
`;

    const response = await client.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    return response.text();
  } catch (err) {
    console.error("Gemini API failed:", err.message);

    // Fallback so your app never breaks
    return `
- Take a few slow deep breaths and give yourself a short break.
- Write down what you're feeling to clear your mind.
- 🎵 Music: Try a calm lo-fi playlist.
- 📖 Article: Read about simple mindfulness techniques.
`;
  }
}

module.exports = { getSuggestions };

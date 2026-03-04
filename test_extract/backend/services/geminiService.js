require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getSuggestions(userInput) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = `User mood/input: "${userInput}"
Give 2 short, practical, comforting suggestions.
Respond ONLY in English.
Also be a little bit informal and comfortable with user
Return strictly a bullet pointlist.
Suggest a related music and a related article too that 
i would like to read in that current mood`;


  const result = await model.generateContent(prompt);
  return result.response.text();
}

module.exports = { getSuggestions };

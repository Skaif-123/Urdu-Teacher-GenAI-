require("dotenv").config({
  path: "E:/Proper Full Working Projects 2025/UrduLearner/.env",
});

const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require("@google/genai");

console.log("KEY:", process.env.G_API_KEY);
const ai = new GoogleGenAI({ apiKey: process.env.G_API_KEY });

// Read system instruction from file
const systemInstruction = fs.readFileSync(
  path.join(__dirname, 'system-instruction.txt'), 
  'utf8'
);

const review = async function generateContent(prompt) {
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction: systemInstruction,
    },
  });
  console.log(result.text);
  return result.text;
};

module.exports = review;

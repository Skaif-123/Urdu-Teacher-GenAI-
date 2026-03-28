require("dotenv").config({
  path: "UrduLearner/BackEnd/.env",
});

const fs = require("fs");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.G_API_KEY });

// Load Book
const bookText = fs.readFileSync(
  path.join(__dirname, "system-instruction.txt"),
  "utf8"
);

// ⚠️ Limit book size (important)
const limitedBook = bookText.slice(0, 8000); // avoid token overload

// ===============================
// 💬 Chat Memory
// ===============================
const chatHistory = [];

function formatHistory(history) {
  return history
    .map((msg) => `${msg.role}: ${msg.content}`)
    .join("\n");
}

// ===============================
// 🤖 Main Function
// ===============================
const review = async function generateContent(prompt) {
  const historyText = formatHistory(chatHistory);

  const finalPrompt = `
You are an Urdu teacher who teaches in Hindi language with an Urdu tone.Use very less input tokens

Style:
- Write in simple Hindi (not pure Hindi)
- Add Urdu words naturally (jaise: alfaaz, zabaan, talafuz)
- When needed, show Urdu letters (ا, ب, پ, ت)
- Keep explanation simple and clear
- Talk like a friendly teacher

Book Usage:
- You have a reference book below
- Use it ONLY when needed
- If you use it, subtly refer (jaise: "is kitaab ke hisaab se...")
- Don't dump book content
- Use very less tokens 

-----------------------
📘 Book Content:
${limitedBook}

-----------------------
💬 Conversation:
${historyText}

-----------------------
🎯 User Question:
${prompt}

-----------------------
Answer format:
- Short explanation
- Example (if possible)
- Show Urdu letters if relevant
`;

  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: [
      {
        role: "user",
        parts: [{ text: finalPrompt }],
      },
    ],
  });

  const answer = result.text;

  // Save memory
  chatHistory.push({ role: "user", content: prompt });
  chatHistory.push({ role: "assistant", content: answer });

  // limit memory
  if (chatHistory.length > 6) {
    chatHistory.splice(0, chatHistory.length - 6);
  }

  return answer;
};

module.exports = review;

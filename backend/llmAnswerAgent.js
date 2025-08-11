// llmAnswerAgent.js
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const { OpenAI } = require("openai");

// Single client instance
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Model for plain Q&A (no tools)
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

/**
 * Answer general knowledge questions (no browsing/tools).
 * Returns a plain string.
 */
exports.answerQuestion = async (question) => {
  const sys = "You are a concise, helpful assistant. Keep answers direct.";
  const res = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: sys },
      { role: "user", content: question },
    ],
    temperature: 0.3,
  });

  return res.choices?.[0]?.message?.content?.trim() || "I’m not sure.";
};

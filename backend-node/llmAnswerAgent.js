// backend/llmAnswerAgent.js
require("dotenv").config();
const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Answer a general question via OpenAI.
 * @param {string} question
 * @returns {Promise<string>}
 */
exports.answerWithLLM = async (question) => {
  const res = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: question }],
  });
  return res.choices[0].message.content.trim();
};

// backend/intentParser.js

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Parses user input into:
 * - {url:null, action:"answer", item:<question>} for general Q&A
 * - {url:<fullURL>, action:<task>, item:<item>} for browser tasks
 */
exports.parseIntent = async (message) => {
  const prompt = `
You are an assistant that decides whether a user command is for browser automation or general Q&A.
Given the input message: """${message}"""

If it's a general knowledge question (e.g. "Who is the first prime minister of India?"), respond with:
{
  "url": null,
  "action": "answer",
  "item": "<the exact question text>"
}

If it's a browser automation request (e.g. "Open Amazon and search for wireless earbuds"), respond with:
{
  "url": "<website domain or name>",
  "action": "<short task like 'search' or 'play'>",
  "item": "<specific item or query>"
}

Return only the JSON object and nothing else.
`;

  const res = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0.2,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = res.choices[0].message.content.trim();
  const parsed = JSON.parse(raw);

  // If this is a browser task, normalize the URL
  if (parsed.url) {
    let u = parsed.url.toLowerCase().trim();

    // Remove any trailing slashes
    u = u.replace(/\/+$/, "");

    // If missing scheme, add it
    if (!/^https?:\/\//.test(u)) {
      // If it contains a dot (e.g., "example.com" or "sub.domain"), just add https://
      if (u.includes(".")) {
        u = `https://${u}`;
      } else {
        // Bare hostname like "amazon" or "youtube"
        u = `https://www.${u}.com`;
      }
    }

    parsed.url = u;
  }

  return parsed;
};

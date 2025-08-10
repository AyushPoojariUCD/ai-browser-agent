// backend/llmActionPlanner.js

const { OpenAI } = require("openai");
require("dotenv").config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Given the current page HTML, a user task, and the item/query,
 * returns a strict JSON array of automation steps:
 * [ { action: "type"|"click", selector: "...", value?: "..." }, ... ]
 */
exports.getActionSteps = async ({ html, task, item }) => {
  const prompt = `
You're a browser automation planner.

Here is the HTML of the current page:
---
${html}
---

The user wants to: "${task}"
The target content is: "${item}"

Return a pure JSON array of steps in this format:

[
  { "action": "type", "selector": "<CSS selector>", "value": "<what to type>" },
  { "action": "click", "selector": "<CSS selector>" }
]

Ensure that when the action is "type", you use the full "item" value.
Do NOT wrap the JSON in markdown or code fences—just output the JSON array.
`;

  const res = await openai.chat.completions.create({
    model: "gpt-4",
    temperature: 0.3,
    messages: [{ role: "user", content: prompt }],
  });

  let raw = res.choices[0].message.content.trim();
  // Strip markdown fences if any
  raw = raw.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("❌ Failed to parse steps JSON:", e, "\nRaw response:", raw);
    throw new Error("Invalid JSON from llmActionPlanner");
  }
};

// backend/mcp.js
<<<<<<< HEAD
const puppeteer = require('puppeteer');
const { extractIntent } = require('./parser');
const automateAmazon = require('./siteHandlers/amazon');
const automateTesco = require('./siteHandlers/tesco');

async function executeCommand(message) {
  const intent = extractIntent(message);
if (!intent || !intent.site || !intent.action || !intent.object) {
  console.log("❌ Missing key intent fields:");
  console.log("Site:", intent.site);
  console.log("Action:", intent.action);
  console.log("Object:", intent.object);
}


  if (!intent || !intent.site || !intent.action) {
    return `❌ Could not understand your command. Intent: ${JSON.stringify(intent)}`;
  }

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    if (intent.site === 'amazon') {
      return await automateAmazon(page, intent);
    }

    if (intent.site === 'tesco') {
      return await automateTesco(page, intent);
    }

    return `❌ Site "${intent.site}" is not supported.`;
  } catch (err) {
    console.error("Automation Error:", err);
    return `❌ Automation failed: ${err.message}`;
  }
}

module.exports = { executeCommand };
=======

const express = require("express");
const router = express.Router();
const { parseIntent }   = require("./intentParser");
const { answerWithLLM } = require("./llmAnswerAgent");
const { runAgentTask }  = require("./agentExecutor");

router.post("/run", async (req, res) => {
  const { message } = req.body;

  try {
    // 1. Parse intent
    const { url, action, item } = await parseIntent(message);

    // 2. If it's a general Q&A, answer directly
    if (action === "answer" && !url) {
      const answer = await answerWithLLM(item);
      return res.json({ status: "answered", answer });
    }

    // 3. Otherwise, run the browser automation
    const result = await runAgentTask({ url, action, item });
    return res.json({ status: "executed", result });
  } catch (err) {
    console.error("🔥 MCP Error:", err);
    return res.status(500).json({ status: "error", message: err.message });
  }
});

module.exports = router;
>>>>>>> c2c21c7 (Backend code updated.)

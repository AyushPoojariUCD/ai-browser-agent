// backend/mcp.js
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

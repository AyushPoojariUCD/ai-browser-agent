// backend/agentRouter.js
const express = require("express");
const router = express.Router();
const { runAgentTask } = require("./agentExecutor");

// Safely extract a STRING prompt from many shapes
function coercePrompt(body) {
  try {
    if (typeof body === "string") return body.trim();

    if (!body || typeof body !== "object") return "";

    // If prompt is already a string
    if (typeof body.prompt === "string") return body.prompt.trim();

    // If prompt is an object like { role, content }
    if (body.prompt && typeof body.prompt === "object" && typeof body.prompt.content === "string") {
      return body.prompt.content.trim();
    }

    // If chat-style messages array
    if (Array.isArray(body.messages)) {
      const lastUser = [...body.messages].reverse().find(
        (m) => m && m.role === "user" && typeof m.content === "string"
      );
      if (lastUser?.content) return lastUser.content.trim();
    }

    // Other common fields
    if (typeof body.message === "string") return body.message.trim();
    if (typeof body.text === "string") return body.text.trim();
    if (typeof body.query === "string") return body.query.trim();

    // Nothing stringy found
    return "";
  } catch {
    return "";
  }
}

router.post("/run", async (req, res) => {
  try {
    const prompt = coercePrompt(req.body);
    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt (string)" });
    }

    // Build final payload that Python expects: ALWAYS a string prompt
    const payload = { prompt };

    // Debug log to confirm we're sending a string
    console.log("[agentRouter] -> PY payload:", payload);

    const py = await runAgentTask(payload);

    if (!py.error) return res.json(py);

    return res.status(502).json({ error: py.error || "Agent unavailable" });
  } catch (err) {
    console.error("💥 /agent/run error:", err);
    return res.status(500).json({ error: "Agent failed to run" });
  }
});

module.exports = router;

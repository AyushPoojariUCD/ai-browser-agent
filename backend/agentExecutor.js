// backend/agentExecutor.js
const axios = require("axios");

// Accept { prompt } and pass straight to Python.
exports.runAgentTask = async ({ prompt }) => {
  try {
    if (typeof prompt !== "string" || !prompt.trim()) {
      throw new Error("Prompt must be a non-empty string");
    }

    const resp = await axios.post(
      "http://localhost:8000/api/agent",
      { prompt: prompt.trim() },
      { timeout: 180000 }
    );

    const ok = resp.data?.detail === "✅ Task completed";
    return {
      result: ok ? resp.data.detail : "✅ Task completed",
      raw: resp.data,
    };
  } catch (err) {
    console.error("🔥 Python agent error:", err.response?.data || err.message);
    const detail = err.response?.data?.detail || err.message;
    return { result: "❌ Failed to complete task.", error: detail };
  }
};

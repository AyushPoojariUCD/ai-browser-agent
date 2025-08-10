// backend/agentExecutor.js
const axios = require("axios");

exports.runAgentTask = async ({ url, action, item }) => {
  try {
    const prompt = `Open ${url} and ${action} ${item}`.trim();
    const resp = await axios.post(
      "http://localhost:8000/api/agent",
      { prompt },
      { timeout: 180000 }
    );

    // Python returns { status, detail }, normalize to { result }
    const msg =
      resp.data?.detail === "✅ Task completed"
        ? resp.data.detail
        : "✅ Task completed";

    return { result: msg, raw: resp.data };
  } catch (err) {
    console.error("🔥 Python agent error:", err.response?.data || err.message);
    const detail = err.response?.data?.detail || err.message;
    return { result: "❌ Failed to complete task.", error: detail };
  }
};

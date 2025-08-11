// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const agentRouter = require("./agentRouter");

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || true, // allow any if not set
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// ❌ remove this: app.options("*", cors());

app.use(express.json({ limit: "2mb" }));

app.get("/", (_req, res) => {
  res.json({ ok: true, service: "node-backend", ts: new Date().toISOString() });
});

app.use("/agent", agentRouter);

const PORT = Number(process.env.PORT || 5001);
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

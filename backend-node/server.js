<<<<<<< HEAD
// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const commandRoutes = require('./routes/commandRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json()); // ensure this is present
app.use('/api/command', require('./routes/commandRoutes'));


app.listen(PORT, () => {
  console.log(`✅ MCP Server running at http://localhost:${PORT}`);
=======
// backend/server.js

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const mcpRouter = require("./mcp");

const app = express();

// 1. Enable CORS for your front-end (adjust origin as needed)
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET","POST","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true,
}));

// 2. Parse JSON bodies
app.use(express.json());

// 3. Mount the MCP router at /agent
app.use("/agent", mcpRouter);

// 4. Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
>>>>>>> c2c21c7 (Backend code updated.)
});

const express = require('express');
const router = express.Router();
const mcp = require('../mcp');

router.post('/', async (req, res) => {
    const { message } = req.body;
    try {
        const result = await mcp.processCommand(message);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

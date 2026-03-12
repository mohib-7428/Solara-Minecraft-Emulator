const express = require('express');
const cors = require('cors');
const app = express();

// 1. MUST be at the very top. 
// This sends the "permission" headers for EVERY request.
app.use(cors()); 
app.use(express.json());

let players = {};

// 2. We use app.use for /sync to catch ANY method (GET, POST, OPTIONS)
app.use('/sync', (req, res) => {
    // Check for data in both query (GET) and body (POST)
    const data = (Object.keys(req.query).length > 0) ? req.query : req.body;
    const { id, x, y, z, r } = data;

    if (id) {
        players[id] = {
            pos: { x: parseFloat(x) || 0, y: parseFloat(y) || 0, z: parseFloat(z) || 0 },
            rot: parseFloat(r) || 0,
            lastSeen: Date.now()
        };
    }

    // Cleanup inactive players
    const now = Date.now();
    Object.keys(players).forEach(pId => {
        if (now - players[pId].lastSeen > 10000) delete players[pId];
    });

    // Explicitly send a 200 status so the browser is happy
    res.status(200).json(players);
});

// 3. Add a root route to verify the server is actually alive
app.get('/', (req, res) => res.send("Minecraft Server is Live!"));

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
    console.log(`Bypass Server live on port ${port}`);
});

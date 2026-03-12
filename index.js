const express = require('express');
const cors = require('cors');
const app = express();

// Force CORS for everything
app.use(cors()); 

let players = {};

// Using .all allows us to handle both GET and POST just in case
app.all('/sync', (req, res) => {
    // Check both query (GET) and body (POST)
    const data = req.method === 'GET' ? req.query : req.body;
    const { id, x, y, z, r } = data;

    if (id) {
        players[id] = {
            pos: { x: parseFloat(x) || 0, y: parseFloat(y) || 0, z: parseFloat(z) || 0 },
            rot: parseFloat(r) || 0,
            lastSeen: Date.now()
        };
    }

    // Cleanup
    const now = Date.now();
    Object.keys(players).forEach(pId => {
        if (now - players[pId].lastSeen > 10000) delete players[pId];
    });

    res.json(players);
});

// Add a root route so you don't see "Not Found" when visiting the main URL
app.get('/', (req, res) => res.send("Server is Healthy"));

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
    console.log(`Bypass Server live on port ${port}`);
});

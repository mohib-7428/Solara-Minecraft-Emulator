const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for your Netlify domain
app.use(cors({ origin: "*" })); 
app.use(express.json());

let players = {};

// GET route: School filters almost never block standard GET requests
app.get('/sync', (req, res) => {
    const { id, x, y, z, r } = req.query;
    
    if (id) {
        players[id] = {
            pos: { x: parseFloat(x), y: parseFloat(y), z: parseFloat(z) },
            rot: parseFloat(r),
            lastSeen: Date.now()
        };
    }

    // Remove inactive players (10 sec timeout)
    const now = Date.now();
    Object.keys(players).forEach(pId => {
        if (now - players[pId].lastSeen > 10000) delete players[pId];
    });

    res.json(players);
});

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
    console.log(`Minecraft Bypass Server live on port ${port}`);
});

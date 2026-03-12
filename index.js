const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let players = {};

// Instead of WSS, we use a POST route
app.post('/sync', (req, res) => {
    const { id, pos, rot } = req.body;
    if (id) {
        players[id] = { pos, rot, lastSeen: Date.now() };
    }
    
    // Clean up old players (inactive for 10 seconds)
    const now = Date.now();
    for (let pId in players) {
        if (now - players[pId].lastSeen > 10000) delete players[pId];
    }

    res.json(players); 
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Bypass Server on port ${port}`));

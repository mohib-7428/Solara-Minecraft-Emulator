const WebSocket = require('ws');

// Railway automatically sets the PORT variable
const port = process.env.PORT || 8080;

const wss = new WebSocket.Server({ port }, () => {
    console.log(`WSS Server is live on port ${port}`);
});

wss.on('connection', (ws) => {
    console.log('New player joined!');
    
    ws.on('message', (data) => {
        // Broadcast to everyone else
        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    });
});

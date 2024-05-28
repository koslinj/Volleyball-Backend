const { WebSocketServer } = require('ws');
const { verifyToken } = require('../middleware/authMiddleware');

let wss;

const liveHandler = (server) => {
  wss = new WebSocketServer({ server, path: "/live" });

  wss.on('connection', async (ws, req) => {
    // Extract and verify token from query params or headers
    const token = req.url.split('token=')[1];
    try {
      const user = await verifyToken(token);
      if (!user) {
        console.log("CLOSING CONNECTION")
        ws.close(1008, 'Forbidden');
        return;
      }
    } catch (error) {
      console.log("CLOSING CONNECTION")
      ws.close(1008, 'Forbidden');
      return;
    }

    ws.on('message', async (message) => {
      const data = JSON.parse(message);
      console.log(data)
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });

    ws.send(JSON.stringify({ type: 'test', data: "OD SERWERA" }))
  });
};

const getWss = () => wss;

module.exports = { liveHandler, getWss };

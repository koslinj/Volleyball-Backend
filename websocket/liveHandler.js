const { WebSocketServer } = require('ws');
const { verifyToken } = require('../middleware/authMiddleware');
const { fetchMatchDetailsById } = require('../functions/matches')
const { isSetEnded } = require('../functions/live')
const { client } = require('../db');

let wss;

const liveHandler = (server) => {
  wss = new WebSocketServer({ server, path: "/live" });

  wss.on('connection', async (ws, req) => {

    ws.on('message', async (message) => {
      const data = JSON.parse(message);
      const match = await fetchMatchDetailsById(data.match_id);
      const arr = match.result_detailed.resD
      const last = arr[arr.length - 1]
      const setEnded = await isSetEnded(last.split(':').map(Number))
      ws.send(JSON.stringify({ ...match, setEnded }))
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });

    // Extract and verify token from query params or headers
    const token = req.url.split('token=')[1];
    try {
      const user = await verifyToken(token);
      if (!user) {
        console.log("CLOSING CONNECTION")
        ws.close(1008, 'Forbidden');
        return;
      }
      // Attach the token or user information to the ws instance
      ws.token = token;
      ws.user = user;
    } catch (error) {
      console.log("CLOSING CONNECTION")
      ws.close(1008, 'Forbidden');
      return;
    }
  });
};

const getWss = () => wss;

module.exports = { liveHandler, getWss };

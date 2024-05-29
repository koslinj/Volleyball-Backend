const express = require('express');
const router = express.Router();
const { addPoint } = require('../../functions/live');
const { verifyTokenMiddleware } = require('../../middleware/authMiddleware')
// Import the WebSocket server instance
const { getWss } = require('../../websocket/liveHandler');
const { WebSocket } = require('ws');

router.post('/', verifyTokenMiddleware, async (req, res) => {
  if (req.userRole === "referee") {
    const { match_id, team_id } = req.body;
    const row = await addPoint(match_id, team_id);

    const wss = getWss();
    // Broadcast the new match to all connected WebSocket clients
    if (wss) {
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(row));
        }
      });
    }

    res.send(row);
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
});

module.exports = router;
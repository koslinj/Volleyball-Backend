const express = require('express');
const router = express.Router();
const { addPoint } = require('../../functions/live');
const { verifyTokenMiddleware, verifyToken } = require('../../middleware/authMiddleware')
// Import the WebSocket server instance
const { getWss } = require('../../websocket/liveHandler');
const { WebSocket } = require('ws');

async function checkToken(client) {
  try {
    const user = await verifyToken(client.token);
    if (!user) {
      console.log("CLOSING CONNECTION")
      client.close(1008, 'Forbidden');
      return false
    }
  } catch (error) {
    console.log("CLOSING CONNECTION")
    client.close(1008, 'Forbidden');
    return false
  }
  return true
}

function broadcastToAll(data) {
  const wss = getWss();
  // Broadcast the new match to all connected WebSocket clients
  if (wss) {
    wss.clients.forEach(async client => {
      const valid = await checkToken(client)
      if (!valid) return

      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }
}

router.post('/add', verifyTokenMiddleware, async (req, res) => {
  if (req.userRole === "referee") {
    const { match_id, team_id } = req.body;
    const row = await addPoint(match_id, team_id);

    broadcastToAll(row)
    res.send(row);
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
});

module.exports = router;
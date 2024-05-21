const express = require('express');
const router = express.Router();
const { fetchAllMatches, fetchMatchesByStatus } = require('../functions/matches');
const { verifyToken } = require('../middleware/authMiddleware')

// Protected route
router.get('/matches/all', verifyToken, async (req, res) => {
  if (req.userRole === "observator") {
    const rows = await fetchAllMatches();
    res.send(rows)
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
});

// Protected route
router.get('/matches/all/:status', verifyToken, async (req, res) => {
  if (req.userRole === "observator") {
    const rows = await fetchMatchesByStatus(req.params.status);
    res.send(rows)
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
});

module.exports = router;

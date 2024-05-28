const express = require('express');
const router = express.Router();
const { fetchAllMatches, fetchMatchesByStatus, fetchMatchDetailsById } = require('../functions/matches');
const { verifyTokenMiddleware } = require('../middleware/authMiddleware')

// Protected route
router.get('/matches/all', verifyTokenMiddleware, async (req, res) => {
  if (req.userRole === "observator") {
    const rows = await fetchAllMatches();
    res.send(rows)
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
});

// Protected route
router.get('/matches/all/:status', verifyTokenMiddleware, async (req, res) => {
  if (req.userRole === "observator") {
    const rows = await fetchMatchesByStatus(req.params.status);
    res.send(rows)
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
});

// Protected route
router.get('/matches/:id', verifyTokenMiddleware, async (req, res) => {
  if (req.userRole === "observator") {
    const rows = await fetchMatchDetailsById(req.params.id);
    res.send(rows)
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
});

module.exports = router;

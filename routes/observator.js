const express = require('express');
const router = express.Router();
const { fetchAllMatches, fetchMatchesByStatus, fetchMatchDetailsById } = require('../functions/matches');
const { verifyTokenMiddleware } = require('../middleware/authMiddleware')

// Protected route
router.get('/matches/all', verifyTokenMiddleware, async (req, res) => {
  const rows = await fetchAllMatches();
  res.send(rows)
});

// Protected route
router.get('/matches/all/:status', verifyTokenMiddleware, async (req, res) => {
  const rows = await fetchMatchesByStatus(req.params.status);
  res.send(rows)
});

// Protected route
router.get('/matches/:id', verifyTokenMiddleware, async (req, res) => {
  const rows = await fetchMatchDetailsById(req.params.id);
  res.send(rows)
});

module.exports = router;

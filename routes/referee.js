const express = require('express');
const router = express.Router();
const { fetchMatches } = require('../functions/matches');
const { verifyToken } = require('../middleware/authMiddleware')

// Protected route
router.get('/matches', verifyToken, async (req, res) => {
  if (req.userRole === "referee") {
    const rows = await fetchMatches();
    res.send(rows)
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
});

module.exports = router;

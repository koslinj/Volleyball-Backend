const express = require('express');
const router = express.Router();
const { fetchAllMatches } = require('../functions/matches');
const { verifyToken } = require('../middleware/authMiddleware')

// Protected route
router.get('/matches', verifyToken, async (req, res) => {
  if (req.userRole === "observator") {
    const rows = await fetchAllMatches();
    res.send(rows)
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
});

module.exports = router;

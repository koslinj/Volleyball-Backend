const express = require('express');
const router = express.Router();
const { fetchAllMatches, deleteMatch } = require('../functions/matches');
const { fetchAllTeams, createTeam } = require('../functions/teams');
const { verifyToken } = require('../middleware/authMiddleware')

// Protected route
router.get('/matches', verifyToken, async (req, res) => {
  if (req.userRole === "referee") {
    const rows = await fetchAllMatches();
    res.send(rows)
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
});

// Protected route
router.delete('/matches/:id', verifyToken, async (req, res) => {
  if (req.userRole === "referee") {
    const success = await deleteMatch(req.params.id);
    if (!success) res.status(404).json({ message: 'There was a problem while deleting!' });
    res.status(200).json({ message: 'Deleted successfully!' });
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
});

// Protected route
router.get('/teams/all', verifyToken, async (req, res) => {
  if (req.userRole === "referee") {
    const rows = await fetchAllTeams();
    res.send(rows)
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
});

// Protected route
router.post('/teams', verifyToken, async (req, res) => {
  if (req.userRole === "referee") {
    const success = await createTeam(req.body);
    if (!success) res.status(404).json({ message: 'There was a problem while creating!' });
    res.status(200).json({ message: 'Created successfully!' });
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
});

module.exports = router;

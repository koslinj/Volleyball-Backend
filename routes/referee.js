const express = require('express');
const router = express.Router();
const { fetchAllMatches, deleteMatch, createMatch } = require('../functions/matches');
const { fetchAllTeams, createTeam, editTeam, deleteTeam } = require('../functions/teams');
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
router.post('/matches', verifyToken, async (req, res) => {
  if (req.userRole === "referee") {
    const row = await createMatch(req.body);
    res.send(row)
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
});

// Protected route
router.delete('/matches/:id', verifyToken, async (req, res) => {
  if (req.userRole === "referee") {
    const success = await deleteMatch(req.params.id);
    if (!success) return res.status(404).json({ message: 'There was a problem while deleting!' });
    res.status(200).json({ message: 'Deleted successfully!' });
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
});

// Protected route
router.get('/teams', verifyToken, async (req, res) => {
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
    const row = await createTeam(req.body);
    res.send(row)
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
});

// Protected route
router.post('/teams/:id', verifyToken, async (req, res) => {
  if (req.userRole === "referee") {
    const row = await editTeam(req.body, req.params.id);
    res.send(row)
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
});

// Protected route
router.delete('/teams/:id', verifyToken, async (req, res) => {
  if (req.userRole === "referee") {
    const success = await deleteTeam(req.params.id);
    if (!success) return res.status(404).json({ message: 'There was a problem while deleting!' });
    res.status(200).json({ message: 'Deleted successfully!' });
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
});

module.exports = router;

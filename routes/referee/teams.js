const express = require('express');
const router = express.Router();
const { fetchAllTeams, createTeam, editTeam, deleteTeam, fetchTeam } = require('../../functions/teams');
const { verifyTokenMiddleware } = require('../../middleware/authMiddleware')

router.get('/', verifyTokenMiddleware, async (req, res) => {
  if (req.userRole === "referee") {
    const rows = await fetchAllTeams();
    res.send(rows)
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
});

router.get('/:id', verifyTokenMiddleware, async (req, res) => {
  if (req.userRole === "referee") {
    const row = await fetchTeam(req.params.id);
    res.send(row)
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
});

router.post('/', verifyTokenMiddleware, async (req, res) => {
  if (req.userRole === "referee") {
    const { name, players } = req.body
    const row = await createTeam(name, players);
    res.send(row)
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
});

router.post('/:id', verifyTokenMiddleware, async (req, res) => {
  if (req.userRole === "referee") {
    const { name, players } = req.body
    const row = await editTeam(name, players, req.params.id);
    res.send(row)
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
});

router.delete('/:id', verifyTokenMiddleware, async (req, res) => {
  if (req.userRole === "referee") {
    const success = await deleteTeam(req.params.id);
    if (!success) return res.status(404).json({ message: 'There was a problem while deleting!' });
    res.status(200).json({ message: 'Deleted successfully!' });
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
});

module.exports = router;

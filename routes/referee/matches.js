const express = require('express');
const router = express.Router();
const { fetchAllMatches, deleteMatch, createMatch } = require('../../functions/matches');
const { verifyTokenMiddleware } = require('../../middleware/authMiddleware')

router.get('/', verifyTokenMiddleware, async (req, res) => {
  if (req.userRole === "referee") {
    const rows = await fetchAllMatches();
    res.send(rows)
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
});

router.post('/', verifyTokenMiddleware, async (req, res) => {
  if (req.userRole === "referee") {
    const { date, teama_id, teamb_id } = req.body
    const row = await createMatch(date, teama_id, teamb_id);
    res.send(row)
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
});

router.delete('/:id', verifyTokenMiddleware, async (req, res) => {
  if (req.userRole === "referee") {
    const success = await deleteMatch(req.params.id);
    if (!success) return res.status(404).json({ message: 'There was a problem while deleting!' });
    res.status(200).json({ message: 'Deleted successfully!' });
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { getConfiguration, updateConfiguration } = require('../../functions/configuration');
const { verifyToken } = require('../../middleware/authMiddleware')

router.get('/', verifyToken, async (req, res) => {
  if (req.userRole === "referee") {
    const row = await getConfiguration()
    res.send(row)
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
});

router.post('/', verifyToken, async (req, res) => {
  if (req.userRole === "referee") {
    const { sets_to_win, points_to_win_set, is_tie_break, points_to_win_tie_break } = req.body;
    const row = await updateConfiguration(sets_to_win, points_to_win_set, is_tie_break, points_to_win_tie_break)
    res.send(row)
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
});

module.exports = router;

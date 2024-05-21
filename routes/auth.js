const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { client } = require('../db');

// User login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await client.query('SELECT * FROM users WHERE login = $1', [username]);
    const user = result.rows[0];

    // Check if the user with specified login exist in the database
    if (!user) return res.status(403).json({ message: 'Incorrect username or password.' });

    // Compare the input password with the hashed password from the database
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(403).json({ message: 'Incorrect username or password.' });

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, 'secret', { expiresIn: '1h' });
    res.status(200).json({ token: token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'DB error' });
  }
});

module.exports = router;

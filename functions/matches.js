const { client } = require('../db');

const fetchMatches = async () => {
  try {
    const res = await client.query('SELECT * FROM matches');
    return res.rows;
  } catch (error) {
    console.error('Error fetching matches:', error);
    return null;
  }
};

module.exports = { fetchMatches }

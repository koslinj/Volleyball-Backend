const { client } = require('../db');

const fetchAllMatches = async () => {
  try {
    const res = await client.query(
    `SELECT m.match_date, t1.name as name_a, t2.name as name_b, m.result, m.status
    FROM matches as m
    JOIN teams AS t1
    ON m.teama_id = t1.id
    JOIN teams AS t2
    ON m.teamb_id = t2.id
    ORDER BY m.match_date DESC`);
    return res.rows;
  } catch (error) {
    console.error('Error fetching matches:', error);
    return null;
  }
};

module.exports = { fetchAllMatches }

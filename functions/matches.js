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

const fetchMatchesByStatus = async (status) => {
  try {
    const res = await client.query(
      `SELECT m.match_date, t1.name as name_a, t2.name as name_b, m.result, m.status
    FROM matches as m
    JOIN teams AS t1
    ON m.teama_id = t1.id
    JOIN teams AS t2
    ON m.teamb_id = t2.id
    WHERE m.status = $1
    ORDER BY m.match_date DESC`,
      [status]);
    return res.rows;
  } catch (error) {
    console.error('Error fetching matches:', error);
    return null;
  }
};

const fetchMatchDetailsById = async (id) => {
  try {
    const res = await client.query(
      `SELECT m.match_date, t1.name as name_a, t2.name as name_b, m.result, m.result_detailed, m.timeline, m.status
    FROM matches as m
    JOIN teams AS t1
    ON m.teama_id = t1.id
    JOIN teams AS t2
    ON m.teamb_id = t2.id
    WHERE m.id = $1`,
      [id]);
    return res.rows;
  } catch (error) {
    console.error('Error fetching matches:', error);
    return null;
  }
};

const deleteMatch = async (id) => {
  try {
    const res = await client.query(
      `DELETE FROM matches as m WHERE m.id = $1`,
      [id]
    );
    return true;
  } catch (error) {
    console.error('Error fetching matches:', error);
    return false;
  }
}

module.exports = {
  fetchAllMatches,
  fetchMatchesByStatus,
  fetchMatchDetailsById,
  deleteMatch
}

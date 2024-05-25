const { client } = require('../db');

const fetchAllTeams = async () => {
  try {
    const res = await client.query(`SELECT * FROM teams`);
    return res.rows;
  } catch (error) {
    console.error('Error fetching matches:', error);
    return null;
  }
};

module.exports = {
  fetchAllTeams,
}

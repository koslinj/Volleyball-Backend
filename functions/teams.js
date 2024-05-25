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

const createTeam = async (body) => {
  try {
    const playersJSON = { players: body.players }
    const res = await client.query(`
      INSERT INTO teams (name, players) VALUES ($1, $2) RETURNING *`,
      [body.name, playersJSON]);
    return res.rows[0];
  } catch (error) {
    console.error('Error fetching matches:', error);
    return null;
  }
};

const editTeam = async (body, id) => {
  try {
    const playersJSON = { players: body.players }
    const res = await client.query(`
      UPDATE teams
      SET name = $1, players = $2
      WHERE id = $3
      RETURNING *`,
      [body.name, playersJSON, id]);
    return res.rows[0];
  } catch (error) {
    console.error('Error fetching matches:', error);
    return null;
  }
};

const deleteTeam = async (id) => {
  try {
    const res = await client.query(
      `DELETE FROM teams WHERE id = $1`,
      [id]
    );
    return res.rowCount > 0 ? true : false;
  } catch (error) {
    console.error('Error deleting teams:', error);
    return false;
  }
}

module.exports = {
  fetchAllTeams,
  createTeam,
  editTeam,
  deleteTeam
}
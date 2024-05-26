const { client } = require('../db');

const getConfiguration = async () => {
  try {
    const res = await client.query('SELECT * FROM configuration ORDER BY id DESC LIMIT 1');
    return res.rows[0];
  } catch (error) {
    console.error('Error fetching global configuration:', error);
    return null;
  }
};

const updateConfiguration = async (
  sets_to_win,
  points_to_win_set,
  is_tie_break,
  points_to_win_tie_break
) => {
  try {
    const res = await client.query(
      `UPDATE configuration 
      SET sets_to_win = $1, points_to_win_set = $2, is_tie_break = $3, points_to_win_tie_break = $4
      WHERE id = 1
      RETURNING *
    `,
      [sets_to_win, points_to_win_set, is_tie_break, points_to_win_tie_break]
    );
    return res.rows[0];
  } catch (error) {
    console.error('Error updating global configuration:', error);
    return null;
  }
};

module.exports = {
  getConfiguration,
  updateConfiguration
}

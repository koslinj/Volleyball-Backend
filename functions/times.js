const { client } = require('../db');

const createTimeRecord = async (formattedDate, index, id) => {
  try {
    await client.query(`
    INSERT INTO times 
    (start_time, set_index, match_id) 
    VALUES ($1, $2, $3)`,
      [formattedDate, index, id]);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createTimeRecord
}
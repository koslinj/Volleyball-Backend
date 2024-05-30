const { client } = require('../db');

const countSetIndexFromRes = (res) => {
  numbers = res.split(':').map(Number);
  return numbers[0] + numbers[1]
}

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

const updateTimeRecord = async (formattedDate, index, id) => {
  try {
    await client.query(`
    UPDATE times SET end_time = $1
    WHERE set_index = $2
    AND match_id = $3`,
      [formattedDate, index, id]);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createTimeRecord,
  updateTimeRecord,
  countSetIndexFromRes
}
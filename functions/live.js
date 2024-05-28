const { client } = require('../db');

const addPoint = async (mess) => {
  try {
    //const formattedDate = date ? date : moment().format('YYYY-MM-DD HH:mm:ss')
    // const status = date ? 'PLANNED' : 'IN_PROGRESS'
    // const res = await client.query(`
    // INSERT INTO matches 
    // (match_date, teamA_id, teamB_id, result, result_detailed, timeline, status) 
    // VALUES 
    // ($1, $2, $3, '0:0', '{"resD": [], "timeout": []}', '{"timeline": []}', $4) RETURNING *`,
    //   [formattedDate, teama_id, teamb_id, status]);
    // return res.rows[0];
    return mess
  } catch (error) {
    console.error('Error fetching matches:', error);
    return null;
  }
};

module.exports = {
  addPoint
}

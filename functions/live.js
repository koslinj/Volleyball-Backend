const { client } = require('../db');

function addPointToResD(scores, team_id, teama_id, teamb_id) {
  if (team_id === teama_id) {
    scores[0]++;
  } else if (team_id === teamb_id) {
    scores[1]++;
  }
  return scores
}

function isSetEnded(scores) {
  if (Math.abs(scores[0] - scores[1]) >= 2 && (scores[0] >= 25 || scores[1] >= 25)) {
    return true
  }
}

function updateScore(res, resD, team_id, teama_id, teamb_id) {
  let lastScore = resD[resD.length - 1];
  let scores = lastScore.split(':').map(Number);
  scores = addPointToResD(scores, team_id, teama_id, teamb_id)
  resD[resD.length - 1] = scores.join(':')
  if (isSetEnded(scores)) {
    resD.push("0:0");
    let res_nums = res.split(':').map(Number);
    if (res_nums[0] === 3 || res_nums[1] === 3) {
      //MATCH ENDED
    }
    if (team_id === teama_id) {
      res_nums[0]++
    } else if (team_id === teamb_id) {
      res_nums[1]++;
    }
    res = res_nums.join(':')
  }

  return { res, resD };
}

const addPoint = async (match_id, team_id) => {
  try {
    const match_raw = await client.query(`SELECT * FROM matches WHERE id = $1`, [match_id])
    const match = match_raw.rows[0]
    let actual_res = match.result
    let actual_resD = match.result_detailed.resD
    let actual_timeout = match.result_detailed.timeout

    const updated = updateScore(actual_res, actual_resD, team_id, match.teama_id, match.teamb_id);
    match.result_detailed.resD = updated.resD
    console.log(updated.res)
    console.log(match.result_detailed)
    const res = await client.query(`
    UPDATE matches 
    SET result = $1,
    result_detailed = $2 
    WHERE id = $3 
    RETURNING *`,
      [updated.res, match.result_detailed, match_id]);
    return res.rows[0];
  } catch (error) {
    console.error('Error fetching matches:', error);
    return null;
  }
};

module.exports = {
  addPoint
}

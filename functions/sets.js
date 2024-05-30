const { client } = require('../db');

function changeGeneralResult(scores, res) {
  let x = res.split(':').map(Number);
  if (scores[0] > scores[1]) {
    x[0]++
  } else {
    x[1]++
  }
  return x.join(':')
}

function updateSets(res, detailed, timeline_outer) {
  let lastScore = detailed.resD[detailed.resD.length - 1];
  let scores = lastScore.split(':').map(Number);
  res = changeGeneralResult(scores, res)
  detailed.resD.push("0:0")
  detailed.timeout.push("0:0")
  timeline_outer.timeline.push([])

  return { res, detailed, timeline_outer };
}

const finishSet = async (match_id) => {
  try {
    const match_raw = await client.query(`SELECT * FROM matches WHERE id = $1`, [match_id])
    const match = match_raw.rows[0]
    let actual_res = match.result
    let actual_detailed = match.result_detailed
    let timeline_outer = match.timeline

    const updated = updateSets(actual_res, actual_detailed, timeline_outer);

    const res = await client.query(`
    UPDATE matches 
    SET result = $1,
    result_detailed = $2,
    timeline = $3
    WHERE id = $4 
    RETURNING *`,
      [updated.res, updated.detailed, updated.timeline_outer, match_id]);
    return res.rows[0];
  } catch (error) {
    console.error('Error fetching matches:', error);
    return null;
  }
};

module.exports = {
  finishSet
}

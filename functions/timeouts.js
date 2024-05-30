const { getConfiguration } = require('./configuration')
const { client } = require('../db');
const { fetchMatchDetailsById } = require('./matches')

async function updateTimelineTimeouts(match_id, team_id, teama_id, teamb_id) {
  const match_raw = await client.query(`SELECT * FROM matches WHERE id = $1`, [match_id])
  const match = match_raw.rows[0]
  let timeline_outer = match.timeline
  let timeline_inner = timeline_outer.timeline
  let arr = timeline_inner[timeline_inner.length - 1]

  if (team_id === teama_id) {
    arr.push('ta')
  } else if (team_id === teamb_id) {
    arr.push('tb')
  }
  
  timeline_inner[timeline_inner.length - 1] = arr
  timeline_outer.timeline = timeline_inner
  await client.query(
    `UPDATE matches SET timeline = $1 WHERE id = $2`,
    [timeline_outer, match_id]
  );
}

function handleAddTimeout(team_id, teama_id, teamb_id, timeouts) {
  if (team_id === teama_id) {
    timeouts[0]++;
    if (timeouts[0] > 2) timeouts[0] = 2
  } else if (team_id === teamb_id) {
    timeouts[1]++;
    if (timeouts[1] > 2) timeouts[1] = 2
  }
  return timeouts
}

function updateTimeouts(detailed, team_id, teama_id, teamb_id) {
  let lastScore = detailed.timeout[detailed.timeout.length - 1];
  console.log(lastScore)
  let timeouts = lastScore.split(':').map(Number);
  timeouts = handleAddTimeout(team_id,teama_id,teamb_id,timeouts)

  let newScore = timeouts.join(':')
  console.log(newScore)
  detailed.timeout[detailed.timeout.length - 1] = newScore

  let changed = false
  if(lastScore !== newScore){
    changed = true
  }

  return { detailed, changed };
}

const requestTimeout = async (match_id, team_id) => {
  try {
    const match_raw = await client.query(`SELECT * FROM matches WHERE id = $1`, [match_id])
    const match = match_raw.rows[0]
    let actual_detailed = match.result_detailed

    const updated = updateTimeouts(actual_detailed, team_id, match.teama_id, match.teamb_id);
    if(updated.changed){
      await updateTimelineTimeouts(match_id, team_id, match.teama_id, match.teamb_id)
    }

    const res = await client.query(`
    UPDATE matches 
    SET result_detailed = $1
    WHERE id = $2
    RETURNING *`,
      [updated.detailed, match_id]);
    return res.rows[0];
  } catch (error) {
    console.error('Error fetching matches:', error);
    return null;
  }
};

module.exports = {
  requestTimeout
}
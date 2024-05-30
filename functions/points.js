const { getConfiguration } = require('./configuration')
const { client } = require('../db');
const { fetchMatchDetailsById } = require('./matches')

async function isMatchEnded(res, scores) {
  const config = await getConfiguration()
  const n = config.sets_to_win
  if (await isSetEnded(res, scores)) {
    let res_arr = res.split(':').map(Number);
    if (res_arr[0] === n - 1 && scores[0] > scores[1]) {
      return true
    } else if (res_arr[1] === n - 1 && scores[1] > scores[0]) {
      return true
    }
  }
  return false
}

function calculateIfEnd(scores, max) {
  if (Math.abs(scores[0] - scores[1]) >= 2 && (scores[0] >= max || scores[1] >= max)) {
    return true
  }
  return false
}

async function isSetEnded(res, scores) {
  const config = await getConfiguration()
  const max = config.points_to_win_set
  const max_tb = config.points_to_win_tie_break
  const is_tb = config.is_tie_break
  const n = config.sets_to_win

  if (is_tb) {
    let res_arr = res.split(':').map(Number)
    if (res_arr[0] === n - 1 && res_arr[1] === n - 1) {
      return calculateIfEnd(scores, max_tb)
    } else {
      return calculateIfEnd(scores, max)
    }
  } else {
    return calculateIfEnd(scores, max)
  }

  return false
}

function addPointToResD(scores, team_id, teama_id, teamb_id) {
  if (team_id === teama_id) {
    scores[0]++;
  } else if (team_id === teamb_id) {
    scores[1]++;
  }
  return scores
}

function subtractPointFromResD(scores, team_id, teama_id, teamb_id) {
  if (team_id === teama_id) {
    scores[0]--
    if (scores[0] < 0) scores[0] = 0
  } else if (team_id === teamb_id) {
    scores[1]--
    if (scores[1] < 0) scores[1] = 0
  }
  return scores
}

async function subtractPoints(res, resD, team_id, teama_id, teamb_id) {
  let lastScore = resD[resD.length - 1];
  let scores = lastScore.split(':').map(Number);
  scores = subtractPointFromResD(scores, team_id, teama_id, teamb_id)

  resD[resD.length - 1] = scores.join(':')
  let setEnded = await isSetEnded(res, scores)
  let matchEnded = await isMatchEnded(res, scores)
  if (matchEnded) setEnded = false
  return { resD, setEnded, matchEnded };
}

async function addPoints(res, resD, team_id, teama_id, teamb_id) {
  let lastScore = resD[resD.length - 1];
  let scores = lastScore.split(':').map(Number);
  let setEnded = await isSetEnded(res, scores)
  if (!setEnded) {
    scores = addPointToResD(scores, team_id, teama_id, teamb_id)
  }
  resD[resD.length - 1] = scores.join(':')
  setEnded = await isSetEnded(res, scores)
  let matchEnded = await isMatchEnded(res, scores)
  if (matchEnded) setEnded = false
  return { resD, setEnded, matchEnded };
}

async function updateTimelinePoints(match_id, actual) {
  const match_raw = await client.query(`SELECT * FROM matches WHERE id = $1`, [match_id])
  const match = match_raw.rows[0]
  let timeline_outer = match.timeline
  let timeline_inner = timeline_outer.timeline
  let arr = timeline_inner[timeline_inner.length - 1]
  arr.push(actual)
  timeline_inner[timeline_inner.length - 1] = arr
  timeline_outer.timeline = timeline_inner
  await client.query(
    `UPDATE matches SET timeline = $1 WHERE id = $2`,
    [timeline_outer, match_id]
  );
}

const addOrSubtractPoint = async (match_id, team_id, choice) => {
  try {
    const match_raw = await client.query(`SELECT * FROM matches WHERE id = $1`, [match_id])
    const match = match_raw.rows[0]
    let actual_resD = match.result_detailed.resD
    let lastScore = actual_resD[actual_resD.length - 1];
    let scores = lastScore.split(':').map(Number);

    let updated
    if (choice === 'add') {
      updated = await addPoints(match.result, actual_resD, team_id, match.teama_id, match.teamb_id);
      if (updated.resD[0] === "1:0" || updated.resD[0] === "0:1") {
        await client.query(
          `UPDATE matches SET status='IN_PROGRESS' WHERE id = $1`,
          [match_id]
        );
      }
      let setEnded = await isSetEnded(match.result, scores)
      if (!setEnded) {
        await updateTimelinePoints(match_id, updated.resD[updated.resD.length - 1])
      }
    } else if (choice === 'subtract') {
      updated = await subtractPoints(match.result, actual_resD, team_id, match.teama_id, match.teamb_id);
      await updateTimelinePoints(match_id, updated.resD[updated.resD.length - 1])
    }

    match.result_detailed.resD = updated.resD
    const res = await client.query(`
    UPDATE matches 
    SET result_detailed = $1 
    WHERE id = $2`,
      [match.result_detailed, match_id]);

    const final = await fetchMatchDetailsById(match_id)
    return { ...final, setEnded: updated.setEnded, matchEnded: updated.matchEnded }
  } catch (error) {
    console.error('Error fetching matches:', error);
    return null;
  }
};

module.exports = {
  addOrSubtractPoint,
  isSetEnded,
  isMatchEnded
}
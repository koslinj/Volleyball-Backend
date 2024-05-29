const { client } = require('../db');
const { getConfiguration } = require('./configuration')
const { fetchMatchDetailsById } = require('./matches')

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

async function isSetEnded(scores) {
  const config = await getConfiguration()
  const max = config.points_to_win_set
  if (Math.abs(scores[0] - scores[1]) >= 2 && (scores[0] >= max || scores[1] >= max)) {
    return true
  }
  return false
}

async function subtractPoints(resD, team_id, teama_id, teamb_id) {
  let lastScore = resD[resD.length - 1];
  let scores = lastScore.split(':').map(Number);
  scores = subtractPointFromResD(scores, team_id, teama_id, teamb_id)

  resD[resD.length - 1] = scores.join(':')
  let setEnded = await isSetEnded(scores)
  return { resD, setEnded };
}

async function addPoints(resD, team_id, teama_id, teamb_id) {
  let lastScore = resD[resD.length - 1];
  let scores = lastScore.split(':').map(Number);
  let setEnded = await isSetEnded(scores)
  if (!setEnded) {
    scores = addPointToResD(scores, team_id, teama_id, teamb_id)
  }
  resD[resD.length - 1] = scores.join(':')
  setEnded = await isSetEnded(scores)
  return { resD, setEnded };
}

// function updateSets(res, resD, team_id, teama_id, teamb_id) {
//   let lastScore = resD[resD.length - 1];
//   let scores = lastScore.split(':').map(Number);
//   scores = addPointToResD(scores, team_id, teama_id, teamb_id)
//   resD[resD.length - 1] = scores.join(':')
//   if (isSetEnded(scores)) {
//     resD.push("0:0");
//     let res_nums = res.split(':').map(Number);
//     if (res_nums[0] === 3 || res_nums[1] === 3) {
//       //MATCH ENDED
//     }
//     if (team_id === teama_id) {
//       res_nums[0]++
//     } else if (team_id === teamb_id) {
//       res_nums[1]++;
//     }
//     res = res_nums.join(':')
//   }

//   return { res, resD };
// }

async function updateTimeline(match_id, actual) {
  const match_raw = await client.query(`SELECT * FROM matches WHERE id = $1`, [match_id])
  const match = match_raw.rows[0]
  let timeline_outer = match.timeline
  let timeline_inner = timeline_outer.timeline
  let arr = timeline_inner[timeline_inner.length-1]
  arr.push(actual)
  timeline_inner[timeline_inner.length-1] = arr
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

    let updated
    if (choice === 'add') {
      updated = await addPoints(actual_resD, team_id, match.teama_id, match.teamb_id);
      if (updated.resD[0] === "1:0" || updated.resD[0] === "0:1") {
        await client.query(
          `UPDATE matches SET status='IN_PROGRESS' WHERE id = $1`,
          [match_id]
        );
      }
      await updateTimeline(match_id, updated.resD[updated.resD.length - 1])
    } else if (choice === 'subtract') {
      updated = await subtractPoints(actual_resD, team_id, match.teama_id, match.teamb_id);
      await updateTimeline(match_id, updated.resD[updated.resD.length - 1])
    }

    match.result_detailed.resD = updated.resD
    const res = await client.query(`
    UPDATE matches 
    SET result_detailed = $1 
    WHERE id = $2`,
      [match.result_detailed, match_id]);

    const final = await fetchMatchDetailsById(match_id)
    return { ...final, setEnded: updated.setEnded }
  } catch (error) {
    console.error('Error fetching matches:', error);
    return null;
  }
};

// const finishSet = async (match_id, team_id) => {
//   try {
//     const match_raw = await client.query(`SELECT * FROM matches WHERE id = $1`, [match_id])
//     const match = match_raw.rows[0]
//     let actual_res = match.result
//     let actual_resD = match.result_detailed.resD
//     let actual_timeout = match.result_detailed.timeout

//     const updated = updateSets(actual_res, actual_resD, team_id, match.teama_id, match.teamb_id);
//     match.result_detailed.resD = updated.resD
//     console.log(updated.res)
//     console.log(match.result_detailed)
//     const res = await client.query(`
//     UPDATE matches 
//     SET result = $1,
//     result_detailed = $2 
//     WHERE id = $3 
//     RETURNING *`,
//       [updated.res, match.result_detailed, match_id]);
//     return res.rows[0];
//   } catch (error) {
//     console.error('Error fetching matches:', error);
//     return null;
//   }
// };

module.exports = {
  addOrSubtractPoint,
  isSetEnded
}

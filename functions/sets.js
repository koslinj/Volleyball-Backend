const moment = require('moment-timezone');
const { client } = require('../db');
const { fetchMatchDetailsById } = require('./matches')
const { isSetEnded, isMatchEnded } = require('./points')
const { fetchTimeRecords, createTimeRecord, updateTimeRecord, countSetIndexFromRes } = require('./times')
const { getConfiguration } = require('./configuration')

function changeGeneralResult(scores, res) {
  let x = res.split(':').map(Number);
  if (scores[0] > scores[1]) {
    x[0]++
  } else {
    x[1]++
  }
  return x.join(':')
}

async function updateSets(res, detailed, timeline_outer) {
  let lastScore = detailed.resD[detailed.resD.length - 1];
  let scores = lastScore.split(':').map(Number);
  if (await isSetEnded(res, scores) && !await isMatchEnded(res, scores)) {
    res = changeGeneralResult(scores, res)
    detailed.resD.push("0:0")
    detailed.timeout.push("0:0")
    timeline_outer.timeline.push([])
  }

  return { res, detailed, timeline_outer };
}

const finishSet = async (match_id) => {
  try {
    const timeZone = 'Europe/Warsaw';
    const formattedDate = moment().tz(timeZone).format('YYYY-MM-DD HH:mm:ss z');
    const match_raw = await client.query(`SELECT * FROM matches WHERE id = $1`, [match_id])
    const match = match_raw.rows[0]
    let actual_res = match.result
    let actual_detailed = match.result_detailed
    let timeline_outer = match.timeline
    let lastScore = actual_detailed.resD[actual_detailed.resD.length - 1];
    let scores = lastScore.split(':').map(Number);

    const updated = await updateSets(actual_res, actual_detailed, timeline_outer);
    if (await isSetEnded(actual_res, scores) && !await isMatchEnded(actual_res, scores)) {
      await updateTimeRecord(formattedDate, countSetIndexFromRes(actual_res), match_id)
      await createTimeRecord(formattedDate, countSetIndexFromRes(updated.res), match_id)
    }

    const res = await client.query(`
    UPDATE matches 
    SET result = $1,
    result_detailed = $2,
    timeline = $3
    WHERE id = $4`,
      [updated.res, updated.detailed, updated.timeline_outer, match_id]);
    const final = await fetchMatchDetailsById(match_id)
    const times = await fetchTimeRecords(match_id)
    return { ...final, setEnded: false, matchEnded: false, times }
  } catch (error) {
    console.error('Error fetching matches:', error);
    return null;
  }
};

const finishMatch = async (match_id) => {
  try {
    const timeZone = 'Europe/Warsaw';
    const formattedDate = moment().tz(timeZone).format('YYYY-MM-DD HH:mm:ss z');
    const match_raw = await client.query(`SELECT * FROM matches WHERE id = $1`, [match_id])
    const match = match_raw.rows[0]
    let actual_res = match.result
    let actual_detailed = match.result_detailed
    let resD = actual_detailed.resD

    let lastScore = resD[resD.length - 1];
    let scores = lastScore.split(':').map(Number);
    let matchEnded = await isMatchEnded(actual_res, scores)

    if (matchEnded) {
      await updateTimeRecord(formattedDate, countSetIndexFromRes(actual_res), match_id)
      actual_res = changeGeneralResult(scores, actual_res)
      await client.query(`
      UPDATE matches 
      SET status = $1,
      result = $2
      WHERE id = $3 `,
        ['FINISHED', actual_res, match_id]);
    }
    const final = await fetchMatchDetailsById(match_id)
    const times = await fetchTimeRecords(match_id)
    return { ...final, setEnded: false, matchEnded: false, times }
  } catch (error) {
    console.error('Error fetching matches:', error);
    return null;
  }
};

module.exports = {
  finishSet,
  finishMatch
}

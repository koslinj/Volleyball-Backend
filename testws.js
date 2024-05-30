const WebSocket = require('ws');

const t = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTcxNzA2MTYwNSwiZXhwIjoxNzE3MDY1MjA1fQ.NT3J7vR0sel9g5p5BZuj_q60O3S9mgmPhRcjxNB2xJI'
const ws = new WebSocket(`ws://localhost:3000/live?token=${t}`);

ws.on('error', console.error);

ws.on('open', function open() {
  //setTimeout(() => {
  ws.send(JSON.stringify({ match_id: 1 }))
  //}, [2000])
});

ws.on('message', function message(message) {
  const data = JSON.parse(message);
  console.log(data.result_detailed)
  console.log(data.timeline.timeline)
});

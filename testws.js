const WebSocket = require('ws');

const t = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTcxNzA2NzUzMSwiZXhwIjoxNzE3MDcxMTMxfQ.pWsV73_1q8Z-7s4O8zjnw4h7R7mLd0vv5-4nS45f3iU'
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

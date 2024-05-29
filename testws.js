const WebSocket = require('ws');

const t = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTcxNzAwODA4OCwiZXhwIjoxNzE3MDExNjg4fQ.yTHYQAAirceTKfrB1AgDEe25cTXc1wwio86XixylgAk'
const ws = new WebSocket(`ws://localhost:3000/live?token=${t}`);

ws.on('error', console.error);

ws.on('open', function open() {
  //setTimeout(() => {
  ws.send(JSON.stringify({ match_id: 1 }))
  //}, [2000])
});

ws.on('message', function message(message) {
  const data = JSON.parse(message);
  console.log(data)
});

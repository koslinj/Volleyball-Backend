const WebSocket = require('ws');

const t = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTcxNzE3MzQ1NywiZXhwIjoxNzE3MTc3MDU3fQ.3EHHfUTIDz9y1kiU_vGGGus9XtOuvuPF3dEFb3HVwlA'
const ws = new WebSocket(`ws://localhost:3000/live?token=${t}`);

ws.on('error', console.error);

ws.on('open', function open() {
  //setTimeout(() => {
  ws.send(JSON.stringify({ match_id: 105 }))
  //}, [2000])
});

ws.on('message', function message(message) {
  const data = JSON.parse(message);
  console.log(data.result_detailed)
  //console.log(data.timeline.timeline)
  console.log(data)
});

const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3000/live?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTcxNjkyMzMyMCwiZXhwIjoxNzE2OTI2OTIwfQ.wfeEZxCzpViX9L2kBjwpORiPI8EZCgKUAHQCrfJGpLE');

ws.on('error', console.error);

ws.on('open', function open() {
  // setTimeout(() => {
  //   ws.send(JSON.stringify({ type: 'test', data: "OD KLIENTA" }))
  // },[2000])
});

ws.on('message', function message(message) {
  const data = JSON.parse(message);
  console.log(data)
});

const WebSocket = require('ws');

const t = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTcxNjk5MDAyMSwiZXhwIjoxNzE2OTkzNjIxfQ.1NNuZmpIDOTInMZSUNGsmZ8FPJyPYo7zPrhiIy2BdEc'
const ws = new WebSocket(`ws://localhost:3000/live?token=${t}`);

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

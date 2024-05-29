const WebSocket = require('ws');

const ws = new WebSocket('wss://volleyball-backend.onrender.com/live?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTcxNjk3NzQyNCwiZXhwIjoxNzE2OTgxMDI0fQ.SFb5ybyFi4ffNvtQZHGfyvVtQgEjxVuDzzf_dJ5Trzg');

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

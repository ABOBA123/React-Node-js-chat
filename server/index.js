const express = require("express");
const app = express();
const ws = require("express-ws")(app);
const aws = ws.getWss();

app.use(express.json());

app.ws("/", function (ws, req) {
  ws.on("message", function (msg) {
    aws.clients.forEach((client) => {
      client.send(msg);
    });
  });
});

app.listen(3001, () => {
  console.log("server started on http://localhost:3001");
});

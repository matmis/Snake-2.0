const express = require("express");
const app = express();
const server = require('http').createServer(app);
const io = require("socket.io")(server);
const config = require("./config");
const port = config.PORT;
const ws = require("./models/ws");

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/dist/index.html");
});

app.use(express.static(process.cwd() + "/dist"));

server.listen(port, () => {
  ws(io);
});

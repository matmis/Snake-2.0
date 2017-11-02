const config = require("./config"),
      staticServer = require("./server/staticServer"),
      chatServer = require("./server/chat"),
      Player = require("./models/Player.class");

const hostname = config.HOSTNAME,
      port = config.PORT;

staticServer.init(hostname, port);

chatServer();

// let p = new Player("Yann", "#FF0000");
// console.log(JSON.stringify(p));

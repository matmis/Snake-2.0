const config = require("./config"),
      staticServer = require("./server/staticServer"),
      chatServer = require("./server/chat");

const hostname = config.HOSTNAME,
      port = config.PORT;

staticServer.init(hostname, port);

chatServer();

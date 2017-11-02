const config = require("./config"),
      staticServer = require("./server/staticServer"),
      chatServer = require("./server/chat"),
      Transport = require("./models/Transport.class"),
      UserName = require("./models/UserName.class");

const hostname = config.HOSTNAME,
      port = config.PORT;

staticServer.init(hostname, port);

chatServer();

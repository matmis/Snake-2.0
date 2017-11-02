const config = require("./config"),
      staticServer = require("./server/staticServer");

const hostname = config.HOSTNAME,
      port = config.PORT;

staticServer.init(hostname, port);

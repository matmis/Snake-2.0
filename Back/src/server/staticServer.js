const router = require("./router"),
      path = require("path");

let staticServer = ((hostname, port) => {
  const http = require('http');

  const server = http.createServer((req, res) => {
    res.statusCode = 200;

    router.setStaticFolder(path.normalize(process.cwd() + "/dist"));

    router.init(req, res, (error, rs, mimeType) => {
      if(error){
        res.writeHead(500);
        res.end("500: Server Error : \n " + error.message);
      }else{
        res.setHeader("Content-Type", mimeType);
        rs.pipe(res);
      }
    });
  });

  const init = (hostname, port) => {
    server.listen(port, hostname, () => {
      console.log(`server running at http://${hostname}:${port}`);
    });
  };

  return {init};

})();

module.exports = staticServer;

const path = require("path"),
      RequestHandlers = require("./RequestHandlers.class"),
      url = require("url");

let router = (() => {

  let _staticFolder;
  let setStaticFolder = (value) => {_staticFolder = value;};
  let getStaticFolder = () => { return _staticFolder;};

  let extensions = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".png": "image/png",
    ".gif": "image/gif",
    ".jpg": "image/jpeg",
    ".ico": "image/x-icon",
    ".txt": "plain/text"
  };

  const init = (req, res, cb) => {
    if(req.url === "/"){
      req.url = "index.html";
    }
    let extension = path.extname(path.basename(req.url));

    if(req.method == "GET"){
      req.url = _staticFolder + "/" + req.url;
      console.log(req.url);
        RequestHandlers.getFile(req.url, (error, rs) => {
        cb(null, rs, extensions[extension]);
      });
    }else{
      console.log("no handler available yet");
    }
  };

  return {init, setStaticFolder};

})();

module.exports = router;

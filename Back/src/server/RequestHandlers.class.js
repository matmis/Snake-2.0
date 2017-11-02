const fs = require("fs"),
      path = require("path"),
      config = require("../config");

class RequestHandlers{

  constructor(){

  }

  static getFile(fileName, cb){
    fs.stat(fileName, (error, stats) => {
      if(stats && stats.isFile()){
        cb(null, fs.createReadStream(fileName));
      }else{
        cb(new Error("file not found"), null);
      }
    });
  }
}

module.exports = RequestHandlers;

const fs = require("fs"),
      path = require("path"),
      config = require("../config");

export default class RequestHandlers{

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

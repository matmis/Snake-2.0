const Pos = require("./Pos.class"),
      c = require("./Colors.class");

class Treat{
  constructor(){
    this.color = "#00FF00";

    let x = Math.floor(Math.random() * 99);
    let y = Math.floor(Math.random() * 99);

    this.pos = new Pos(x,y);
  }
}

module.exports = Treat;

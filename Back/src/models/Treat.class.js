const Pos = require("./Pos.class"),
      c = require("./Colors.class");

class Treat{
  constructor(){
    this.color = "#00FF00";

    this.treats = [];
    for (var i = 0; i < 20; i++) {
      let x = Math.floor(Math.random() * 99);
      let y = Math.floor(Math.random() * 99);
      this.treats.push(new Pos(x,y));
    }

    //this.pos = new Pos(x,y);
  }

  CreateNewTreat(index){
    let x = Math.floor(Math.random() * 99);
    let y = Math.floor(Math.random() * 99);
    this.treats[index] = new Pos(x,y);
  }
}

module.exports = Treat;

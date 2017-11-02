const Player = require("./Player.Class");

class Game{
  constructor(){
    this.players = [];
    this.play = false;
  }

  AddPlayer(player){
    this.players.push(player);
  }

  Start(){
    this.play = true;
  }

  Stop(){
    this.play = false;
  }
}

module.Exports = Game;

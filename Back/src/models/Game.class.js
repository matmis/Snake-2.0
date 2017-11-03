const Player = require("./Player.Class");

class Game{
  constructor(){
    this.players = [];
    this.play = false;
  }

  AddPlayer(player){
    this.players.push(player);
    this.Start();
  }

  Start(){
    if(!this.play && this.players.length >= 2){
      this.play = true;
      console.log("Start Game");
    }
  }

  Stop(){
    this.play = false;
  }

  Tick(){
    
  }
}

module.exports = Game;

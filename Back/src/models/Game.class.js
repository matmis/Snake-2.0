const Player = require("./Player.Class");

class Game{
  constructor(){
    this.players = [];
    this.play = false;
    this.tickTime = 2000;
    this.clients = [];
  }

  AddPlayer(player){
    this.players.push(player);
    this.Start();
  }

  removePlayer(name){
    let p = this.players.find(obj => obj.name == name);
    let i = this.players.indexOf(p);
    this.players.splice(i,1);
    console.log(this.players);
  }

  Start(){
    if(!this.play && this.players.length >= 2){
      this.play = true;
      console.log("Start Game");
      this.Main();
    }
  }

  Stop(){
    if(this.players.length < 2 && this.play){
      this.play = false;
    }
  }

  Main(){
    let tick = setInterval(() => {
      if(this.play){
        console.log("update");
        this.BroadCastUpdate();
      }else{
        console.log("end");
        clearInterval(tick);
      }
    }, this.tickTime);
  }

  BroadCastUpdate(){
    for (var i = 0; i < this.clients.length; i++) {
      this.SendData(this.clients[i]);
    }
  }

  SendData(client){
    return new Promise((ok, nok) => {
      client.sendUTF(JSON.stringify({type: "update", data: this.players}));
    });
  }
}

module.exports = Game;

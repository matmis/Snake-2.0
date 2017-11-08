const Player = require("./Player.Class");

class Game{
  constructor(){
    this.players = [];
    this.play = false;
    this.tickTime = 1000;
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
        this.UpdateSnakes().then((ok) => {
          this.BroadCastUpdate();
        });
      }else{
        console.log("end");
        clearInterval(tick);
      }
    }, this.tickTime);
  }

  UpdateSnakes(){
    return new Promise((ok, nok) => {
      let c = 0;
      for (var i = 0; i < this.players.length; i++) {
        this.UpdateSnake(i).then(
          (result) => {
            c++;
            if(c == this.players.length){
              ok();
            }
          }
        );
      }
    });
  }

  UpdateSnake(i){
    return new Promise((ok, nok) => {
      this.players[i].snake.GameTick();
      ok();
    });
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

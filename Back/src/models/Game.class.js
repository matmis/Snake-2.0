const Player = require("./Player.Class");

class Game{
  constructor(){
    this.players = [];
    this.play = false;
    this.tickTime = 750;
    this.clients = [];
    this.max = 100;
  }

  AddPlayer(player){
    this.players.push(player);
    this.Start();
  }

  removePlayer(name){
    let p = this.players.find(obj => obj.name == name);
    if(p != null){
      let i = this.players.indexOf(p);
      this.players.splice(i,1);
      console.log(this.players);
    }
  }

  updatePlayerDirection(name, direction){
    let p = this.players.find(obj => obj.name == name);
    if(p != null){
      let i = this.players.indexOf(p);
      this.players[i].snake.direction = direction;  
    }
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
        this.UpdateSnakes().then(
          (ok) => {
            console.log("snakes updated");
            this.CheckSnakes().then((ok) => {
              console.log("snakes checked");
              this.BroadCastUpdate();
              this.checkAmountOfPlayers();
            });
          });
      }else{
        console.log("end");
        clearInterval(tick);
      }
    }, this.tickTime);
  }

  checkAmountOfPlayers(){
    if(this.players.length < 2){
      this.play = false;
    }
  }

  CheckSnakes(){
    return new Promise((ok, nok) => {
      let c = 0;
      let removeIndexes = [];
      for (var i = 0; i < this.players.length; i++) {
        let player = this.players[i];
        console.log("checking: " + player.name);
        for (var j = 0; j < player.snake.location.length; j++) {
          let loc = player.snake.location[j];
          console.log(player.snake);
          if(loc.x >= 0 && loc.x <= 100 && loc.y >= 0 && loc.y <= 100){

          }else{
            removeIndexes.push(i);
            // this.players[i].isAlive = false;
            // this.BroadCastDeath(this.players[i]);
            // this.players.splice(i,1);
          }
        }
      }
      let removed = 0;
      for (var k = 0; k < removeIndexes.length; k++) {
        this.players[removeIndexes[k] - removed].isAlive = false;
        this.BroadCastDeath(this.players[removeIndexes[k] - removed]);
        this.players.splice(removeIndexes[k] - removed,1);
        removed++;
      }
      ok();
    });
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

  BroadCastDeath(player){
    for (var i = 0; i < this.clients.length; i++) {
      this.clients[i].sendUTF(JSON.stringify({type: "death", data: player}));
      let msg = this.CreateChatMsg("Server", "#FF0000", player.name + " has died in action");
      this.clients[i].sendUTF(JSON.stringify({type: "message", data: msg}));
    }
  }

  CreateChatMsg(userName, userColor, data){
    let msg = {
      time: (new Date()).getTime(),
      text: data,
      author: userName,
      color: userColor
    };
    return msg;
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

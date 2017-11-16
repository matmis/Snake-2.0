const Player = require("./Player.Class"),
      treat = require("./treat.class");

//main game
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
      this.treat = new treat();
      this.broadCastTreat();
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
        this.BroadCastEnd();
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
        let playerHead = this.players[i].snake.location[0];

        //controleer of de speler in het speelveld zit
        if(playerHead.x >= 0 && playerHead.y <= 100 && playerHead.y >= 0 && playerHead.y <= 100){
          //playerhead zit in het speelveld
          console.log("in speelveld");
          //controleer of de speler een botsing heeft met een andere players
          for (var j = 0; j < this.players.length; j++) {
            if(i != j){
              for (var l = 0; l < this.players[j].snake.location.length; l++) {
                let targetloc = this.players[j].snake.location[l];
                if(playerHead.x == targetloc.x && playerHead.y == targetloc.y){
                  //speler zit op een enemy
                  removeIndexes.push(i);
                }
              }
            }
          }

          //kijken of de speler op de treat staat
          if(!removeIndexes.includes(i)){
            if(playerHead.x == this.treat.x && playerHead.y == this.treat.y){
              this.treat = new treat();
              this.broadCastTreat();
            }
          }
        }
        else{
          removeIndexes.push(i);
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

  BroadCastEnd(){
    for (var i = 0; i < this.clients.length; i++) {
      this.clients[i].sendUTF(JSON.stringify({type: "end", data: "true"}));
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

  broadCastTreat(){
    for (var i = 0; i < this.clients.length; i++) {
      this.clients[i].sendUTF(JSON.stringify({type: "treat", data: this.treat}));
    }
  }
}

module.exports = Game;

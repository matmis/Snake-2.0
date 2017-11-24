const Player = require("./Player.class"),
      treat = require("./Treat.class");

//main game
class Game{
  constructor(eventEmitter){
    this.players = [];
    this.play = false;
    this.tickTime = 350;
    this.clients = [];
    this.max = 100;
    this.eventEmitter = eventEmitter;
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
      switch (direction) {
        case 0:
          if(p.snake.direction != 1){
            this.players[i].snake.direction = direction;
          }
          break;
        case 1:
          if(p.snake.direction != 0){
            this.players[i].snake.direction = direction;
          }
          break;
        case 2:
          if(p.snake.direction != 3){
            this.players[i].snake.direction = direction;
          }
          break;
        case 3:
          if(p.snake.direction != 2){
            this.players[i].snake.direction = direction;
          }
          break;
        default:

      }
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
        this.players = [];
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
        if(playerHead.x >= 0 && playerHead.x <= 100 && playerHead.y >= 0 && playerHead.y <= 100){
          //playerhead zit in het speelveld

          //controleer of de speler een botsing heeft met zichzelf
          let snakelength = this.players[i].snake.location.length;
          for (var m = 1; m < snakelength; m++) {
            let targetloc = this.players[i].snake.location[m];
            console.log("debug targetloc: ", targetloc);
            if(playerHead.x == targetloc.x && playerHead.y == targetloc.y){
              if(!removeIndexes.includes(i)){
                removeIndexes.push(i);
              }
            }
          }

          //controleer of de speler een botsing heeft met een andere players
          let AmountOfPllayers = this.players.length;
          for (var j = 0; j < AmountOfPllayers; j++) {
            if(i != j){
              for (var l = 0; l < this.players[j].snake.location.length; l++) {
                let targetloc = this.players[j].snake.location[l];
                if(playerHead.x == targetloc.x && playerHead.y == targetloc.y){
                  //speler zit op een enemy
                  if(!removeIndexes.includes(i)){
                      removeIndexes.push(i);
                  }
                }
              }
            }
          }

          //kijken of de speler op de treat staat
          if(!removeIndexes.includes(i)){
            console.log("check treat");
            if(playerHead.x == this.treat.pos.x && playerHead.y == this.treat.pos.y){
              console.log("op treat");
              this.treat = new treat();
              this.broadCastTreat();
              this.players[i].snake.Grow();
              this.players[i].score++;
            }
          }
        }
        else{
          if(!removeIndexes.includes(i)){
              removeIndexes.push(i);
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
      let msg = this.CreateChatMsg("Server", "#FF0000", player.name + " has died in action");
      this.clients[i].sendUTF(JSON.stringify({type: "message", data: msg}));
    }
    this.eventEmitter.emit("Death", player);
  }

  BroadCastEnd(){
    for (var i = 0; i < this.clients.length; i++) {
      this.clients[i].sendUTF(JSON.stringify({type: "end", data: "true"}));
    }
  }

  BroadCastUpdate(){
    this.eventEmitter.emit("update", this.players);
  }

  broadCastTreat(){
    this.eventEmitter.emit("treat", this.treat);
  }
}

module.exports = Game;

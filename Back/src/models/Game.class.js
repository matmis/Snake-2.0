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
        // console.log("update");
        // this.UpdateSnakes()
        // .then(
        //   (ok) => {
        //     console.log("snakes updated")
        //     this.CheckSnakes().then((ok) => {
        //       this.BroadCastUpdate();
        //       this.checkAmountOfPlayers();
        //     });
        //   });
        console.log("update");
        this.UpdateSnakes(() => {
          for (var i = 0; i < this.players.length; i++) {
            console.log(this.players[i].snake.location);
          }
          console.log("snakes updated");
          this.checkSnakes(() => {

            console.log("snakes checked");
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

  checkSnakes(cb){
    this.checkPlayers((removeIndexes) => {
      if(removeIndexes.length > 0){
        console.log("binnengekomen removeindex: " + removeIndexes);
        let removed = 0;
        for (var i = 0; i < removeIndexes.length; i++) {
          this.players[removeIndexes[i] - removed].isAlive = false;
          this.BroadCastDeath(this.players[removeIndexes[i] - removed]);
          this.players.splice(removeIndexes[i] - removed,1);
          removed++;
        }
      }
      //TODO remove de mensen in removeIndexes en Check of de speler op de treat staat;
      cb();
    });
  }

  checkPlayers(cb){
    let counter = 0;
    let removeIndexes = [];
    let c = this.players.length;
    for (var i = 0; i < c; i++) {
      this.checkPlayer(i, (index, remove) => {
        counter++;
        //console.log(`player checked. counter = ${counter}. c = ${c}`);
        if(remove){
          if(!removeIndexes.includes(index)){
              removeIndexes.push(index);
          }
        }
        if(counter == c){
          console.log("about to cb: " + removeIndexes);
          cb(removeIndexes);
        }
      });
    }
  }

  checkPlayer(i, cb){
    let playerHead = this.players[i].snake.location[0];
    this.checkIfPlayerIsInsideTheField(playerHead, (remove) => {
      if(remove){
        console.log("outside field: " + remove);
        cb(i, true);
      }else{
        console.log("outside field: " + remove);
        this.checkIfPlayerHasCollisionWithHimself(playerHead, i, (remove) => {
          if(remove){
            cb(i, true);
          }else{
            this.checkIfPlayerHasCollisionWithOtherPlayer(playerHead, i, (remove) => {
              if(remove){
                cb(i, true);
              }else{
                cb(i, false);
              }
            });
          }
        });
      }
    });
  }

  checkIfPlayerHasCollisionWithOtherPlayer(playerhead, i, cb){
    let p = this.players.length;
    for(let t = 0; t < p; t++){
      if(t != i){
        let l = this.players[t].snake.location.length;
        for(let z = 0; z < l; z++){
          let targetloc = this.players[t].snake.location[z];
          if(playerhead.x == targetloc.x && playerhead.y == targetloc.y){
            cb(true);
          }else{
            cb(false);
          }
        }
      }
    }
  }

  checkIfPlayerHasCollisionWithHimself(playerhead, i, cb){
    let c = this.players[i].snake.location.length;
    for(let t = 1; t < c; t++){
      let targetloc = this.players[i].snake.location[t];
      if(playerhead.x == targetloc.x && playerhead.y == targetloc.y){
        cb(true);
      }else{
        cb(false);
      }
    }
  }

  checkIfPlayerIsInsideTheField(playerhead, cb){
    if(playerhead.x >= 0 && playerhead.x <= 100 && playerhead.y >= 0 && playerhead.y <= 100){
      cb(false);
    }else{
      cb(true);
    }
  }

  // CheckSnakes(){
  //   return new Promise((ok, nok) => {
  //     let c = 0;
  //     let removeIndexes = [];
  //     for (var i = 0; i < this.players.length; i++) {
  //       let playerHead = this.players[i].snake.location[0];
  //
  //       //controleer of de speler in het speelveld zit
  //       if(playerHead.x >= 0 && playerHead.x <= 100 && playerHead.y >= 0 && playerHead.y <= 100){
  //         //playerhead zit in het speelveld
  //
  //         //controleer of de speler een botsing heeft met zichzelf
  //         let snakelength = this.players[i].snake.location.length;
  //         for (var m = 1; m < snakelength; m++) {
  //           let targetloc = this.players[i].snake.location[m];
  //           console.log("debug targetloc: ", targetloc);
  //           if(playerHead.x == targetloc.x && playerHead.y == targetloc.y){
  //             console.log("player " + this.players[i].name + " has died because he had a collision with himself");
  //             if(!removeIndexes.includes(i)){
  //               removeIndexes.push(i);
  //             }
  //           }
  //         }
  //
  //         //controleer of de speler een botsing heeft met een andere players
  //         let AmountOfPllayers = this.players.length;
  //         for (var j = 0; j < AmountOfPllayers; j++) {
  //           if(i != j){
  //             for (var l = 0; l < this.players[j].snake.location.length; l++) {
  //               let targetloc = this.players[j].snake.location[l];
  //               if(playerHead.x == targetloc.x && playerHead.y == targetloc.y){
  //                 //speler zit op een enemy
  //                 console.log("player " + this.players[i].name + " has died because he had a collision with " + this.players[j].name);
  //                 if(!removeIndexes.includes(i)){
  //                     removeIndexes.push(i);
  //                 }
  //               }
  //             }
  //           }
  //         }
  //
  //         //kijken of de speler op de treat staat
  //         if(!removeIndexes.includes(i)){
  //           if(playerHead.x == this.treat.pos.x && playerHead.y == this.treat.pos.y){
  //             console.log("op treat");
  //             this.treat = new treat();
  //             this.broadCastTreat();
  //             this.players[i].snake.Grow();
  //             this.players[i].score++;
  //           }
  //         }
  //       }
  //       else{
  //         if(!removeIndexes.includes(i)){
  //           console.log("player " + this.players[i].name + " has died because he went outside of the playing field");
  //             removeIndexes.push(i);
  //         }
  //       }
  //     }
  //     let removed = 0;
  //     for (var k = 0; k < removeIndexes.length; k++) {
  //       this.players[removeIndexes[k] - removed].isAlive = false;
  //       this.BroadCastDeath(this.players[removeIndexes[k] - removed]);
  //       this.players.splice(removeIndexes[k] - removed,1);
  //       removed++;
  //     }
  //     ok();
  //   });
  // }

  UpdateSnakes(cb){
    let c = 0;
    for (var i = 0; i < this.players.length; i++) {
      this.UpdateSnake(i, () => {
        c++;
        if(c == this.players.length){
          cb();
        }
      });
    }
  }

  UpdateSnake(i, cb){
    this.players[i].snake.GameTick();
    cb();
  }

  BroadCastDeath(player){
    this.eventEmitter.emit("death", player);
  }

  BroadCastEnd(){
    this.eventEmitter.emit("end", true);
  }

  BroadCastUpdate(){
    this.eventEmitter.emit("update", this.players);
  }

  broadCastTreat(){
    this.eventEmitter.emit("treat", this.treat);
  }
}

module.exports = Game;

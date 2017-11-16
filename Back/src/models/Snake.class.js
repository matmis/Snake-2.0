const Pos = require("./Pos.class");

class Snake{
  constructor(){
    this.directions = {
      UP: 0,
      DOWN: 1,
      LEFT: 2,
      RIGHT: 3
    };

    this.location = [];

    this.direction = this.directions.RIGHT;
    let randomX = (Math.random()*97)+3;
    let randomY = Math.random()*100;
    this.location.push(new Pos(randomX,randomY));
    this.location.push(new Pos(randomX-1,randomY));
    this.location.push(new Pos(randomX-2,randomY));
    this.location.push(new Pos(randomX-3,randomY));
  }

  GameTick(){
    let head;
    switch (this.direction) {
      case this.directions.UP:
        head = new Pos(this.location[0].x, this.location[0].y - 1);
        break;
      case this.directions.DOWN:
        head = new Pos(this.location[0].x, this.location[0].y + 1);
        break;
      case this.directions.LEFT:
        head = new Pos(this.location[0].x - 1, this.location[0].y);
        break;
      case this.directions.RIGHT:
        head = new Pos(this.location[0].x + 1, this.location[0].y);
        break;
      default:
    }
    this.location.splice(0,0,head);
    this.location.splice(this.location.length-1,1);
  }

}

module.exports = Snake;

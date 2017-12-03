const Pos = require("./pos.class");

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
    let randomX = Math.floor((Math.random()*17)+3);
    let randomY = Math.floor(Math.random()*20);
    this.location.push(new Pos(randomX,randomY));
    this.location.push(new Pos(randomX-1,randomY));
    this.location.push(new Pos(randomX-2,randomY));
    this.location.push(new Pos(randomX-3,randomY));
  }

  move(cb){
    let head;
    this.end = this.location[this.location.length - 1];
    switch (this.direction) {
      case 0:
        head = new Pos(this.location[0].x, this.location[0].y - 1);
        break;
      case 1:
        head = new Pos(this.location[0].x, this.location[0].y + 1);
        break;
      case 2:
        head = new Pos(this.location[0].x - 1, this.location[0].y);
        break;
      case 3:
        head = new Pos(this.location[0].x + 1, this.location[0].y);
        break;
      default:
    }
    this.location.splice(0,0,head);
    this.location.splice(this.location.length-1,1);
    cb();
  }

  changeDirection(dir, cb){
    switch (dir){
      case 0:
        if(this.direction != 1){
          this.direction = dir;
        }
        break;
      case 1:
        if(this.direction != 0){
          this.direction = dir;
        }
        break;
      case 2:
        if(this.direction != 3){
          this.direction = dir;
        }
        break;
      case 3:
        if(this.direction != 2){
          this.direction = dir;
        }
        break;
      default:
    }
    cb();
  }

  Grow(){
    this.location.push(this.end);
  }

  checkSides(cb){
    let head = this.location[0];
    let left = new Pos(head.x-1, head.y);
    let right = new Pos(head.x+1, head.y);
    let above = new Pos(head.x, head.y-1);
    let below = new Pos(head.x, head.y+1);
    let bl = false, br = false, ba = false, bb = false;
    for (var i = 1; i < this.location.length; i++) {
      let target = this.location[i];
      if(target.x == left.x && target.y == left.y){
        bl = true;
      }
      if(target.x == right.x && target.y == right.y){
        br = true;
      }
      if(target.x == above.x && target.y == above.y){
        ba = true;
      }
      if(target.x == below.x && target.y == below.y){
        bb = true;
      }
    }
    cb(bl,br,ba,bb);
  }

  checkCollisionWithSelf(cb){
    let head = this.location[0];
    let body = this.location.slice(1);
    for (var i = 0; i < body.length; i++) {
      let bpart = body[i];
      if(bpart.x == head.x && bpart.y == head.y){
        return cb(true);
      }
    }
    return cb(false);
  }
}

module.exports = Snake;

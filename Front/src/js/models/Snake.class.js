import Pos from "./Pos.class";

export default class Snake{
    constructor(){
      this.directions = {
        UP: 0,
        DOWN: 1,
        LEFT: 2,
        RIGHT: 3
      };
  
      this.location = [];
  
      this.direction = this.directions.RIGHT;
  
      this.location.push(new Pos(0,0));
      this.location.push(new Pos(-1,0));
      this.location.push(new Pos(-2,0));
      this.location.push(new Pos(-3,0));
    }
  
    GameTick(){
      let head;
      switch (this.direction) {
        case this.directions.UP:
          head = new Pos(this.location[0].x, this.location[0].y + 1);
          break;
        case this.directions.DOWN:
          head = new Pos(this.location[0].x, this.location[0].y - 1);
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
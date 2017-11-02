export default class Pos{
    constructor(x,y){
      this.x = x;
      this.y = y;
    }
  
    toJSON(){
      let {x, y} = this;
      return {x, y};
    }
  }
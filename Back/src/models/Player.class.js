const Snake = require("./Snake.class");

class Player{
  constructor(name, color){
    this.name = name;
    this.snake = new Snake();
    this.color = color;
  }


}

module.exports = Player;

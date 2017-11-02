import Snake from "./Snake.class";

export default class Player{
  constructor(name, color){
    this.name = name;
    this.snake = new Snake();
    this.color = color;
  }


}
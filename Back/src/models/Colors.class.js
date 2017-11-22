class Colors{
  constructor(){
    this.red = "#FF0000";
    this.green = "#00FF00";
    this.blue = "#0000FF";
    this.magenta = "#FF00FF";
    this.purple = "#A020F0";
    this.plum = "#8E4585";
    this.orange = "#FFA500";
  }

  GetRandomColor(cb){
    //let letters = '0123456789ABCDEF';
    let letters = '456789ABCDEF';
    let c = "#";
    for (var i = 0; i < 6; i++) {
      c += letters[Math.floor(Math.random()*letters.length)];
    }
    cb(c);
  }
}

module.exports = Colors;

class Transport{
  constructor(){

  }

  static SendString(model, data){
    //model = waarop we gaan fileteren
    //data = inhoud van het model
    let m = model, d = data;
    let ts = {
      model: m,
      data: d
    };
    return JSON.stringify(ts);
  }
}

module.exports = Transport;

export default class Transport{
    constructor(model, data){
      this.model = model;
      this.data = data;
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
      //console.log(ts);
    }
}

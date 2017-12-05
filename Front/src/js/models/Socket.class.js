import * as chat from '../services/chat.service';
import * as score from '../services/score.service';
import * as canvas from '../services/canvas.service';
import * as game from '../services/game.service';

export default class Socket {

    constructor(treat) {
        this.socket = io.connect(location.protocol + "//" + location.host);
        this.socketListener();
        this.treat = 0;
        this.userName = "";
        this.update = true;
    }

    setUserName(str){
        this.userName = str;
    }

    setUpdate(bool){
        this.update = bool;
    }

    socketListener(){

        this.socket.on("player", (data) => {
            console.log("player: ", data);
            score.show(data, false);
        });

        this.socket.on("message", (data) => {
            console.log("Message: ", data);
            let dt = new Date(data.time)
            chat.addMessage(data.author, data.text, data.color, dt);
        });

        this.socket.on("update", (data) => {
            console.log("update: ", data);
            let players = data;
            console.log(players);
            if(this.update)
            {
            canvas.drawSnakes(players, this.treat);
            score.show(players, true);
            }
        });

        this.socket.on("end", (data) => {
            console.log("end:" + data);
            canvas.drawText("Game Over...");
        });

        this.socket.on("treat", (data) => {
            console.log("treat: ", data);
            this.treat = data;
        });
        this.socket.on("death", (data)=>{
            console.log("death: ", data);
            if(data.name == this.userName)
            {
                this.update = false;
                game.restart(this, this.userName);
            }
        });
    }

    send(header, message){
        this.socket.emit(header, message);
    }
}
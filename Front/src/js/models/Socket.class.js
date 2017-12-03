import * as chat from '../services/chat.service';
import * as score from '../services/score.service';
import * as canvas from '../services/canvas.service';

export default class Socket {

    constructor(treat) {
        this.socket = io.connect(location.protocol + "//" + location.host);
        this.socketListener();
        this.treat = 0;
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
            canvas.drawSnakes(players, this.treat);
            score.show(players, true);
        });

        this.socket.on("end", (data) => {
            console.log(data);
            canvas.drawText("Game Over...");
        });

        this.socket.on("treat", (data) => {
            console.log("treat: ", data);
            this.treat = data;
        });
    }

    send(header, message){
        this.socket.emit(header, message);
    }
}
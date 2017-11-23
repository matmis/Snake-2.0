const config = require("./../config");
const Colors = require("./../models/Colors.class");
const Player = require("./../models/Player.class");
const Game = require("./../models/Game.class");

let ws = (socketio) => {
  let io = socketio;
  let c = new Colors();
  let game = new Game();
  let chatHistory = [];

  chatHistory.push("dummydata");
  io.on("connection", (socket) => {
    console.log(socket + " has connected");

    SendChatHistory(socket).then(
      () => {
        socket.on("message", (message) => {
          console.log("received message: " + message);
          chatHistory.push(message);
          chatHistory.splice(-100);
          BroadCastChat(socket, message);
        });

        socket.on("username", (username) => {
          let userName = htmlEntities(username);
          c.GetRandomColor((userc) => {
            let userColor = userc;
            BroadCastChat(socket, userName + " is now connected");

            let p = new Player(userName, userColor);
            game.AddPlayer(p);
            //TODO game.clients probleem oplossen
          });
        });
      }
    );
  });

  const BroadCastChat = (socket, message) => {
    socket.broadcast.emit("message", message);
    socket.emit("message", message);
  };

  const SendChatHistory = (socket) => {
    return new Promise((resolve, reject) => {
      if(chatHistory.length > 0){
        for (let i = 0; i < chatHistory.length; i++) {
          socket.emit("history", chatHistory[i]);
          console.log("sending history");
        }
      }else{
        console.log('not sending history');
      }
      resolve();
    });
  };

  const htmlEntities = (str) => {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };

};

module.exports = ws;

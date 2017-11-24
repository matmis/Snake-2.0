const config = require("./../config");
const Colors = require("./../models/Colors.class");
const Player = require("./../models/Player.class");
const Game   = require("./../models/Game.class");
const events = require("events");

let ws = (socketio) => {
  let io = socketio;
  let eventEmitter = new events.EventEmitter();
  let c = new Colors();
  let game = new Game(eventEmitter);
  let chatHistory = [];

  io.on("connection", (socket) => {
    console.log(socket + " has connected");

    SendChatHistory(socket).then(
      () => {
        socket.on("username", (username) => {
          socket.userName = username;
          c.GetRandomColor((userc) => {
            socket.userColor = userc;
            CreateChatMsg(socket.userName, socket.userColor, socket.userName + " is now connected", (msg) => {
              console.log(msg);
              chatHistory.push(msg);
              chatHistory.splice(-100);
              BroadCastChat(socket, msg);
            });

            let p = new Player(socket.userName, socket.userColor);
            game.AddPlayer(p);
          });
        });

        socket.on("chat", (data) => {
          CreateChatMsg(socket.userName, socket.userColor, data, (msg) => {
            console.log(msg);
            chatHistory.push(msg);
            chatHistory.splice(-100);
            BroadCastChat(socket, msg);
          });
        });

        socket.on('direction', (data) => {
          game.updatePlayerDirection(socket.userName, data);
        });

        socket.on("close", (socket) => {
          CreateChatMsg(socket.username, socket.userColor, socket.username + " has left the room", (msg) => {
          });
        });

        socket.on("disconnect", (data) => {
          console.log(socket.username + " is now disconnected");
        });
      }
    );
  });

  eventEmitter.on("update", (players) => {
    io.local.emit("update", players);
  });

  eventEmitter.on("treat", (treat) => {
    io.local.emit("treat", treat);
  });

  eventEmitter.on("death", (player) => {
    CreateChatMsg(player.name, player.color, player.name + " has died in action", (msg) => {
      console.log(msg);
      io.local.emit("message", msg);

    });
  });

  const BroadCastChat = (socket, message) => {
    socket.broadcast.emit("message", message);
    socket.emit("message", message);
  };

  const CreateChatMsg = (userName, userColor, data, cb) => {
    let msg = {
      time: (new Date()).getTime(),
      text: data,
      author: userName,
      color: userColor
    };
    cb(msg);
  };

  const SendChatHistory = (socket) => {
    return new Promise((resolve, reject) => {
      if(chatHistory.length > 0){
        for (let i = 0; i < chatHistory.length; i++) {
          socket.emit("message", chatHistory[i]);
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

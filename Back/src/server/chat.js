"use strict";
const config = require("./../config"),
    http = require('http'),
    webSocketServer = require('websocket').server,
    Colors = require("./../models/Colors.class"),
    Player = require("./../models/Player.class"),
    Game = require("./../models/Game.class");

let chatServer = () => {
  let webSocketServerPort = config.CHAT_PORT,
      chatHistory = [],
      clients = [],
      server = http.createServer((request, response) => {}),
      c = new Colors(),
      game = new Game();

  server.listen(webSocketServerPort, () => {
    console.log((new Date()) + " websocket Server is listening on port " + webSocketServerPort);
  });

  let wsServer = new webSocketServer({
    httpServer: server
  });

  wsServer.on("request", (request) => {

    let connection = request.accept(null, request.origin),
        index = clients.push(connection) - 1,
        userName = false,
        userColor = false;

    if(chatHistory.length > 0){
      send(connection, "history", chatHistory);
    }

    connection.on("message", (message) => {
      let input = JSON.parse(message.utf8Data);
      if(input.model == "username"){
        userName = htmlEntities(input.data.username);
        userColor = c.red;
        NewUserName(userName, userColor, input.data);
        game.Start();
      }
      if(input.model == "chat"){
        BroadCastChat(userName, userColor, input.data);
      }
    });

    connection.on('close', (connection) => {
      BroadCastChat(userName, userColor, userName + " has left the room");
      clients.splice(index, 1);
      game.removePlayer(userName);
      game.Stop();
    });
  });

  const htmlEntities = (str) => {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };

  const send = (connection, t, d) => {
    connection.sendUTF(JSON.stringify({type : t, data : d}));
  };

  const NewUserName = (userName, userColor, data) => {
    let msg = CreateChatMsg(userName, userColor, userName + " is now connected");
    chatHistory.push(msg);
    chatHistory = chatHistory.splice(-100);
    for (var i = 0; i < clients.length; i++) {
      send(clients[i], "message", msg);
    }

    let p = new Player(userName, userColor);
    for (var j = 0; j < clients.length; j++) {
      send(clients[j], "Player", p);
    }
    game.clients = clients;
    game.AddPlayer(p);
  };

  const BroadCastChat = (userName, userColor, data) => {
    let msg = CreateChatMsg(userName, userColor, data);
    chatHistory.push(msg);
    chatHistory = chatHistory.splice(-100);
    for (var i = 0; i < clients.length; i++) {
      send(clients[i], "message", msg);
    }
  };

  const CreateChatMsg = (userName, userColor, data) => {
    let msg = {
      time: (new Date()).getTime(),
      text: data,
      author: userName,
      color: userColor
    };
    return msg;
  };
};

module.exports = chatServer;

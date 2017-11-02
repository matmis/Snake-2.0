"use strict";
const config = require("./../config"),
    http = require('http'),
    webSocketServer = require('websocket').server,
    c = require("./../models/Colors.class"),
    Player = require("./../models/Player.class"),
    Game = require("./../models/Game.class");

let chatServer = ()=>{
  let webSocketsServerPort = config.CHAT_PORT;

  let history = [ ];
  // list of currently connected clients (users)
  let clients = [ ];

  const htmlEntities = (str) => {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };

  let server = http.createServer(function(request, response) {});

  server.listen(webSocketsServerPort, function() {
    console.log((new Date()) + " websocket Server is listening on port " + webSocketsServerPort);
  });

  let wsServer = new webSocketServer({
    httpServer: server
  });

  wsServer.on('request', function(request) {
    console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

    // accept connection - you should check 'request.origin' to make sure that
    // client is connecting from your website
    // (http://en.wikipedia.org/wiki/Same_origin_policy)
    let connection = request.accept(null, request.origin);
    // we need to know client index to remove them on 'close' event
    let index = clients.push(connection) - 1;
    let userName = false;
    let userColor = false;

    console.log((new Date()) + ' Connection accepted.');

    // send back chat history
    if (history.length > 0) {
        connection.sendUTF(JSON.stringify( { type: 'history', data: history} ));
    }

    // user sent some message
    connection.on('message', function(message) {
      if (message.type === 'utf8') { // accept only text
            // if (userName === false) { // first message sent by user is their name
            //     // remember user name
            //     userName = htmlEntities(message.utf8Data);
            //     // get random color and send it back to the user
            //     userColor = colors.shift();
            //     connection.sendUTF(JSON.stringify({ type:'color', data: userColor }));
            //     console.log((new Date()) + ' User is known as: ' + userName
            //                 + ' with ' + userColor + ' color.');
            //
            // } else { // log and broadcast the message
            //     console.log((new Date()) + ' Received Message from '
            //                 + userName + ': ' + message.utf8Data);
            //
            //     // we want to keep history of all sent messages
            //     let obj = {
            //         time: (new Date()).getTime(),
            //         text: htmlEntities(message.utf8Data),
            //         author: userName,
            //         color: userColor
            //     };
            //     history.push(obj);
            //     history = history.slice(-100);
            //
            //     // broadcast message to all connected clients
            //     let json = JSON.stringify({ type:'message', data: obj });
            //     for (let i=0; i < clients.length; i++) {
            //         clients[i].sendUTF(json);
            //     }
            // }
          console.log(message.utf8Data);
          let input = JSON.parse(message.utf8Data);
          if(input.model == "username"){
            userName = htmlEntities(input.data.username);
            userColor = c.red;
            connection.sendUTF({type: 'color', data: userColor });
              let msg = {
              time: (new Date()).getTime(),
              text: htmlEntities(input.data.username + " is now Connected"),
              author: input.data.username,
              color: userColor
            };
            history.push(msg);
            history = history.splice(-100);
            let msgJson = JSON.stringify({ type: 'message', data: msg});
            console.log("#clients: " + clients.length);
            for (var i = 0; i < clients.length; i++) {
              console.log("send");
              clients[i].sendUTF(msgJson);
            }
          }
        }
    });

    // user disconnected
    connection.on('close', function(connection) {
      if (userName !== false && userColor !== false) {
          console.log((new Date()) + " Peer "
              + connection.remoteAddress + " disconnected.");
          // remove user from the list of connected clients
          clients.splice(index, 1);
          // push back user's color to be reused by another user
      }
  });
});

};


module.exports = chatServer;

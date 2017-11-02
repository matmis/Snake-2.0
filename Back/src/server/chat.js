"use strict";
const config = require("./../config"),
    http = require('http'),
    webSocketServer = require('websocket').server;

let chatServer = ()=>{
let webSocketsServerPort = config.CHAT_PORT;

/**
 * Global variables
 */
// latest 100 messages
let history = [ ];
// list of currently connected clients (users)
let clients = [ ];

const htmlEntities = (str) => {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};

let colors = [ 'red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange' ];
// ... in random order
colors.sort(function(a,b) { return Math.random() > 0.5; } );

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
            let input = JSON.parse(message);
            console.log(input);
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
            colors.push(userColor);
        }
    });

});

};


module.exports = chatServer;

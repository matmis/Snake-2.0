"use strict";

console.log("app loaded");


console.log("login loaded");

import Transport from "./models/transport.class"
import Username from "./models/username.class"

let btnSubmit, txtUser;
let userName;

let content, input, status, myColor, myName;


const init = ()=>{

    btnSubmit = document.querySelector("#btnSubmit");
    txtUser = document.querySelector("#txtUser");

    btnSubmit.addEventListener("click", ()=>{
        console.log("clicked");
        checkNickname();
    });

    content = document.querySelector("#content");
    input = document.querySelector("#input");
    status = document.querySelector("#status");


    //console.log(btnSubmit);
    //console.log(txtUser);


}

const checkNickname = ()=>{
    let regex = new RegExp("^[a-zA-Z ]+$");

    if(!regex.test(txtUser.value))
    {
        console.log("Niet goed");
    }
    else{
        console.log("wel goed");
        userName = txtUser.value;
        
        startSpelletje()
    }
}


const startSpelletje = ()=>{
    console.log("start");
    document.querySelector(".login-screen").style.visibility = "hidden";
    document.querySelector(".chat").style.visibility = "visible";
    
    let u = new Username(userName);
    let tr = new Transport("username", u);
    console.log(tr);

    window.WebSocket = window.WebSocket || window.MozWebSocket;

    let connection = new WebSocket('ws://127.0.0.1:5001');
    connection.onopen = function () {
       connection.send(JSON.stringify(tr));
    };

}

const initChat = ()=>{
    
    
        myColor = false;
        myName = false;
    
        // if user is running mozilla then use it's built-in WebSocket
        window.WebSocket = window.WebSocket || window.MozWebSocket;
        
        if (!window.WebSocket) {
            content.innerHTML("<p>Websockets are not supported</p>");
            input.style.visibility = hidden;
            status.style.visibility = hidden;
            return;
        }
    
        // open connection
        let connection = new WebSocket('ws://127.0.0.1:5001');
        
            connection.onopen = function () {
                // first we want users to enter their names
                input.disabled = false;
                status.innerHTML = "chose name:";
            };
        
            connection.onerror = function (error) {
                // just in there were some problems with conenction...
                content.innerHTML = ("<p>Problems with connection</p>");
            };
        
            // most important part - incoming messages
            connection.onmessage = function (message) {
                // try to parse JSON message. Because we know that the server always returns
                // JSON this should work without any problem but we should make sure that
                // the massage is not chunked or otherwise damaged.
                try {
                    var json = JSON.parse(message.data);
                } catch (e) {
                    console.log('This doesn\'t look like a valid JSON: ', message.data);
                    return;
                }
        
                if (json.type === 'color') { // first response from the server with user's color
                    myColor = json.data;
                    status.innerHTML = myName + ': ';
                    input.disabled = false;
                    input.focus();
                    // from now user can start sending messages
                } else if (json.type === 'history') { // entire message history
                    // insert every single message to the chat window
                    for (var i=0; i < json.data.length; i++) {
                        addMessage(json.data[i].author, json.data[i].text,
                                   json.data[i].color, new Date(json.data[i].time));
                    }
                } else if (json.type === 'message') { // it's a single message
                    input.disabled; // let the user write another message
                    addMessage(json.data.author, json.data.text,
                               json.data.color, new Date(json.data.time));
                } else {
                    console.log('Hmm..., I\'ve never seen JSON like this: ', json);
                }
            };
        
            /**
             * Send mesage when user presses Enter key
             */
            input.addEventListener("keydown", (e)=>{
                if (e.keyCode === 13) {
                    var msg = input.value;
                    if (!msg) {
                        return;
                    }
                    // send the message as an ordinary text
                    connection.send(msg);
                    input.value = "";
                    
                    // disable the input field to make the user wait until server
                    // sends back response
                    input.disabled = false;
        
                }
            })
    
        
            /**
             * This method is optional. If the server wasn't able to respond to the
             * in 3 seconds then show some error message to notify the user that
             * something is wrong.
             */
            setInterval(function() {
                if (connection.readyState !== 1) {
                    status.innerHTML = ('Error');
                    input.disabled = true;
                    input.value = "Unable to comminucate with the WebSocket server";
                                        
                }
            }, 3000);
        
            /**
             * Add message to the chat window
             */
            function addMessage(author, message, color, dt) {
                content.innerHTML = content.innerHTML + ('<p><span style="color:' + color + '">' + author + '</span> @ ' +
                     + (dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()) + ':'
                     + (dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes())
                     + ': ' + message + '</p>');
            }
    
    }

init();
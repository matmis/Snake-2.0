"use strict";

import * as layout from './services/layout.service';
import Socket from './models/Socket.class';
import * as chat from './services/chat.service';
import * as game from './services/game.service';

//login-screen
let btnSubmit, txtUser;

//chatbox
let txtInput;

//game
let socket;

const init = ()=>{
    fetchElements();
    socket = new Socket();
    
};

const fetchElements = () =>{
    //textbox username login-screen
    txtUser = document.querySelector("#txtUser");
    txtUser.focus();

    //submit button login-screen
    btnSubmit = document.querySelector("#btnSubmit");
    btnSubmit.addEventListener("click", ()=>{
        console.log("clicked");
        login();
    });

    //input field of chatbox
    txtInput = document.querySelector("#input");

    //On resize, repostion the canvas
    window.addEventListener("resize", (e)=>{
        layout.positionElements();
    });

    //Eventlisteners for the game + chat
    window.addEventListener("keydown", (e)=>{
        if (e.keyCode === 13) {
            if(document.querySelector(".login-screen").style.visibility == "visible"){
                login();
                return;
            }
            if (!txtInput.value) {
                    return;
            }else{
            socket.send("chat", txtInput.value);
            input.value = "";
            }
        }
        else if(e.keyCode === 37){
            socket.send("direction", 2);
        }
        else if(e.keyCode === 38){
            socket.send("direction", 0);
        }
        else if(e.keyCode === 39){
            socket.send("direction", 3);
        }
        else if(e.keyCode === 40){
            socket.send("direction", 1);
        }
    });

    layout.positionElements();

}

const login = ()=>{
    chat.checkNickname(txtUser.value, socket).then(game.start, loginError);
    chat.checkChat(socket, txtUser.value);
}

const loginError = (error)=>{
    document.querySelector("#loginerror").innerHTML = error;
}

init();

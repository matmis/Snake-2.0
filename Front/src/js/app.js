"use strict";

import * as layout from './services/layout.service';
import Socket from './models/Socket.class';

let btnSubmit, txtUser;
let userName;

let chatContent, chatInput, lblstatus, myColor, myName;
let socket;
let gameCanvas;
let treat = 0;

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
        checkNickname();
    });

    //chatvenster
    chatContent = document.querySelector("#content");
    //textbox onder chatvenster
    chatInput = document.querySelector("#input");
    //status label voor feedback
    lblstatus = document.querySelector("#status");

    //Canvas van het spel
    gameCanvas = document.querySelector("#theGame");


    
    window.addEventListener("resize", (e)=>{
        layout.positionElements();
    });

    window.addEventListener("keydown", (e)=>{
        //console.log(e.keyCode);
        if (e.keyCode === 13) {
            console.log("enter");

            if(document.querySelector(".login-screen").style.visibility == "visible"){
                console.log("test");
                checkNickname();
                return;
            }

            var msg = input.value;
            if (!msg) {
                    return;
            }else{
            socket.emit("chat", msg);
            //console.log(JSON.stringify(tr));
            input.value = "";
            }
        }
        else if(e.keyCode === 37){
            console.log("left");
            socket.emit("direction", 2);
            //console.log(JSON.stringify(tr));
        }
        else if(e.keyCode === 38){
            console.log("up");
            socket.emit("direction", 0);

        }
        else if(e.keyCode === 39){
            console.log("right");
            socket.emit("direction", 3);
        }
        else if(e.keyCode === 40){
            console.log("down");
            socket.emit("direction", 1);
        }
    });

    layout.positionElements();

}

const checkNickname = ()=>{
    let regex = new RegExp("^[a-zA-Z0-9_]{1,12}$");

    if(!regex.test(txtUser.value))
    {
        document.querySelector("#loginerror").innerHTML = "Only alphanumeric characters allowed!";
    }
    else{
        console.log("wel goed");


        userName = txtUser.value;
        socket.emit("username", userName);

        startSpelletje();
    }
};


const startSpelletje = ()=>{
    console.log("start");
    document.querySelector(".login-screen").style.visibility = "hidden";
    document.querySelector(".chat").style.visibility = "visible";
    document.querySelector(".game").style.visibility = "visible";
    document.querySelector(".players").style.visibility = "visible";
    status.innerHTML = userName;
    input.focus();
    initCanvas("Waiting on other players...");
    //checkChat();

};



/*const checkChat = ()=>{
            setInterval(()=> {
                if (connection.readyState !== 1) {
                    status.innerHTML = ('Error');
                    input.disabled = true;
                    input.value = "Unable to comminucate with the WebSocket server";

                }
            }, 3000);
}*/



init();

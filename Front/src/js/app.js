"use strict";

import Transport from "./models/transport.class";
import Username from "./models/username.class";
import Player from "./models/Player.class";

let btnSubmit, txtUser;
let userName, connection;

let content, input, status, myColor, myName;
let player;
let gameCanvas;
let treat = 0;

const init = ()=>{
    fetchElements();

    setupWebsockets();

};

const setupWebsockets = ()=>{
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    
    //connection = new WebSocket('ws://snakews.homenetx.be');
    connection = new WebSocket('ws://127.0.0.1:5001');

    connection.onopen = ()=>{
        //console.log("Opened connection");
        input.disabled = false;
    }

    connection.onerror = (error)=> {
        console.log("Problems with connection...");
    };

    connection.onmessage = (message)=>{
        //console.log(message.data);
        let msg = JSON.parse(message.data);
        console.log(msg);
        if(msg.type == "Player" && msg.data.name == txtUser.value)
        {
            //console.log(msg.data.name)
            player = msg.data;
            //console.log(player);
            status.innerHTML = player.name + ": ";
        }

        if(msg.type == "message")
        {
            let dt = new Date(msg.data.time)
            addMessage(msg.data.author, msg.data.text, msg.data.color, dt);
        }

        if(msg.type == "update")
        {
            let players = msg.data;
            console.log(players);
            drawSnakes(players);
        }
        if(msg.type == "end")
        {
            initCanvas("Game over...")
        }
        if(msg.type == "treat")
        {
            treat = msg.data;
        }

    }

}

const drawSnakes = (players) =>{
    let ctx = gameCanvas.getContext("2d");
    let factor = gameCanvas.clientWidth / 100;
    ctx.clearRect(0,0, gameCanvas.width, gameCanvas.height);
    for(let i=0; i<players.length; i++){
        let color = players[i].color;
        let snake = players[i].snake.location;
        ctx.fillStyle = color;
        for(let y = 0; y< snake.length; y++){
            let drawX, drawY;
            drawX = (snake[y].x * factor) + factor/2;
            drawY = (snake[y].y * factor) + factor/2;
            ctx.beginPath();
            ctx.arc(drawX,drawY, factor/2,0,2*Math.PI);
            ctx.fill();
            ctx.closePath();
            //console.log("drawX: " + drawX);
            //console.log("drawY: ", drawY);
            //console.log("y: " + y);            
        }

    }

    if(treat != 0){
        console.log("tekenen");
        ctx.fillStyle = treat.color;
        ctx.beginPath();
        ctx.arc((treat.pos.x * factor) + factor/2, (treat.pos.y * factor) + factor/2, factor/2, 0,2*Math.PI);
        ctx.fill();
        ctx.closePath();
    }


    

}

const fetchElements = () =>{
    btnSubmit = document.querySelector("#btnSubmit");
    txtUser = document.querySelector("#txtUser");
    txtUser.focus();
    btnSubmit.addEventListener("click", ()=>{
        console.log("clicked");
        checkNickname();
    });

    content = document.querySelector("#content");
 
    input = document.querySelector("#input");
    status = document.querySelector("#status");

    gameCanvas = document.querySelector("#theGame");

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
            let tr = new Transport("chat", msg);
            connection.send(JSON.stringify(tr));
            //console.log(JSON.stringify(tr));
            input.value = "";
            }
        }
        else if(e.keyCode === 37){
            console.log("left");
            let tr = new Transport("direction", 2);
            connection.send(JSON.stringify(tr));
            //console.log(JSON.stringify(tr));
        }
        else if(e.keyCode === 38){
            console.log("up");
            let tr = new Transport("direction", 0);
            connection.send(JSON.stringify(tr));

        }
        else if(e.keyCode === 39){
            console.log("right");
            let tr = new Transport("direction", 3);
            connection.send(JSON.stringify(tr));
        }
        else if(e.keyCode === 40){
            console.log("down");
            let tr = new Transport("direction", 1);
            connection.send(JSON.stringify(tr));
        }
    });

}

const checkNickname = ()=>{
    let regex = new RegExp("^[a-zA-Z ]+$");

    if(!regex.test(txtUser.value))
    {
        console.log("Niet goed");
    }
    else{
        console.log("wel goed");


        userName = new Username(txtUser.value);
        let tr = new Transport("username", userName);
        connection.send(JSON.stringify(tr));
        

        startSpelletje();
    }
};


const startSpelletje = ()=>{
    console.log("start");
    document.querySelector(".login-screen").style.visibility = "hidden";
    document.querySelector(".chat").style.visibility = "visible";
    document.querySelector(".game").style.visibility = "visible";

    input.focus();
    initCanvas("Waiting on other players...");
    checkChat();

};

const initCanvas = (str)=>{
    let ctx = gameCanvas.getContext("2d");
    ctx.canvas.width = gameCanvas.clientWidth;
    ctx.canvas.height = gameCanvas.clientHeight;
    ctx.clearRect(0,0, gameCanvas.width, gameCanvas.height);
    ctx.fillStyle = "#FFF";
    ctx.font = "2em Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(str, gameCanvas.width /2, gameCanvas.height /2);
}

const checkChat = ()=>{
            setInterval(()=> {
                if (connection.readyState !== 1) {
                    status.innerHTML = ('Error');
                    input.disabled = true;
                    input.value = "Unable to comminucate with the WebSocket server";

                }
            }, 3000);
}

const addMessage = (author, message, color, dt) => {
        content.innerHTML = content.innerHTML + ('<p><span style="color:' + color + '">' + author + '</span> @ ' +
             + (dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()) + ':'
             + (dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes())
             + ': ' + message + '</p>');
             content.scrollTop = content.scrollHeight;
}

init();

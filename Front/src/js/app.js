"use strict";

import Transport from "./models/transport.class";
import Username from "./models/username.class";
import Player from "./models/Player.class";

let btnSubmit, txtUser;
let userName;

let content, input, status, myColor, myName;
let socket;
let player;
let gameCanvas;
let treat = 0;

const init = ()=>{
    fetchElements();

    setupWebsockets();

};

const setupWebsockets = ()=>{

    socket = io.connect(location.protocol + "//" + location.host);


    //socket.emit("message", "tetten");
    socket.on("Player", (data) => {
        console.log(data);
        let msg = JSON.parse(data);
      if(msg.data.name == txtUser.value)
      {
          //console.log(msg.data.name)
          player = msg.data;
          //console.log(player);
          status.innerHTML = player.name + ": ";
      }

      showScores(msg.data, false);
    });

    socket.on("message", (data)=>{
        console.log(data);
        let msg = JSON.parse(data);
        console.log(msg);
        let dt = new Date(msg.data.time)
        addMessage(msg.data.author, msg.data.text, msg.data.color, dt);
    });

    socket.on("update", (data)=>{
        console.log(data);
        let msg = JSON.parse(data);
        console.log(msg);
        let players = msg.data;
        console.log(players);
        drawSnakes(players);
        showScores(players, true);
    });

    socket.on("end", (data)=>{
        console.log(data);
        initCanvas("Game Over...");
    });
    socket.on("treat", (data)=>{
        console.log(data);
        treat = msg.data;
    });


}
const showScores = (players, bool)=>{
    let bobTheHtmlBuilder = "";
    if(bool){
    (players).forEach((player)=> {
        bobTheHtmlBuilder += `<div><div ><div style="background-color: ${player.color}"></div><p>${player.name}</p></div><p>${player.score}</p></div>`;
    }, this);
    }
    else{
        bobTheHtmlBuilder += `<div><div ><div style="background-color: ${players.color}"></div><p>${players.name}</p></div><p>${players.score}</p></div>`;
    }
    document.querySelector(".players").innerHTML = (bobTheHtmlBuilder);
    console.log("Weggeschreven");
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
        //console.log("tekenen");
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

    positionEverything();
    window.addEventListener("resize", (e)=>{
        positionEverything();
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
            socket.emit("chat", JSON.stringify(msg));
            //console.log(JSON.stringify(tr));
            input.value = "";
            }
        }
        else if(e.keyCode === 37){
            console.log("left");
            socket.emit("direction", JSON.stringify(2));
            //console.log(JSON.stringify(tr));
        }
        else if(e.keyCode === 38){
            console.log("up");
            socket.emit("direction", JSON.stringify(0));

        }
        else if(e.keyCode === 39){
            console.log("right");
            socket.emit("direction", JSON.stringify(3));
        }
        else if(e.keyCode === 40){
            console.log("down");
            socket.emit("direction", JSON.stringify(1));
        }
    });

}

const positionEverything = ()=>{
    console.log("width: ",window.screen.availWidth);
    console.log("height: ",window.screen.availHeight);
    let width = 0;
    if(window.innerWidth < window.innerHeight)
    {
        width = 20;
    }
    else{
        width = window.innerHeight - 25 - 15 - 15 - 20 - 15;
    }

    gameCanvas.width = width;
    gameCanvas.height = width;
    console.log("width: ", width);
    document.querySelector(".chat").style.height = document.querySelector(".game").clientHeight + "px";
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
        console.log(userName);
        socket.emit("username", JSON.stringify(userName));
        console.log(JSON.stringify(userName));
        startSpelletje();
    }
};


const startSpelletje = ()=>{
    console.log("start");
    document.querySelector(".login-screen").style.visibility = "hidden";
    document.querySelector(".chat").style.visibility = "visible";
    document.querySelector(".game").style.visibility = "visible";
    document.querySelector(".players").style.visibility = "visible";

    input.focus();
    initCanvas("Waiting on other players...");
    //checkChat();

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

/*const checkChat = ()=>{
            setInterval(()=> {
                if (connection.readyState !== 1) {
                    status.innerHTML = ('Error');
                    input.disabled = true;
                    input.value = "Unable to comminucate with the WebSocket server";

                }
            }, 3000);
}*/

const addMessage = (author, message, color, dt) => {
        content.innerHTML = content.innerHTML + ('<p><span style="color:' + color + '">' + author + '</span> @ ' +
             + (dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()) + ':'
             + (dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes())
             + ': ' + message + '</p>');
             content.scrollTop = content.scrollHeight;
}

init();

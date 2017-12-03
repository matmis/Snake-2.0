import * as canvas from './canvas.service';

export function start(userName){
    document.querySelector(".login-screen").style.visibility = "hidden";
    document.querySelector(".chat").style.visibility = "visible";
    document.querySelector(".game").style.visibility = "visible";
    document.querySelector(".players").style.visibility = "visible";
    document.querySelector("#status").innerHTML = userName;
    document.querySelector("#input").focus();
    canvas.drawText("Waiting on other players...");
};
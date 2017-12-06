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


export function restart(socket, userName){
    let counter = 6;
    let rejoin = setInterval(()=>{
        if(counter == 6)
        {
            canvas.drawText("Game Over...");
        }
        else if(counter == 0)
        {
            reJoinGame(socket, userName);
            clearInterval(rejoin);
        }
        else{
            canvas.drawText("Rejoining in " + counter + " seconds");
        }
        counter--;
    }, 1000);
}

export function reJoinGame(socket, userName){
    socket.setUpdate(true);
    socket.send("username", userName);
    socket.send("treat", true);
    canvas.drawText("Waiting on other players...");
}
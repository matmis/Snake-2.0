export function positionElements(){
    let gameCanvas = document.querySelector("#theGame");
    //console.log("width: ",window.screen.availWidth);
    //console.log("height: ",window.screen.availHeight);
    let width = 0;
    if(window.innerWidth < window.innerHeight)
    {
        width = 20;
    }
    else{
        width = window.innerHeight - 25 - 15 - 15 - 20 - 15;
    }

    //hooghte en breedte aanpassen van het gameCanvas
    gameCanvas.width = width;
    gameCanvas.height = width;
    //console.log("width: ", width);
    
    //De chatbox juist positioneren
    document.querySelector(".chat").style.height = document.querySelector(".game").clientHeight + "px";
}
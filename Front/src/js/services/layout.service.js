export function positionElements() {
    let gameCanvas = document.querySelector("#theGame");
    //console.log("width: ",window.screen.availWidth);
    //console.log("height: ",window.screen.availHeight);
    let width = 0;
    if (window.innerWidth <= window.innerHeight + 300) {
        //basseren op breedte
        if(window.innerWidth >= 850){
        width = window.innerWidth - 300 - 25 - 15 - 15 - 20 - 15;}
        else{
            if(window.innerHeight > window.innerWidth)
            {
            width = window.innerWidth - 50;
            }
            else{
                width = window.innerHeight - 25 - 15 - 15 - 20 - 15; //margins en borders en footer
            }
        }
    }
    else {
        //basseren op hoogte
        width = window.innerHeight - 25 - 15 - 15 - 20 - 15; //margins en borders en footer
    }

    //hooghte en breedte aanpassen van het gameCanvas
    gameCanvas.width = width;
    gameCanvas.height = width;
    //console.log("width: ", width);

    //De chatbox juist positioneren
    let height = document.querySelector(".game").clientHeight;
    document.querySelector(".chat").style.height = height + "px";
    if (window.innerWidth > 950) {
        document.querySelector("#content").style.height = height - 350 + "px";
    }
    else {
        document.querySelector("#content").style.height = height - 200 + "px";
    }
}
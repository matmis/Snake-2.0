export function drawText(tekst){
    let gameCanvas = document.querySelector("#theGame");
    let ctx = gameCanvas.getContext("2d");
    ctx.canvas.width = gameCanvas.clientWidth;
    ctx.canvas.height = gameCanvas.clientHeight;
    ctx.clearRect(0,0, gameCanvas.width, gameCanvas.height);
    ctx.fillStyle = "#FFF";
    ctx.font = "2em Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(tekst, gameCanvas.width /2, gameCanvas.height /2);
}
export function drawSnakes(players){
    let gameCanvas = document.querySelector("#theGame");
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
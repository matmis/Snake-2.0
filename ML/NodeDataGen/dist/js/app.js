document.addEventListener("DOMContentLoaded", () => {
  var socket = io.connect(location.protocol + "//" + location.host);

  var snake, treat;

  socket.on("treat", (data) => {
    console.log(data);
    treat = data;
    if(treat != undefined && snake != undefined){
      DrawCanvas(snake, treat);
    }
  });

  socket.on("snake", (data) => {
    console.log(data);
    snake = data;
    if(treat != undefined && snake != undefined){
      DrawCanvas(snake, treat);
    }
  });

  StartEventListeners(socket);
});

function StartEventListeners(socket){
  document.addEventListener("keydown", (e) => {
    console.log(e.keyCode);
    if(e.keyCode === 37){
      socket.emit("move", 2);
    }else if(e.keyCode === 38){
      socket.emit("move", 0);
    }else if(e.keyCode === 39){
      socket.emit("move", 3);
    }else if(e.keyCode === 40){
      socket.emit("move", 1);
    }
  });
}

function DrawCanvas(snake, treat){
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width, canvas.height);
  for (var i = 0; i < snake.location.length; i++) {
    var loc = snake.location[i];
    x = loc.x * 10;
    y = loc.y * 10;
    console.log(loc);
    if(i === 0){
      ctx.fillStyle = "#0000FF";
    }else{
      ctx.fillStyle = "#FF0000";
    }
    ctx.beginPath();
    ctx.arc(x+5, y+5, 5, 0, 2*Math.PI);
    ctx.fill();
    ctx.closePath();
  }
  x = treat.x * 10;
  y = treat.y * 10;
  ctx.fillStyle = "#00FF00";
  ctx.beginPath();
  ctx.arc(x+5, y+5,5,0,2*Math.PI);
  ctx.fill();
  ctx.closePath();
}

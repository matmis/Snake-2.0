const Snake = require("./snake.class");
const Treat = require("./treat.class");
const fs = require("fs");

module.exports = (socketio) => {
  let io = socketio;
  let snake = new Snake();
  let treat = new Treat();

  io.on("connection", (socket) => {

    io.local.emit("treat", treat);
    io.local.emit("snake", snake);

    socket.on("move", (data) => {
      console.log(data);
      moveSnake(data, snake, treat, (s, t) => {
        snake = s;
        treat = t;
      });
    });

    socket.on("requestmove", () => {
      requestmove(() => {

      });
    });

  });

  let requestmove = (cb) => {
    let req = "";
    req += treat.x + "," + treat.y + "," + snake.location[0].x + "," + snake.location[0].y + ",";
    snake.checkSides((bl, br, ba,bb) => {
      req += bl + "," + br + "," + ba + "," + bb;
      req = req.replace(new RegExp(escapeRegExp("false"), 'g'), 0).replace(new RegExp(escapeRegExp("true"), 'g'),1);
      io.local.emit("requestmoveanswer", req);
    });
    cb();
  };

  let moveSnake = (dir, snake, treat, cb) => {
    snake.changeDirection(dir, () => {
      snake.move(() => {
        if(snake.location[0].x == 20){
          snake.location[0].x = 0;
        }
        if(snake.location[0].x == -1){
          snake.location[0].x = 19;
        }
        if(snake.location[0].y == 20){
          snake.location[0].y = 0;
        }
        if(snake.location[0].y == -1){
          snake.location[0].y = 19;
        }
        snake.checkCollisionWithSelf((col) => {
          if(col){
            console.log("dood");
            snake = new Snake();
          }else{
            if(treat.x == snake.location[0].x && treat.y == snake.location[0].y){
              treat = new Treat();
              snake.Grow();
            }
          }
          io.local.emit("snake", snake);
          io.local.emit("treat", treat);

          requestmove(() => {
            snake.checkSides((bl,br,ba,bb) => {
              //let csvstring =snake.direction + "," + treat.x + "," + treat.y + "," + snake.location[0].x + "," + snake.location[0].y + "," + bl + "," + br + "," + ba + "," + bb + "\n";
              //csvstring = csvstring.replace(new RegExp(escapeRegExp("false"), 'g'), 0).replace(new RegExp(escapeRegExp("true"), 'g'),1);
              //let ws = fs.createWriteStream("data.csv", {"flags": "a"});
              //ws.write(csvstring);
              //ws.end();
              cb(snake, treat);
            });
          });
        });
      });
    });
  };

  let escapeRegExp = (str) => {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  };
};

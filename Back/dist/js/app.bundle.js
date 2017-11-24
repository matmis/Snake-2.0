/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(7);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _transport = __webpack_require__(2);

var _transport2 = _interopRequireDefault(_transport);

var _username = __webpack_require__(3);

var _username2 = _interopRequireDefault(_username);

var _Player = __webpack_require__(4);

var _Player2 = _interopRequireDefault(_Player);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var btnSubmit = void 0,
    txtUser = void 0;
var userName = void 0,
    connection = void 0;

var content = void 0,
    input = void 0,
    status = void 0,
    myColor = void 0,
    myName = void 0;
var player = void 0;
var gameCanvas = void 0;
var treat = 0;
var socket;

var init = function init() {
    fetchElements();

    setupWebsockets();
};

var setupWebsockets = function setupWebsockets() {
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    socket = io.connect("http://localhost:5000");
    //connection = new WebSocket('ws://snakews.homenetx.be');

    socket.on("history", function (data) {
        console.log(data);
    });
    socket.on("message", function (data) {
        console.log(data);
    });
    socket.on("update", function(data){
      console.log("update received: " + data);
    });

    connection = new WebSocket('ws://127.0.0.1:5001');

    connection.onopen = function () {
        //console.log("Opened connection");
        input.disabled = false;
    };

    connection.onerror = function (error) {
        console.log("Problems with connection...");
    };

    connection.onmessage = function (message) {
        //console.log(message.data);
        var msg = JSON.parse(message.data);
        console.log(msg);
        if (msg.type == "Player" && msg.data.name == txtUser.value) {
            //console.log(msg.data.name)
            player = msg.data;
            //console.log(player);
            status.innerHTML = player.name + ": ";
        }

        if (msg.type == "message") {
            var dt = new Date(msg.data.time);
            addMessage(msg.data.author, msg.data.text, msg.data.color, dt);
        }
        if (msg.type == "Player") {
            showScores(msg.data, false);
        }
        if (msg.type == "update") {
            var players = msg.data;
            console.log(players);
            drawSnakes(players);
            showScores(players, true);
        }
        if (msg.type == "end") {
            initCanvas("Game over...");
        }
        if (msg.type == "treat") {
            treat = msg.data;
        }
    };
};
var showScores = function showScores(players, bool) {
    var bobTheHtmlBuilder = "";
    if (bool) {
        players.forEach(function (player) {
            bobTheHtmlBuilder += "<div><div ><div style=\"background-color: " + player.color + "\"></div><p>" + player.name + "</p></div><p>" + player.score + "</p></div>";
        }, undefined);
    } else {
        bobTheHtmlBuilder += "<div><div ><div style=\"background-color: " + players.color + "\"></div><p>" + players.name + "</p></div><p>" + players.score + "</p></div>";
    }
    document.querySelector(".players").innerHTML = bobTheHtmlBuilder;
    console.log("Weggeschreven");
};

var drawSnakes = function drawSnakes(players) {
    var ctx = gameCanvas.getContext("2d");
    var factor = gameCanvas.clientWidth / 100;
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    for (var i = 0; i < players.length; i++) {
        var color = players[i].color;
        var snake = players[i].snake.location;
        ctx.fillStyle = color;
        for (var y = 0; y < snake.length; y++) {
            var drawX = void 0,
                drawY = void 0;
            drawX = snake[y].x * factor + factor / 2;
            drawY = snake[y].y * factor + factor / 2;
            ctx.beginPath();
            ctx.arc(drawX, drawY, factor / 2, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
            //console.log("drawX: " + drawX);
            //console.log("drawY: ", drawY);
            //console.log("y: " + y);
        }
    }

    if (treat != 0) {
        //console.log("tekenen");
        ctx.fillStyle = treat.color;
        ctx.beginPath();
        ctx.arc(treat.pos.x * factor + factor / 2, treat.pos.y * factor + factor / 2, factor / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
};

var fetchElements = function fetchElements() {

    btnSubmit = document.querySelector("#btnSubmit");
    txtUser = document.querySelector("#txtUser");
    txtUser.focus();
    btnSubmit.addEventListener("click", function () {
        console.log("clicked");
        checkNickname();
    });

    content = document.querySelector("#content");

    input = document.querySelector("#input");
    status = document.querySelector("#status");

    gameCanvas = document.querySelector("#theGame");

    positionEverything();
    window.addEventListener("resize", function (e) {
        positionEverything();
    });

    window.addEventListener("keydown", function (e) {
        //console.log(e.keyCode);
        if (e.keyCode === 13) {
            console.log("enter");

            if (document.querySelector(".login-screen").style.visibility == "visible") {
                console.log("test");
                checkNickname();
                return;
            }

            var msg = input.value;
            if (!msg) {
                return;
            } else {
                var tr = new _transport2.default("chat", msg);
                connection.send(JSON.stringify(tr));
                //console.log(JSON.stringify(tr));
                input.value = "";
            }
        } else if (e.keyCode === 37) {
            console.log("left");
            var _tr = new _transport2.default("direction", 2);
            connection.send(JSON.stringify(_tr));
            //console.log(JSON.stringify(tr));
        } else if (e.keyCode === 38) {
            console.log("up");
            var _tr2 = new _transport2.default("direction", 0);
            connection.send(JSON.stringify(_tr2));
        } else if (e.keyCode === 39) {
            console.log("right");
            var _tr3 = new _transport2.default("direction", 3);
            connection.send(JSON.stringify(_tr3));
        } else if (e.keyCode === 40) {
            console.log("down");
            var _tr4 = new _transport2.default("direction", 1);
            connection.send(JSON.stringify(_tr4));
        }
    });
};

var positionEverything = function positionEverything() {
    console.log("width: ", window.screen.availWidth);
    console.log("height: ", window.screen.availHeight);
    var width = 0;
    if (window.innerWidth < window.innerHeight) {
        width = 20;
    } else {
        width = window.innerHeight - 25 - 15 - 15 - 20 - 15;
    }

    gameCanvas.width = width;
    gameCanvas.height = width;
    console.log("width: ", width);
    document.querySelector(".chat").style.height = document.querySelector(".game").clientHeight + "px";
};

var checkNickname = function checkNickname() {
    var regex = new RegExp("^[a-zA-Z0-9_]{1,12}$");

    if (!regex.test(txtUser.value)) {
        document.querySelector("#loginerror").innerHTML = "Only alphanumeric characters allowed!";
    } else {
        console.log("wel goed");

        userName = new _username2.default(txtUser.value);
        var tr = new _transport2.default("username", userName);
        socket.emit("username", userName);
        connection.send(JSON.stringify(tr));

        startSpelletje();
    }
};

var startSpelletje = function startSpelletje() {
    console.log("start");
    document.querySelector(".login-screen").style.visibility = "hidden";
    document.querySelector(".chat").style.visibility = "visible";
    document.querySelector(".game").style.visibility = "visible";
    document.querySelector(".players").style.visibility = "visible";

    input.focus();
    initCanvas("Waiting on other players...");
    checkChat();
};

var initCanvas = function initCanvas(str) {
    var ctx = gameCanvas.getContext("2d");
    ctx.canvas.width = gameCanvas.clientWidth;
    ctx.canvas.height = gameCanvas.clientHeight;
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.fillStyle = "#FFF";
    ctx.font = "2em Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(str, gameCanvas.width / 2, gameCanvas.height / 2);
};

var checkChat = function checkChat() {
    setInterval(function () {
        if (connection.readyState !== 1) {
            status.innerHTML = 'Error';
            input.disabled = true;
            input.value = "Unable to comminucate with the WebSocket server";
        }
    }, 3000);
};

var addMessage = function addMessage(author, message, color, dt) {
    content.innerHTML = content.innerHTML + ('<p><span style="color:' + color + '">' + author + '</span> @ ' + +(dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()) + ':' + (dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes()) + ': ' + message + '</p>');
    content.scrollTop = content.scrollHeight;
};

init();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Transport = function () {
  function Transport(model, data) {
    _classCallCheck(this, Transport);

    this.model = model;
    this.data = data;
  }

  _createClass(Transport, null, [{
    key: "SendString",
    value: function SendString(model, data) {
      //model = waarop we gaan fileteren
      //data = inhoud van het model
      var m = model,
          d = data;
      var ts = {
        model: m,
        data: d
      };
      return JSON.stringify(ts);
      //console.log(ts);
    }
  }]);

  return Transport;
}();

exports.default = Transport;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UserName = function UserName(username) {
  _classCallCheck(this, UserName);

  this.username = username;
};

exports.default = UserName;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Snake = __webpack_require__(5);

var _Snake2 = _interopRequireDefault(_Snake);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = function Player(name, color) {
  _classCallCheck(this, Player);

  this.name = name;
  this.snake = new _Snake2.default();
  this.color = color;
};

exports.default = Player;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Pos = __webpack_require__(6);

var _Pos2 = _interopRequireDefault(_Pos);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Snake = function () {
  function Snake() {
    _classCallCheck(this, Snake);

    this.directions = {
      UP: 0,
      DOWN: 1,
      LEFT: 2,
      RIGHT: 3
    };

    this.location = [];

    this.direction = this.directions.RIGHT;

    this.location.push(new _Pos2.default(0, 0));
    this.location.push(new _Pos2.default(-1, 0));
    this.location.push(new _Pos2.default(-2, 0));
    this.location.push(new _Pos2.default(-3, 0));
  }

  _createClass(Snake, [{
    key: "GameTick",
    value: function GameTick() {
      var head = void 0;
      switch (this.direction) {
        case this.directions.UP:
          head = new _Pos2.default(this.location[0].x, this.location[0].y + 1);
          break;
        case this.directions.DOWN:
          head = new _Pos2.default(this.location[0].x, this.location[0].y - 1);
          break;
        case this.directions.LEFT:
          head = new _Pos2.default(this.location[0].x - 1, this.location[0].y);
          break;
        case this.directions.RIGHT:
          head = new _Pos2.default(this.location[0].x + 1, this.location[0].y);
          break;
        default:
      }
      this.location.splice(0, 0, head);
      this.location.splice(this.location.length - 1, 1);
    }
  }]);

  return Snake;
}();

exports.default = Snake;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Pos = function () {
  function Pos(x, y) {
    _classCallCheck(this, Pos);

    this.x = x;
    this.y = y;
  }

  _createClass(Pos, [{
    key: "toJSON",
    value: function toJSON() {
      var x = this.x,
          y = this.y;

      return { x: x, y: y };
    }
  }]);

  return Pos;
}();

exports.default = Pos;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);

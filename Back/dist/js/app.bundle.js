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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.addMessage = addMessage;
exports.checkNickname = checkNickname;
exports.checkChat = checkChat;
function addMessage(author, message, color, dt) {
    content.innerHTML = content.innerHTML + ('<p><span style="color:' + color + '">' + author + '</span> @ ' + +(dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()) + ':' + (dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes()) + ': ' + message + '</p>');
    content.scrollTop = content.scrollHeight;
}

function checkNickname(userName, socket) {

    return new Promise(function (ok, nok) {
        var regex = new RegExp("^[a-zA-Z0-9_]{1,12}$");

        if (!regex.test(userName)) {
            nok("Only alphanumeric characters allowed!");
        } else {
            socket.send("username", userName);
            socket.send("treat", true);
            ok(userName);
        }
    });
}

function checkChat(socket, userName) {
    setInterval(function () {
        //console.log(socket.socket.io.readyState);
        if (socket.socket.io.readyState != "open") {
            document.querySelector("#status").innerHTML = 'Error';
            document.querySelector("#input").disabled = true;
            document.querySelector("#input").value = "Connection lost...";
        }
    }, 1000);
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.drawText = drawText;
exports.drawSnakes = drawSnakes;
function drawText(tekst) {
    var gameCanvas = document.querySelector("#theGame");
    var ctx = gameCanvas.getContext("2d");
    ctx.canvas.width = gameCanvas.clientWidth;
    ctx.canvas.height = gameCanvas.clientHeight;
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.fillStyle = "#FFF";
    ctx.font = "2em Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(tekst, gameCanvas.width / 2, gameCanvas.height / 2);
}
function drawSnakes(players, treat) {
    var gameCanvas = document.querySelector("#theGame");
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
        //console.log("treatje")
        for (var _i = 0; _i < treat.treats.length; _i++) {
            //console.log("teat " + i);
            ctx.beginPath();
            ctx.arc(treat.treats[_i].x * factor + factor / 2, treat.treats[_i].y * factor + factor / 2, factor / 2, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
        }
    }
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.start = start;
exports.restart = restart;
exports.reJoinGame = reJoinGame;

var _canvas = __webpack_require__(1);

var canvas = _interopRequireWildcard(_canvas);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function start(userName) {
    document.querySelector(".login-screen").style.visibility = "hidden";
    document.querySelector("footer").style.visibility = "visible";
    document.querySelector(".chat").style.visibility = "visible";
    document.querySelector(".game").style.visibility = "visible";
    document.querySelector(".players").style.visibility = "visible";
    document.querySelector("#status").innerHTML = userName;
    document.querySelector("#input").focus();
    canvas.drawText("Waiting on other players...");
};

function restart(socket, userName) {
    var counter = 6;
    var rejoin = setInterval(function () {
        if (counter == 6) {
            canvas.drawText("Game Over...");
        } else if (counter == 0) {
            reJoinGame(socket, userName);
            clearInterval(rejoin);
        } else {
            canvas.drawText("Rejoining in " + counter + " seconds");
        }
        counter--;
    }, 1000);
}

function reJoinGame(socket, userName) {
    socket.setUpdate(true);
    socket.send("username", userName);
    socket.send("treat", true);
    canvas.drawText("Waiting on other players...");
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(4);
module.exports = __webpack_require__(8);


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _layout = __webpack_require__(5);

var layout = _interopRequireWildcard(_layout);

var _Socket = __webpack_require__(6);

var _Socket2 = _interopRequireDefault(_Socket);

var _chat = __webpack_require__(0);

var chat = _interopRequireWildcard(_chat);

var _game = __webpack_require__(2);

var game = _interopRequireWildcard(_game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

//login-screen
var btnSubmit = void 0,
    txtUser = void 0;

//chatbox
var txtInput = void 0;

//game
var socket = void 0;

var init = function init() {
    fetchElements();
    socket = new _Socket2.default();
};

var fetchElements = function fetchElements() {
    //textbox username login-screen
    txtUser = document.querySelector("#txtUser");
    txtUser.focus();

    //submit button login-screen
    btnSubmit = document.querySelector("#btnSubmit");
    btnSubmit.addEventListener("click", function () {
        console.log("clicked");
        login();
    });

    //input field of chatbox
    txtInput = document.querySelector("#input");

    //On resize, repostion the canvas
    window.addEventListener("resize", function (e) {
        layout.positionElements();
    });

    //Eventlisteners for the game + chat
    window.addEventListener("keydown", function (e) {
        if (e.keyCode === 13) {
            if (document.querySelector(".login-screen").style.visibility == "visible") {
                login();
                return;
            }
            if (!txtInput.value) {
                return;
            } else {
                socket.send("chat", txtInput.value);
                input.value = "";
            }
        } else if (e.keyCode === 37) {
            socket.send("direction", 2);
        } else if (e.keyCode === 38) {
            socket.send("direction", 0);
        } else if (e.keyCode === 39) {
            socket.send("direction", 3);
        } else if (e.keyCode === 40) {
            socket.send("direction", 1);
        }
    });

    layout.positionElements();
};

var login = function login() {
    chat.checkNickname(txtUser.value, socket).then(function () {
        socket.setUserName(txtUser.value);
        game.start(txtUser.value);
    }, loginError);
    chat.checkChat(socket, txtUser.value);
};

var loginError = function loginError(error) {
    document.querySelector("#loginerror").innerHTML = error;
};

init();

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.positionElements = positionElements;
function positionElements() {
    var gameCanvas = document.querySelector("#theGame");
    //console.log("width: ",window.screen.availWidth);
    //console.log("height: ",window.screen.availHeight);
    var width = 0;
    if (window.innerWidth <= window.innerHeight + 300) {
        //basseren op breedte
        if (window.innerWidth >= 850) {
            width = window.innerWidth - 300 - 25 - 15 - 15 - 20 - 15;
        } else {
            if (window.innerHeight > window.innerWidth) {
                width = window.innerWidth - 50;
            } else {
                width = window.innerHeight - 25 - 15 - 15 - 20 - 15; //margins en borders en footer
            }
        }
    } else {
        //basseren op hoogte
        width = window.innerHeight - 25 - 15 - 15 - 20 - 15; //margins en borders en footer
    }

    //hooghte en breedte aanpassen van het gameCanvas
    gameCanvas.width = width;
    gameCanvas.height = width;
    //console.log("width: ", width);

    //De chatbox juist positioneren
    var height = document.querySelector(".game").clientHeight;
    document.querySelector(".chat").style.height = height + "px";
    if (window.innerWidth > 950) {
        document.querySelector("#content").style.height = height - 350 + "px";
    } else {
        document.querySelector("#content").style.height = height - 200 + "px";
    }
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chat = __webpack_require__(0);

var chat = _interopRequireWildcard(_chat);

var _score = __webpack_require__(7);

var score = _interopRequireWildcard(_score);

var _canvas = __webpack_require__(1);

var canvas = _interopRequireWildcard(_canvas);

var _game = __webpack_require__(2);

var game = _interopRequireWildcard(_game);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Socket = function () {
    function Socket(treat) {
        _classCallCheck(this, Socket);

        this.socket = io.connect(location.protocol + "//" + location.host);
        this.socketListener();
        this.treat = 0;
        this.userName = "";
        this.update = true;
    }

    _createClass(Socket, [{
        key: 'setUserName',
        value: function setUserName(str) {
            this.userName = str;
        }
    }, {
        key: 'setUpdate',
        value: function setUpdate(bool) {
            this.update = bool;
        }
    }, {
        key: 'socketListener',
        value: function socketListener() {
            var _this = this;

            this.socket.on("player", function (data) {
                console.log("player: ", data);
                score.show(data, false);
            });

            this.socket.on("message", function (data) {
                console.log("Message: ", data);
                var dt = new Date(data.time);
                chat.addMessage(data.author, data.text, data.color, dt);
            });

            this.socket.on("update", function (data) {
                console.log("update: ", data);
                var players = data;
                console.log(players);
                if (_this.update) {
                    canvas.drawSnakes(players, _this.treat);
                    score.show(players, true);
                }
            });

            this.socket.on("end", function (data) {
                console.log("end:" + data);
                canvas.drawText("Game Over...");
            });

            this.socket.on("treat", function (data) {
                console.log("treat: ", data);
                _this.treat = data;
            });
            this.socket.on("death", function (data) {
                console.log("death: ", data);
                if (data.name == _this.userName) {
                    _this.update = false;
                    game.restart(_this, _this.userName);
                }
            });
        }
    }, {
        key: 'send',
        value: function send(header, message) {
            this.socket.emit(header, message);
        }
    }]);

    return Socket;
}();

exports.default = Socket;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.show = show;
function show(players, bool) {
    var bobTheHtmlBuilder = "";

    if (bool) {
        players.forEach(function (player) {
            bobTheHtmlBuilder += "<div><div ><div style=\"background-color: " + player.color + "\"></div><p>" + player.name + "</p></div><p>" + player.score + "</p></div>";
        });
    } else {
        bobTheHtmlBuilder += "<div><div ><div style=\"background-color: " + players.color + "\"></div><p>" + players.name + "</p></div><p>" + players.score + "</p></div>";
    }
    document.querySelector(".players").innerHTML = bobTheHtmlBuilder;
    console.log("Weggeschreven");
}

/***/ }),
/* 8 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);
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
module.exports = __webpack_require__(2);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var btnSubmit = void 0,
    txtUser = void 0;
var userName = void 0;

var content = void 0,
    input = void 0,
    status = void 0,
    myColor = void 0,
    myName = void 0;
var socket = void 0;
var gameCanvas = void 0;
var treat = 0;

var init = function init() {
    fetchElements();

    setupWebsockets();
};

var setupWebsockets = function setupWebsockets() {

    socket = io.connect(location.protocol + "//" + location.host);

    socket.on("player", function (data) {
        console.log("player: ", data);
        showScores(data, false);
    });

    socket.on("message", function (data) {
        console.log("Message: ", data);
        var dt = new Date(data.time);
        addMessage(data.author, data.text, data.color, dt);
    });

    socket.on("update", function (data) {
        console.log(data);
        var players = data;
        console.log(players);
        drawSnakes(players);
        showScores(players, true);
    });

    socket.on("end", function (data) {
        console.log(data);
        initCanvas("Game Over...");
    });
    socket.on("treat", function (data) {
        console.log(data);
        treat = data;
    });
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
                socket.emit("chat", msg);
                //console.log(JSON.stringify(tr));
                input.value = "";
            }
        } else if (e.keyCode === 37) {
            console.log("left");
            socket.emit("direction", 2);
            //console.log(JSON.stringify(tr));
        } else if (e.keyCode === 38) {
            console.log("up");
            socket.emit("direction", 0);
        } else if (e.keyCode === 39) {
            console.log("right");
            socket.emit("direction", 3);
        } else if (e.keyCode === 40) {
            console.log("down");
            socket.emit("direction", 1);
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

        userName = txtUser.value;
        socket.emit("username", userName);

        startSpelletje();
    }
};

var startSpelletje = function startSpelletje() {
    console.log("start");
    document.querySelector(".login-screen").style.visibility = "hidden";
    document.querySelector(".chat").style.visibility = "visible";
    document.querySelector(".game").style.visibility = "visible";
    document.querySelector(".players").style.visibility = "visible";
    status.innerHTML = userName;
    input.focus();
    initCanvas("Waiting on other players...");
    //checkChat();
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

/*const checkChat = ()=>{
            setInterval(()=> {
                if (connection.readyState !== 1) {
                    status.innerHTML = ('Error');
                    input.disabled = true;
                    input.value = "Unable to comminucate with the WebSocket server";

                }
            }, 3000);
}*/

var addMessage = function addMessage(author, message, color, dt) {
    content.innerHTML = content.innerHTML + ('<p><span style="color:' + color + '">' + author + '</span> @ ' + +(dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()) + ':' + (dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes()) + ': ' + message + '</p>');
    content.scrollTop = content.scrollHeight;
};

init();

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);
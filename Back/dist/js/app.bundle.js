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


console.log("app loaded");

console.log("login loaded");

var btnSubmit = void 0,
    txtUser = void 0;
var userName = void 0;

var content = void 0,
    input = void 0,
    status = void 0,
    myColor = void 0,
    myName = void 0;

var init = function init() {

    btnSubmit = document.querySelector("#btnSubmit");
    txtUser = document.querySelector("#txtUser");

    btnSubmit.addEventListener("click", function () {
        console.log("clicked");
        checkNickname();
    });

    console.log(btnSubmit);
    console.log(txtUser);
};

var checkNickname = function checkNickname() {
    var regex = new RegExp("^[a-zA-Z ]+$");

    if (!regex.test(txtUser.value)) {
        console.log("Niet goed");
    } else {
        console.log("wel goed");
        userName = txtUser.value;
        startSpelletje();
    }
};

var startSpelletje = function startSpelletje() {
    console.log("start");
    document.querySelector(".login-screen").style.visibility = "hidden";
    document.querySelector(".chat").style.visibility = "visible";

    initChat();
};

var initChat = function initChat() {
    content = document.querySelector("#content");
    input = document.querySelector("#input");
    status = document.querySelector("#status");

    myColor = false;
    myName = false;

    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    if (!window.WebSocket) {
        content.innerHTML("<p>Websockets are not supported</p>");
        input.style.visibility = hidden;
        status.style.visibility = hidden;
        return;
    }

    // open connection
    var connection = new WebSocket('ws://127.0.0.1:5001');

    connection.onopen = function () {
        // first we want users to enter their names
        input.disabled = false;
        status.innerHTML = "chose name:";
    };

    connection.onerror = function (error) {
        // just in there were some problems with conenction...
        content.html("<p>Problems with connection</p>");
    };

    // most important part - incoming messages
    connection.onmessage = function (message) {
        // try to parse JSON message. Because we know that the server always returns
        // JSON this should work without any problem but we should make sure that
        // the massage is not chunked or otherwise damaged.
        try {
            var json = JSON.parse(message.data);
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', message.data);
            return;
        }

        // NOTE: if you're not sure about the JSON structure
        // check the server source code above
        if (json.type === 'color') {
            // first response from the server with user's color
            myColor = json.data;
            status.innerHTML = myName + ': ';
            input.disabled = false;
            input.focus();
            // from now user can start sending messages
        } else if (json.type === 'history') {
            // entire message history
            // insert every single message to the chat window
            for (var i = 0; i < json.data.length; i++) {
                addMessage(json.data[i].author, json.data[i].text, json.data[i].color, new Date(json.data[i].time));
            }
        } else if (json.type === 'message') {
            // it's a single message
            input.disabled; // let the user write another message
            addMessage(json.data.author, json.data.text, json.data.color, new Date(json.data.time));
        } else {
            console.log('Hmm..., I\'ve never seen JSON like this: ', json);
        }
    };

    /**
     * Send mesage when user presses Enter key
     */
    input.addEventListener("keydown", function (e) {
        if (e.keyCode === 13) {
            var msg = input.value;
            if (!msg) {
                return;
            }
            // send the message as an ordinary text
            connection.send(msg);
            input.value = "";
            // disable the input field to make the user wait until server
            // sends back response
            input.disabled = false;

            // we know that the first message sent from a user their name
            if (myName === false) {
                myName = msg;
            }
        }
    });

    /**
     * This method is optional. If the server wasn't able to respond to the
     * in 3 seconds then show some error message to notify the user that
     * something is wrong.
     */
    setInterval(function () {
        if (connection.readyState !== 1) {
            status.innerHTML = 'Error';
            input.disabled = true;
            input.value = "Unable to comminucate with the WebSocket server";
        }
    }, 3000);

    /**
     * Add message to the chat window
     */
    function addMessage(author, message, color, dt) {
        content.innerHTML = content.innerHTML + ('<p><span style="color:' + color + '">' + author + '</span> @ ' + +(dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()) + ':' + (dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes()) + ': ' + message + '</p>');
    }
};

init();

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);
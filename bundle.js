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
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__game_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__board_js__ = __webpack_require__(2);




document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameBoard");
  const ctx = canvas.getContext("2d");
  const game = new __WEBPACK_IMPORTED_MODULE_0__game_js__["a" /* default */](ctx, canvas);
  game.start();
});


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__board__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__player__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__bubble__ = __webpack_require__(3);




const colors = ["red", "blue", "green", "yellow", "purple", "white"];

let newBoard = new __WEBPACK_IMPORTED_MODULE_0__board__["a" /* default */]();
newBoard.populate();

class Game {
  constructor(ctx, canv, board = newBoard) {
    this.ctx = ctx;
    this.canv = canv;
    this.board = board;
    this.player = new __WEBPACK_IMPORTED_MODULE_1__player__["a" /* default */]('Ross');
    this.bubble = new __WEBPACK_IMPORTED_MODULE_2__bubble__["a" /* default */](8, 15, 266.4, 680, colors[Math.floor(Math.random()*colors.length)]);
    this.handleMove = this.handleMove.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleMove(e) {
    let mousePos = this.getMousePos(this.canv, e);
    let mouseAngle = this.radiansToDegrees(Math.atan2((this.player.y) - mousePos.y, mousePos.x - (this.player.x)));

    if (mouseAngle < 0) {
        mouseAngle = 180 + (180 + mouseangle);
    }

    let lbound = 8;
    let ubound = 172;

    if (mouseAngle > 90 && mouseAngle < 270) {
      if (mouseAngle > ubound) {
        mouseAngle = ubound;
      }
    } else {
      if (mouseAngle < lbound || mouseAngle >= 270) {
        mouseAngle = lbound;
      }
    }

    this.player.angle = mouseAngle;
  }

  start() {
    this.canv.addEventListener('mousemove', this.handleMove);
    this.canv.addEventListener('mousedown', this.handleClick);
    requestAnimationFrame(this.animate.bind(this));
  }

  renderBubbles() {
    this.board.grid.forEach(row => {
      row.forEach(bubble => {
        if (bubble.canX) {
          bubble.draw(this.ctx);
        }
      });
    });
  }

  radiansToDegrees(angle) {
    return angle * (180 / Math.PI);
  }

  degreesToRadians(angle) {
    return angle * (Math.PI / 180);
  }

  getMousePos(canv, e) {
    let rect = canv.getBoundingClientRect();
    return {
      x: Math.round((e.clientX - rect.left) / (rect.right - rect.left) * canv.width),
      y: Math.round((e.clientY - rect.top) / (rect.bottom - rect.top) * canv.height)
    };
  }

  renderPlayerAngle(ctx) {
    ctx.lineWidth = 2;
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(this.player.x, this.player.y);
    ctx.lineTo(this.player.x + 1.5 * 100 * Math.cos(this.degreesToRadians(this.player.angle)),
              this.player.y - 1.5 * 100 * Math.sin(this.degreesToRadians(this.player.angle)));
    ctx.stroke();
  }

  animate() {
    this.ctx.clearRect(0, 0, 550, 700);
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, 1000, 1000);
    this.renderBubbles();
    this.player.draw(this.ctx);
    this.bubble.draw(this.ctx);
    this.renderPlayerAngle(this.ctx);
    requestAnimationFrame(this.animate.bind(this));
  }

  handleClick(e) {
    this.shootBubble(40);
  }

  shootBubble(delta) {
    let bubble = this.bubble;
    if (bubble.canY === 680) {
      bubble.angle = this.player.angle;
    }
    bubble.canX += delta * Math.cos(this.degreesToRadians(bubble.angle));
    bubble.canY += delta * -1 * Math.sin(this.degreesToRadians(bubble.angle));
    if (bubble.canX >= 500) {
      bubble.angle = Math.abs(180 - bubble.angle);
    } else if (bubble.canX <= 50) {
      bubble.angle = 180 - bubble.angle;
      bubble.x = 500 - 33.3;
    }

  }




}


/* harmony default export */ __webpack_exports__["a"] = (Game);


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bubble_js__ = __webpack_require__(3);

const colors = ["red", "blue", "green", "yellow", "purple", "white"];

class Board {
  constructor() {
    this.grid = [];
  }

  createRow() {
    const row = [];
    let i = 0;
    for(let canX = 33.3; i < 15; canX+=33.3) {
      let color = colors[Math.floor(Math.random()*colors.length)];
      row.push(new __WEBPACK_IMPORTED_MODULE_0__bubble_js__["a" /* default */](i, 0, canX, 33.3, color));
      i++;
    }
    return row;
  }

  shiftRow() {
    this.grid.forEach(row => {
      row.forEach(bubble => {
          bubble.y += 1;
          bubble.canY += 33.3;
          if (bubble.y % 2 !== 0) {
            bubble.canX += 16.65;
          } else if (bubble.y !== 0) {
            bubble.canX -= 16.65;
          }
      });
    });
    this.removeRow();
    return this.grid.unshift(this.createRow());
  }

  removeRow() {
    if (this.grid.length === 15) {
    return this.grid.pop();
    }
  }
  
  populate() {
    this.grid.unshift(this.createRow());
    for(let i = 0; i < 6; i++) {
      this.shiftRow();
    }
    for(let i = 0; i < 8; i++) {
      let emptyRow = [];
      for(let j = 0; j < 15; j++) {
        emptyRow.push([]);
      }
      this.grid.push(emptyRow);
    }
  }

}

/* harmony default export */ __webpack_exports__["a"] = (Board);


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Bubble {

  constructor(x, y, canX, canY, color, angle = 0){
    this.x = x;
    this.y = y;
    this.canX = canX;
    this.canY = canY;
    this.present = true;
    this.color = color;
    this.angle = angle;
    }

  pos() {
    return [this.x, this.y];
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.canX, this.canY, 17, 30, 2*Math.PI, true);
    ctx.fill();
  }

  getScreenPos(row, col) {
    let xPos = col * 33.3;
    if (row % 2 !== 0) {
      xPos += 16.65;
    }

    let yPos = row * 33.3;
    return { xPos: xPos, yPos: yPos };
  }

}

/* harmony default export */ __webpack_exports__["a"] = (Bubble);


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bubble__ = __webpack_require__(3);


const colors = ["red", "blue", "green", "yellow", "purple", "white"];

class Player {
  constructor(name) {
    this.name = name;
    this.score = 0;
    this.x = 266.4;
    this.y = 710;
    this.angle = 0;
    // this.bubble = new Bubble(0, 0, this.x, this.y - 30, colors[Math.floor(Math.random()*colors.length)]);
    this.nextBubble = new __WEBPACK_IMPORTED_MODULE_0__bubble__["a" /* default */](0, 0, 0, 700, colors[Math.floor(Math.random()*colors.length)]);
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 70, 0, 2*Math.PI, true);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.stroke();
  }


}

/* harmony default export */ __webpack_exports__["a"] = (Player);


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map
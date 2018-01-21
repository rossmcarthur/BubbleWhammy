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
    this.player = new __WEBPACK_IMPORTED_MODULE_1__player__["a" /* default */]('Ross', board);
    this.handleMove = this.handleMove.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = 'ready';
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
        if (bubble instanceof Array === false) {
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
    if (this.player.bubble.loaded) {
      this.snapBubble();
    }

    // let bubble = this.player.bubble;
    // let board = this.board.grid;
    // if (bubble.loaded) {
    //   for(let i = 0; i < board.length; i++) {
    //     for(let j = 0; j < board[i].length; j++) {
    //       let gridBubb = board[i][j];
    //       if (gridBubb instanceof Array === false) {
    //         if (gridBubb.pos.yPos + 37 >= bubble.pos.yPos) {
    //           debugger
    //           bubble.gridPos = bubble.getGridPos((bubble.pos.xPos) - 25, bubble.pos.yPos);
    //           board[bubble.gridPos.xGrid][bubble.gridPos.yGrid] = bubble;
    //           bubble.pos = bubble.getScreenPos(bubble.gridPos.yGrid, bubble.gridPos.xGrid);
    //           bubble.loaded = false;
    //           break;
    //         } // change for x after
    //       }
    //     }
    //   }
    // }
    // if (bubble.loaded) {
  //     let board = this.board.grid;
  //     let gridPos = bubble.getGridPos(bubble.pos.xPos, bubble.pos.yPos);
  //     if (board[gridPos.xGrid - 1][gridPos.yGrid] instanceof Array === false) {
  //
  //     board[gridPos.xGrid][gridPos.yGrid] = bubble;
  //
  //     bubble.gridPos = gridPos;
  //     bubble.pos = bubble.getScreenPos(bubble.gridPos.yGrid, bubble.gridPos.xGrid);
  //     bubble.loaded = false;
  //     // debugger
  // }
// }


    this.player.bubble.draw(this.ctx);
    this.renderPlayerAngle(this.ctx);
    requestAnimationFrame(this.animate.bind(this));
  }

  handleClick(e) {
    this.state = "shooting";
    this.player.bubble.loaded = true;
    this.shootBubble();
  }

  shootBubble() {
    let bubble = this.player.bubble;
    if (bubble.pos.yPos === 632.6999999999999) {
      bubble.angle = this.player.angle;
    }
  }

  snapBubble() {
    let bubble = this.player.bubble;
    let board = this.board.grid;
    if (bubble.loaded) {
      for(let i = 0; i < board.length; i++) {
        for(let j = 0; j < board[i].length; j++) {
          let gridBubb = board[i][j];
          if (gridBubb instanceof Array === false) {
            debugger
            if (gridBubb.pos.yPos + 45 >= bubble.pos.yPos && gridBubb.pos.xPos + 45 <= bubble.pos.xPos) {
              bubble.gridPos = bubble.getGridPos((bubble.pos.xPos) - 25, bubble.pos.yPos);
              let test = bubble;
              bubble.pos = bubble.getScreenPos(bubble.gridPos.yGrid, bubble.gridPos.xGrid);
              bubble.loaded = false;
              board[bubble.gridPos.xGrid][bubble.gridPos.yGrid] = test;
              this.player.bubble = new __WEBPACK_IMPORTED_MODULE_2__bubble__["a" /* default */](7, 18, colors[Math.floor(Math.random()*colors.length)], false, {xPos: 266.4, yPos: 632.6999999999999});
              break;
            } // change for x after
          }
        }
      }
    }
//     bubble.center = bubble.pos.yPos / bubble.pos.xPos;
//       for(let i = 0; i < board.length; i++) {
//         for(let j = 0; j < board[i].length; j++) {
//           let gridBubb = board[i][j];
//           if (gridBubb instanceof Array === false) {
//             if (gridBubb.center + 0.06 >= bubble.center) {
//                         bubble.gridPos = bubble.getGridPos((bubble.pos.xPos) - 25, bubble.pos.yPos);
//                         let test = bubble;
//                         bubble.pos = bubble.getScreenPos(bubble.gridPos.yGrid, bubble.gridPos.xGrid);
//                         bubble.loaded = false;
//                         board[bubble.gridPos.xGrid][bubble.gridPos.yGrid] = test;
//                         // this.player.bubble = new Bubble(7, 18, colors[Math.floor(Math.random()*colors.length)], false, {xPos: 266.4, yPos: 632.6999999999999});
//                         break;
//             }
//
// }
// }
// }
// }
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
    for(let i = 0; i < 15; i++) {
      let color = colors[Math.floor(Math.random()*colors.length)];
      let bubble = new __WEBPACK_IMPORTED_MODULE_0__bubble_js__["a" /* default */](i, 0, color);
      bubble.pos = bubble.getScreenPos(bubble.x, bubble.y);
      row.push(bubble);
    }
    return row;
  }

  shiftRow() {
    this.grid.forEach(row => {
      row.forEach(bubble => {
        if (bubble instanceof Array === false) {
          bubble.y += 1;
          bubble.pos = bubble.getScreenPos(bubble.x, bubble.y);
          bubble.center =  bubble.pos.yPos / bubble.pos.xPos;
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
    for(let l = 0; l < 12; l++) {
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
const colors = ["red", "blue", "green", "yellow", "purple", "white"];

class Bubble {
  constructor(x, y, color, loaded = false, pos = {}, angle = 0) {
    this.x = x;
    this.y = y;
    this.pos = pos;
    this.gridPos = {};
    this.present = true;
    this.color = color;
    this.angle = angle;
    this.loaded = loaded;
    this.speed = 10;
    this.center = 0;
    }

    degreesToRadians(angle) {
      return angle * (Math.PI / 180);
    }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    // if (this.loaded === false || this.pos === undefined) {
    //   this.pos = this.getScreenPos(this.x, this.y);
    // }
    if (this.loaded) {
      this.pos.xPos += this.speed * Math.cos(this.degreesToRadians(this.angle));
      this.pos.yPos += this.speed * -1 * Math.sin(this.degreesToRadians(this.angle));
      if (this.pos.xPos >= 500) {
        this.angle = Math.abs(180 - this.angle);
      } else if (this.pos.xPos <= 50) {
        this.angle = 180 - this.angle;
      }

    }
    ctx.arc(this.pos.xPos, this.pos.yPos, 17, 30, 2*Math.PI, true);
    ctx.fill();
  }


// FIX THIS!!

  getGridPos(xPos, yPos) {
    let yGrid = Math.floor(yPos / 33.3);
    let offset = 0;
    if (yPos % 66.6 === 0) {
      offset = 16.65;
    }
    let xGrid = Math.floor((xPos - offset) / 33.3);
    return { xGrid: yGrid - 1, yGrid: xGrid };
  }

  getScreenPos(col, row) {
    let xPos;
    if (col === 0) {
      xPos = 33.3;
    } else {
        xPos = (col * 33.3) + 33.3;
    }
    if (row % 2 !== 0) {
      xPos += 16.65;
    }

    let yPos;
    if (row === 0) {
      yPos = 33.3;
    } else {
        yPos = (row * 33.3) + 33.3;
    }

  //   let xPos = (col + 1) * 33.3;
  //
  //   if ((row + 16.65) % 2 === 0) {
  //     xPos += 16.65;
  //   }
  //
  //   let yPos = row + 33.3;
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
  constructor(name, board) {
    this.name = name;
    this.board = board;
    this.score = 0;
    this.x = 266.4;
    this.y = 675;
    this.angle = 0;
    this.bubble = new __WEBPACK_IMPORTED_MODULE_0__bubble__["a" /* default */](7, 18, colors[Math.floor(Math.random()*colors.length)], false, {xPos: 266.4, yPos: 632.6999999999999});
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
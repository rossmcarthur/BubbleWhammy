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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const colors = ["red", "blue", "green", "yellow", "purple", "white"];

class Bubble {
  constructor(x, y, color = null, loaded = false, pos = {}, state = "empty", angle = 0) {
    this.x = x;
    this.y = y;
    this.pos = pos;
    this.gridPos = {};
    this.color = color;
    this.angle = angle;
    this.loaded = loaded;
    this.speed = 20;
    this.state = state;
    this.shifted = false;
    }

    degreesToRadians(angle) {
      return angle * (Math.PI / 180);
    }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    if (this.loaded === false) {
      this.pos = this.getScreenPos(this, this.x, this.y);
      this.gridPos = this.getGridPos(this, this.pos.x, this.pos.y);
    }
    if (this.loaded) {
      this.pos.x += this.speed * Math.cos(this.degreesToRadians(this.angle));
      this.pos.y += this.speed * -1 * Math.sin(this.degreesToRadians(this.angle));
        if (this.pos.x >= 515) {
          this.angle = Math.abs(180 - this.angle);
        } else if (this.pos.x <= 35) {
          this.angle = 180 - this.angle;
        } else if (this.pos.y <= 5) {
          this.pos.y = 0;
          this.gridPos = this.getGridPos(this, this.pos.x, this.pos.y);
        }
    }
    ctx.arc(this.pos.x, this.pos.y, 17, 30, 2*Math.PI, true);
    if (this.state === "full"){
      ctx.fill();
    }
}

  getGridPos(bubble, xPos, yPos) {
    let y = Math.floor(yPos / 33.3);
    let offset = 0;
    if (bubble.shifted) {
      offset = 16.65;
    }
    let x = Math.floor((xPos - offset) / 33.3);
    return { x: x - 1, y: y - 1 };
  }

  getScreenPos(bubble, col, row) {
    let x;
    if (col === 0) {
      x = 33.3;
    } else {
        x = (col * 33.3) + 33.3;
    }
    if (bubble.shifted) {
      x += 16.65;
    }
    let y;
    if (row === 0) {
      y = 33.3;
    } else {
        y = (row * 33.3) + 33.3;
    }
    return { x: x, y: y};
  }

}

/* harmony default export */ __webpack_exports__["a"] = (Bubble);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bubble__ = __webpack_require__(0);

const colors = ["red", "blue", "green", "yellow", "purple", "white"];

class Board {
  constructor() {
    this.grid = [];
  }

  createRow() {
    const row = [];
    for(let i = 0; i < 15; i++) {
      let color = colors[Math.floor(Math.random()*colors.length)];
      let bubble = new __WEBPACK_IMPORTED_MODULE_0__bubble__["a" /* default */](i, 0, color);
      bubble.pos = bubble.getScreenPos(bubble, bubble.x, bubble.y);
      bubble.state = "full";
      if (this.grid.length < 1 || this.grid[0][0].shifted) {
        bubble.shifted = false;
      } else {
        bubble.shifted = true;
      }
      row.push(bubble);
    }
    return row;
  }

  shiftRow() {
    this.grid.forEach(row => {
      row.forEach(bubble => {
          bubble.y += 1;
          bubble.pos = bubble.getScreenPos(bubble, bubble.x, bubble.y);
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
    for(let l = 7; l < 18; l++) {
      let emptyRow = [];
      for(let j = 0; j < 15; j++) {
        let bubble = new __WEBPACK_IMPORTED_MODULE_0__bubble__["a" /* default */](j, l);
        bubble.pos = bubble.getScreenPos(bubble, bubble.x, bubble.y);
        if (!this.grid[bubble.y - 1][bubble.x].shifted) {
          bubble.shifted = true;
        }
        emptyRow.push(bubble);
      }
      this.grid.push(emptyRow);
    }
  }

}

/* harmony default export */ __webpack_exports__["a"] = (Board);


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__game_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__board_js__ = __webpack_require__(1);




document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameBoard");
  const ctx = canvas.getContext("2d");
  const game = new __WEBPACK_IMPORTED_MODULE_0__game_js__["a" /* default */](ctx, canvas);
  game.start();
});


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__board__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__player__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__bubble__ = __webpack_require__(0);




const colors = ["red", "blue", "green", "yellow", "purple", "white"];

let newBoard = new __WEBPACK_IMPORTED_MODULE_0__board__["a" /* default */]();
newBoard.populate();

class Game {
  constructor(ctx, canv, board = newBoard) {
    this.ctx = ctx;
    this.canv = canv;
    this.board = board;
    this.player = new __WEBPACK_IMPORTED_MODULE_1__player__["a" /* default */](board);
    this.handleMove = this.handleMove.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleGameOver = this.handleGameOver.bind(this);
    this.state = 'ready';
    this.turns = 0;
    this.score = 0;
  }

  handleMove(e) {
    const mousePos = this.getMousePos(this.canv, e);
    let mouseAngle = this.radiansToDegrees(Math.atan2((this.player.y) - mousePos.y, mousePos.x - (this.player.x)));
    if (mouseAngle < 0) {
      mouseAngle = 180 + (180 + mouseangle);
    }
    let lbound = 20;
    let ubound = 160;
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

  handleGameOver(e) {
    if (this.state === 'gameover') {
      this.state = 'ready';
      this.turns = 0;
      this.score = 0;
      this.board = new __WEBPACK_IMPORTED_MODULE_0__board__["a" /* default */]();
      this.board.populate();
      this.player.board = this.board;
    }
  }

  start() {
    this.canv.addEventListener('mousemove', this.handleMove);
    this.canv.addEventListener('mousedown', this.handleClick);
    this.canv.addEventListener('mousedown', this.handleGameOver);
    requestAnimationFrame(this.animate.bind(this));
  }

  renderBubbles() {
    this.board.grid.forEach(row => {
      row.forEach(bubble => {
          bubble.draw(this.ctx);
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
    ctx.moveTo(265, 625);
    ctx.lineTo(this.player.x + 100 * Math.cos(this.degreesToRadians(this.player.angle)),
              this.player.y - 130 * Math.sin(this.degreesToRadians(this.player.angle)));
    ctx.stroke();
  }

  animate() {
    this.ctx.clearRect(0, 0, 550, 700);
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, 550, 700);
    if (this.turns < 50 && this.turns > 0) {
      if (this.turns % 10 === 0) {
        this.board.shiftRow();
        this.turns = 0;
      }
    }
    this.ctx.font = "17px Arial";
    this.ctx.fillStyle = "white";
    this.ctx.fillText(`Score: ${this.score}`, 440, 650);
    this.renderBubbles();
    this.player.draw(this.ctx);
    let bubble = this.player.bubble;
    const board = this.player.board.grid;
    this.renderPlayerAngle(this.ctx);
    this.player.bubble.draw(this.ctx);
    this.player.nextBubble.draw(this.ctx);
    const cols = this.detectCollision(bubble, board);
    if (cols.length >= 1) {
      const closestCollision = this.findClosestCollision(cols);
      const freeSpace = this.findFreeSpace(board, closestCollision);
      this.findClosestSpace(bubble, board, freeSpace);
      board[0].forEach(bubble => {
      this.findFloaters(bubble, board);
      });
    }
    if (this.gameOver()) {
      const gameover = new Image();
      gameover.src = './assets/gameover.png';
      this.ctx.beginPath();
      this.ctx.rect(0, 0, 550, 700);
      this.ctx.fillStyle = 'rgba(0, 0, 0, .7)';
      this.ctx.fill();
      this.ctx.closePath();
      this.ctx.drawImage(gameover, 170, 100, 200, 200);
      this.ctx.fillStyle = "white";
      this.ctx.fillText("Click to restart game...", 180, 500 );
    }
    requestAnimationFrame(this.animate.bind(this));
  }

  handleClick(e) {
    if (this.state === 'ready') {
      this.state = 'shooting';
      this.player.bubble.loaded = true;
      this.setAngle();
      this.state = 'ready';
    }
  }

  setAngle() {
    let bubble = this.player.bubble;
    if (bubble.pos.y === 632.6999999999999) {
      bubble.angle = this.player.angle;
    }
  }

  snapBubble() {
    let bubble = this.player.bubble;
    let board = this.board.grid;
    let collisions = this.detectCollision(bubble, board);
    let closestCollision = this.findClosestCollision(collisions);
    let freeSpace = this.findFreeSpace(board, closestCollision);
    this.findClosestSpace(bubble, freeSpace);
}

  detectCollision(bubble, board) {
  let collisions = [];
    if (bubble.loaded) {
      for(let i = 0; i < board.length; i++) {
        let row = board[i];
        for(let j = 0; j < row.length; j++) {
          let gridBubble = board[i][j];
          if (gridBubble.state === "full") {
            if (bubble.pos.y > gridBubble.pos.y && gridBubble.pos.y + 35 >= bubble.pos.y) {
              if (gridBubble.pos.x >= bubble.pos.x) {
                if (gridBubble.pos.x - 35 <= bubble.pos.x) {
                  collisions.push({
                    bubble: gridBubble,
                    xDist: gridBubble.pos.x - bubble.pos.x,
                    yDist: gridBubble.pos.y - bubble.pos.y,
                    xAbs: Math.abs(gridBubble.pos.x - bubble.pos.x)
                  });
                }
              } else {
                  if (gridBubble.pos.x + 35 >= bubble.pos.x) {
                    collisions.push({
                      bubble: gridBubble,
                      xDist: gridBubble.pos.x - bubble.pos.x,
                      yDist: gridBubble.pos.y - bubble.pos.y,
                      xAbs: Math.abs(gridBubble.pos.x - bubble.pos.x)
                    });
                  }
                }
              }

          }
        }
      }
    }
    if (bubble.pos.y <= 5) {
      if (this.turns % 2 === 0) {
        bubble.shifted = true;
      }
      collisions.push({
        bubble: bubble,
        xAbs: bubble.pos.x
      });
    }
    return collisions;
  }

  findClosestCollision(collisions) {
    let closestBubble = null;
    let distance = null;
    for(let i = 0; i < collisions.length; i++) {
      const colBubble = collisions[i];
      if (closestBubble === null || colBubble.xAbs < distance) {
        closestBubble = colBubble;
        distance = colBubble.xAbs;
      }
    }
    let collisionBubble =  {
      closest: closestBubble,
      distance: distance
    };
    return collisionBubble;
  }

  findFreeSpace(board, collisionBubble) {
    let freeSpace = [];
    if (collisionBubble.closest.bubble.pos.y <= 5) {
      collisionBubble.closest.bubble.x = collisionBubble.closest.bubble.gridPos.x;
      collisionBubble.closest.bubble.y = collisionBubble.closest.bubble.gridPos.y + 1;
      freeSpace.push(board[collisionBubble.closest.bubble.gridPos.y + 1][collisionBubble.closest.bubble.x]);
    } else {
      if (!collisionBubble.closest.bubble.shifted) {
        if(board[collisionBubble.closest.bubble.y + 1][collisionBubble.closest.bubble.x - 1] !== undefined &&
          board[collisionBubble.closest.bubble.y + 1][collisionBubble.closest.bubble.x - 1].state === "empty") {
          freeSpace.push(board[collisionBubble.closest.bubble.y + 1][collisionBubble.closest.bubble.x - 1]);
        }
      }
       if (collisionBubble.closest.bubble.shifted){
        if(board[collisionBubble.closest.bubble.y + 1][collisionBubble.closest.bubble.x + 1] !== undefined &&
          board[collisionBubble.closest.bubble.y + 1][collisionBubble.closest.bubble.x + 1].state === "empty"){
          freeSpace.push(board[collisionBubble.closest.bubble.y + 1][collisionBubble.closest.bubble.x + 1]);
        }
      }
      if (board[collisionBubble.closest.bubble.y][collisionBubble.closest.bubble.x - 1] !== undefined &&
        board[collisionBubble.closest.bubble.y][collisionBubble.closest.bubble.x - 1].state === "empty") {
        freeSpace.push(board[collisionBubble.closest.bubble.y][collisionBubble.closest.bubble.x - 1]);
      }
      if (board[collisionBubble.closest.bubble.y][collisionBubble.closest.bubble.x + 1] !== undefined &&
        board[collisionBubble.closest.bubble.y][collisionBubble.closest.bubble.x + 1].state === "empty") {
        freeSpace.push(board[collisionBubble.closest.bubble.y][collisionBubble.closest.bubble.x + 1]);
      }
      if (board[collisionBubble.closest.bubble.y + 1][collisionBubble.closest.bubble.x] !== undefined &&
        board[collisionBubble.closest.bubble.y + 1][collisionBubble.closest.bubble.x].state === "empty") {
        freeSpace.push(board[collisionBubble.closest.bubble.y + 1][collisionBubble.closest.bubble.x]);
      }
    }
  return freeSpace;
  }

  gameOver() {
    for(let i = 0; i < 15; i++) {
      if (this.board.grid[17][i].state === "full") {
        this.state = 'gameover';
        return true;
      }
    }
    return false;
  }

  findClosestSpace(bubble, board, freeSpace) {
    let closest = null;
    let distance = null;
    freeSpace.forEach(space => {
      const dist = Math.abs((space.pos.x) - (bubble.pos.x));
      if (closest === null || dist < distance) {
        closest = space;
        distance = dist;
      }
    });
    if(closest) {
    board[closest.y][closest.x] = bubble;
    bubble.x = closest.x;
      if (closest.y > 0 && board[closest.y - 1][closest.x].shifted === false) {
        bubble.shifted = true;
      }
    bubble.gridPos.x = closest.x;
    bubble.y = closest.y;
    bubble.gridPos.y = closest.y;
    this.clusters(bubble);
    bubble.loaded = false;
    let nextBubble = this.player.nextBubble;
    nextBubble.x = 7;
    this.player.bubble = nextBubble;
    this.player.nextBubble = new __WEBPACK_IMPORTED_MODULE_2__bubble__["a" /* default */](5, 18, colors[Math.floor(Math.random()*colors.length)], false, {}, "full");
    this.turns += 1;
    }
  }

  findNeighbors(bubble, board) {
    let neighbors = [];
      if (bubble.x === 0 && bubble.y === 0) {
        if(bubble.shifted) {
          if(board[bubble.y + 1][bubble.x + 1].state === "full") {
            neighbors.push(board[bubble.y + 1][bubble.x + 1]);
          }
        }
          if(board[bubble.y][bubble.x + 1].state === "full") {
            neighbors.push(board[bubble.y][bubble.x + 1]);
          }
      } else if (bubble.x === 14 && bubble.y === 0) {
        if (!bubble.shifted) {
          if(board[bubble.y + 1][bubble.x - 1].state === "full") {
            neighbors.push(board[bubble.y + 1][bubble.x - 1]);
          }
        }
          if(board[bubble.y][bubble.x - 1].state === "full") {
            neighbors.push(board[bubble.y][bubble.x - 1]);
          }
      } else if (bubble.y === 0) {
        if (bubble.shifted) {
          if(board[bubble.y + 1][bubble.x + 1].state === "full") {
            neighbors.push(board[bubble.y + 1][bubble.x + 1]);
          }
        } else {
            if(board[bubble.y + 1][bubble.x - 1].state === "full") {
              neighbors.push(board[bubble.y + 1][bubble.x - 1]);
            }
          }
          if(board[bubble.y][bubble.x + 1].state === "full") {
            neighbors.push(board[bubble.y][bubble.x + 1]);
          }
          if(board[bubble.y][bubble.x - 1].state === "full") {
            neighbors.push(board[bubble.y][bubble.x - 1]);
          }
      } else if (bubble.x === 0) {
        if (bubble.shifted) {
          if (board[bubble.y - 1][bubble.x + 1].state === "full") {
            neighbors.push(board[bubble.y - 1][bubble.x + 1]);
          }
          if(board[bubble.y + 1][bubble.x + 1].state === "full") {
                neighbors.push(board[bubble.y + 1][bubble.x + 1]);
          }
        }
        if (board[bubble.y - 1][bubble.x].state === "full") {
          neighbors.push(board[bubble.y - 1][bubble.x]);
        }
        if(board[bubble.y][bubble.x + 1].state === "full") {
          neighbors.push(board[bubble.y][bubble.x + 1]);
        }
      } else if (bubble.x === 14) {
        if (!bubble.shifted) {
          if(board[bubble.y + 1][bubble.x - 1].state === "full") {
            neighbors.push(board[bubble.y + 1][bubble.x - 1]);
          }
          if (board[bubble.y - 1][bubble.x - 1].state === "full") {
            neighbors.push(board[bubble.y - 1][bubble.x - 1]);
          }
        }
          if (board[bubble.y - 1][bubble.x].state === "full") {
            neighbors.push(board[bubble.y - 1][bubble.x]);
          }
          if(board[bubble.y][bubble.x - 1].state === "full") {
            neighbors.push(board[bubble.y][bubble.x - 1]);
          }
      } else {
          if (bubble.shifted) {
            if (board[bubble.y - 1][bubble.x] !== undefined && board[bubble.y - 1][bubble.x].state === "full") {
              neighbors.push(board[bubble.y - 1][bubble.x]);
            }
            if (board[bubble.y - 1][bubble.x + 1] !== undefined && board[bubble.y - 1][bubble.x + 1].state === "full") {
              neighbors.push(board[bubble.y - 1][bubble.x + 1]);
            }
            if(board[bubble.y][bubble.x + 1] !== undefined && board[bubble.y][bubble.x + 1].state === "full") {
              neighbors.push(board[bubble.y][bubble.x + 1]);
            }
            if(board[bubble.y][bubble.x - 1] !== undefined && board[bubble.y][bubble.x - 1].state === "full") {
              neighbors.push(board[bubble.y][bubble.x - 1]);
            }
            if(board[bubble.y + 1][bubble.x + 1] !== undefined && board[bubble.y + 1][bubble.x + 1].state === "full") {
              neighbors.push(board[bubble.y + 1][bubble.x + 1]);
            }
        } else {
          if (board[bubble.y - 1][bubble.x - 1] !== undefined && board[bubble.y - 1][bubble.x - 1].state === "full") {
            neighbors.push(board[bubble.y - 1][bubble.x - 1]);
          }
          if (board[bubble.y - 1][bubble.x] !== undefined && board[bubble.y - 1][bubble.x].state === "full") {
            neighbors.push(board[bubble.y - 1][bubble.x]);
          }
          if(board[bubble.y][bubble.x - 1] !== undefined && board[bubble.y][bubble.x - 1].state === "full") {
            neighbors.push(board[bubble.y][bubble.x - 1]);
          }
          if(board[bubble.y][bubble.x + 1] !== undefined && board[bubble.y][bubble.x + 1].state === "full") {
            neighbors.push(board[bubble.y][bubble.x + 1]);
          }
          if(board[bubble.y + 1][bubble.x - 1] !== undefined && board[bubble.y + 1][bubble.x - 1].state === "full") {
            neighbors.push(board[bubble.y + 1][bubble.x - 1]);
          }
        }
      }
    if(board[bubble.y + 1][bubble.x] !== undefined && board[bubble.y + 1][bubble.x].state === "full") {
      neighbors.push(board[bubble.y + 1][bubble.x]);
    }
    return neighbors;
  }

  clusters(bubble) {
    const snap = new Audio("./assets/snap.mp3");
    const pop = new Audio("./assets/pop.mp3");
    const color = bubble.color;
    let checked = [];
    let queue = [bubble];
    while (queue.length >= 1) {
      let current = queue.shift();
      let children = this.findNeighbors(current, this.board.grid);
      children.forEach(child => {
      if (child.color === color){
          if (!queue.includes(child) && !checked.includes(child)) {
            queue.push(child);
          }
        }
      });
      if (!checked.includes(current)) {
        checked.push(current);
      }
    }
    if (checked.length >= 3) {
      pop.play();
      checked.forEach(bubble => {
        this.score += 200;
        bubble.color = null;
        bubble.state = "empty";
      });
    } else {
        snap.play();
    }
  }

  bfsNeighbors(bubble, board) {
    let neighbors = [];
    const n1 = board[bubble.y + 1][bubble.x];
    const n2 = board[bubble.y + 1][bubble.x + 1];
    const n3 = board[bubble.y + 1][bubble.x - 1];
    const n4 = board[bubble.y][bubble.x + 1];
    const n5 = board[bubble.y][bubble.x - 1];
    if (bubble.state === "full") {
      if (bubble.shifted) {
        if (bubble.x < 14) {
          if (n2.state === "full") {
            neighbors.push(n2);
          }
          if (n4.state === "full") {
            neighbors.push(n4);
          }
        }
      } else {
          if (bubble.x > 0) {
            if (n3.state === "full") {
              neighbors.push(n3);
          }
          if (n5.state === "full") {
            neighbors.push(n5);
          }
        }
      }
      if (n1.state === "full") {
        neighbors.push(n1);
      }
    }
    return neighbors;
  }

  won(){
    this.board.grid.forEach(row => {
      row.every(node => {
        return node.state === "empty";
      });
    });
  }

  findFloaters(bubble, board) {
    const top = board[0];
    let checked = [];
    top.forEach( bubble => {
      let queue = [bubble];
      while(queue.length > 0) {
        const current = queue.shift();
        checked.push(current);
        let children;
        if (top.includes(current)) {
          children = this.bfsNeighbors(current, board);
        } else {
          children = this.findNeighbors(current, board);
        }
        children.forEach(child => {
          if (!queue.includes(child) && !checked.includes(child))
          queue.push(child);
          checked.push(child);
        });
      }
    });
    board.forEach(row => {
      row.forEach(bubble => {
        if (!checked.includes(bubble)) {
        bubble.color = null;
        bubble.state = "empty";
        }
      });
    });
    return checked;
  }

}


/* harmony default export */ __webpack_exports__["a"] = (Game);


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bubble__ = __webpack_require__(0);


const colors = ["red", "blue", "green", "yellow", "purple", "white"];

class Player {
  constructor(board) {
    this.name = name;
    this.board = board;
    this.score = 0;
    this.x = 266.4;
    this.y = 675;
    this.angle = 90;
    this.bubble = new __WEBPACK_IMPORTED_MODULE_0__bubble__["a" /* default */](7, 18, colors[Math.floor(Math.random()*colors.length)], false, {xPos: 266.4, yPos: 632.6999999999999}, "full");
    this.nextBubble = new __WEBPACK_IMPORTED_MODULE_0__bubble__["a" /* default */](5, 18, colors[Math.floor(Math.random()*colors.length)], false, {}, "full");
    this.score = 0;
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
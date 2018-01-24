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
    this.player = new __WEBPACK_IMPORTED_MODULE_1__player__["a" /* default */]('Ross', board);
    this.handleMove = this.handleMove.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = 'ready';
    this.turns = 0;
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
    ctx.moveTo(this.player.x, this.player.y);
    ctx.lineTo(this.player.x + 1.5 * 100 * Math.cos(this.degreesToRadians(this.player.angle)),
              this.player.y - 1.5 * 100 * Math.sin(this.degreesToRadians(this.player.angle)));
    ctx.stroke();
  }

  animate() {
    this.ctx.clearRect(0, 0, 550, 700);
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, 1000, 1000);
    if (this.turns < 50 && this.turns > 0) {
      if (this.turns % 10 === 0) {
        this.board.shiftRow();
        this.turns = 0;
      }
    }
    this.renderBubbles();
    this.player.draw(this.ctx);

    let bubble = this.player.bubble;
    let board = this.player.board.grid;
    this.player.bubble.draw(this.ctx);
    this.player.nextBubble.draw(this.ctx);
    let cols = this.detectCollision(bubble, board);
    if (cols.length >= 1) {
      let closestCollision = this.findClosestCollision(cols);
      let freeSpace = this.findFreeSpace(board, closestCollision);
      this.findClosestSpace(bubble, board, freeSpace);
    }
    // let floaters = [];
    // board[0].forEach( bubble => {
    //   floaters.concat(this.findFloaters(bubble, board));
    // });
    // board.forEach(bubble => {
    //   if (!floaters.includes(bubble)) {
    //     bubble.color = null;
    //     bubble.state = "empty";
    //   }
    // });

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
              if (gridBubble.pos.x - 30 <= bubble.pos.x) {
                collisions.push({
                  bubble: gridBubble,
                  xDist: gridBubble.pos.x - bubble.pos.x,
                  yDist: gridBubble.pos.y - bubble.pos.y,
                  xAbs: Math.abs(gridBubble.pos.x - bubble.pos.x)
                });
              }
            } else {
                if (gridBubble.pos.x + 30 >= bubble.pos.x) {
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
  return collisions;
}

findClosestCollision(collisions) {
  let closestBubble = null;
  let distance = null;
  for(let i = 0; i < collisions.length; i++) {
    let colBubble = collisions[i];
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
  if (board[collisionBubble.closest.bubble.gridPos.y][collisionBubble.closest.bubble.gridPos.x - 1] !== undefined &&
    board[collisionBubble.closest.bubble.gridPos.y][collisionBubble.closest.bubble.gridPos.x - 1].state === "empty") {
    freeSpace.push(board[collisionBubble.closest.bubble.gridPos.y][collisionBubble.closest.bubble.gridPos.x - 1]);
  }
  if (board[collisionBubble.closest.bubble.gridPos.y][collisionBubble.closest.bubble.gridPos.x + 1] !== undefined &&
    board[collisionBubble.closest.bubble.gridPos.y][collisionBubble.closest.bubble.gridPos.x + 1].state === "empty") {
    freeSpace.push(board[collisionBubble.closest.bubble.gridPos.y][collisionBubble.closest.bubble.gridPos.x + 1]);
  }
  if (board[collisionBubble.closest.bubble.gridPos.y + 1][collisionBubble.closest.bubble.gridPos.x] !== undefined &&
    board[collisionBubble.closest.bubble.gridPos.y + 1][collisionBubble.closest.bubble.gridPos.x].state === "empty") {
    freeSpace.push(board[collisionBubble.closest.bubble.gridPos.y + 1][collisionBubble.closest.bubble.gridPos.x]);
  }
  if(board[collisionBubble.closest.bubble.gridPos.y + 1][collisionBubble.closest.bubble.gridPos.x + 1] !== undefined &&
    board[collisionBubble.closest.bubble.gridPos.y + 1][collisionBubble.closest.bubble.gridPos.x + 1].state === "empty"){
    freeSpace.push(board[collisionBubble.closest.bubble.gridPos.y + 1][collisionBubble.closest.bubble.gridPos.x + 1]);
  }
  if(board[collisionBubble.closest.bubble.gridPos.y + 1][collisionBubble.closest.bubble.gridPos.x - 1] !== undefined &&
    board[collisionBubble.closest.bubble.gridPos.y + 1][collisionBubble.closest.bubble.gridPos.x - 1].state === "empty") {
    freeSpace.push(board[collisionBubble.closest.bubble.gridPos.y + 1][collisionBubble.closest.bubble.gridPos.x - 1]);
  }
return freeSpace;
}

findClosestSpace(bubble, board, freeSpace) {
  let closest = null;
  let distance = null;
  freeSpace.forEach(space => {
    let dist = Math.abs((space.pos.x) - bubble.pos.x);
    if (closest === null || dist < distance) {
      closest = space;
      distance = dist;
    }
  });
  board[closest.y][closest.x] = bubble;
  bubble.x = closest.x;
  if (board[closest.y - 1][closest.x].shifted === false) { // CHANGE TO ACCOUNT FOR BUBBLES WITH NONE ABOVE
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

findNeighbors(bubble, board) {
  let neighbors = [];
  const n1 = board[bubble.y - 1][bubble.x];
  const n2 = board[bubble.y - 1][bubble.x + 1];
  const n3 = board[bubble.y][bubble.x + 1];
  const n4 = board[bubble.y][bubble.x - 1];
  const n5 = board[bubble.y + 1][bubble.x];
  const n6 = board[bubble.y + 1][bubble.x + 1];
  const n7 = board[bubble.y - 1][bubble.x - 1];
  const n8 = board[bubble.y + 1][bubble.x - 1];

    if (bubble.shifted) {
      if (n1 !== undefined && n1.state === "full") {
        neighbors.push(n1);
      }
      if (n2 !== undefined && n2.state === "full") {
        neighbors.push(n2);
      }
      if(n3 !== undefined && n3.state === "full") {
        neighbors.push(n3);
      }
      if(n4 !== undefined && n4.state === "full") {
        neighbors.push(n4);
      }
      if(n5 !== undefined && n5.state === "full") {
        neighbors.push(n5);
      }
      if(n6 !== undefined && n6.state === "full") {
        neighbors.push(n6);
      }
  } else {
    if (n7 !== undefined && n7.state === "full") {
      neighbors.push(n7);
    }
    if (n1 !== undefined && n1.state === "full") {
      neighbors.push(n1);
    }
    if(n4 !== undefined && n4.state === "full") {
      neighbors.push(n4);
    }
    if(n3 !== undefined && n3.state === "full") {
      neighbors.push(n3);
    }
    if(n5 !== undefined && n5.state === "full") {
      neighbors.push(n5);
    }
    if(n8 !== undefined && n8.state === "full") {
      neighbors.push(n8);
    }
  }
  return neighbors;
}

clusters(bubble) {
  let color = bubble.color;
  let checked = [];
  let queue = [bubble];
  let lone = [];
  while (queue.length >= 1) {
    let current = queue.shift();
    let children = this.findNeighbors(current, this.board.grid);
    children.forEach(child => {
    //   if (child.color !== color) {
    //
    //   let parents = this.findNeighbors(child, this.board.grid);
    //
    //   let same = true;
    //   parents.forEach(parent => {
    //     if (parent.color !== color) {
    //       same = false;
    //     }
    //   });
    //   if (same) {
    //     lone.push(child);
    //   }
    // } else if
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
    checked.forEach(bubble => {
      bubble.color = null;
      bubble.state = "empty";
    });
  }
  // lone.forEach(bubble => {
  //   bubble.color = null;
  //   bubble.state = "empty";
  // });
}

bfsNeighbors(bubble, board) {
  let neighbors = [];
  const n1 = board[bubble.y + 1][bubble.x];
  const n2 = board[bubble.y + 1][bubble.x + 1];
  const n3 = board[bubble.y + 1][bubble.x - 1];

  if (bubble.shifted) {
    if (n2.state === "full") {
      neighbors.push(n1);
    }
  } else {
    if (n3.state === "full") {
      neighbors.push(n2);
    }
  }

  if (n1.state === "full") {
    neighbors.push(n1);
  }
}

won(){
  this.board.grid.forEach(row => {
    row.every(node => {
      return node.state === "empty";
    });
  });
}

gameOver() {
  this.board.grid[17].some(node => {
    return node.state === "full";
  });
}

findFloaters(bubble, board) {
  let checked = [];
  let queue = [bubble];
  while(queue.length >= 1) {
    let current = queue.shift();
    let children = this.findNeighbors(current, board);
    children.forEach(child => {
      if (!queue.includes(child) && !checked.includes(child))
      queue.push(child);
    });
    if (!checked.includes(current));
    checked.push(current);
  }
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
  constructor(name, board) {
    this.name = name;
    this.board = board;
    this.score = 0;
    this.x = 266.4;
    this.y = 675;
    this.angle = 0;
    this.bubble = new __WEBPACK_IMPORTED_MODULE_0__bubble__["a" /* default */](7, 18, colors[Math.floor(Math.random()*colors.length)], false, {xPos: 266.4, yPos: 632.6999999999999}, "full");
    this.nextBubble = new __WEBPACK_IMPORTED_MODULE_0__bubble__["a" /* default */](5, 18, colors[Math.floor(Math.random()*colors.length)], false, {}, "full");
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
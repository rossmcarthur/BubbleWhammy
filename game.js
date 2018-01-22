import Board from './board';
import Player from './player';
import Bubble from './bubble';

const colors = ["red", "blue", "green", "yellow", "purple", "white"];

let newBoard = new Board();
newBoard.populate();

class Game {
  constructor(ctx, canv, board = newBoard) {
    this.ctx = ctx;
    this.canv = canv;
    this.board = board;
    this.player = new Player('Ross', board);
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

    let bubble = this.player.bubble;
    let board = this.player.board.grid;
    this.player.bubble.draw(this.ctx);
    let cols = this.detectCollision(bubble, board);
    if (cols.length >= 1) {
      let closestCollision = this.findClosestCollision(cols);
      let freeSpace = this.findFreeSpace(board, closestCollision);
      this.findClosestSpace(bubble, board, freeSpace);
    }

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
    let dist = Math.abs(space.pos.x - bubble.pos.x);
    if (closest === null || dist < distance) {
      closest = space;
      distance = dist;
    }
  });
  board[closest.y][closest.x] = bubble;
  bubble.x = closest.x;
  bubble.gridPos.x = closest.x;
  bubble.y = closest.y;
  bubble.gridPos.y = closest.y;
  bubble.loaded = false;
  this.player.bubble = new Bubble(7, 18, colors[Math.floor(Math.random()*colors.length)], false, {xPos: 266.4, yPos: 632.6999999999999}, "full");
  this.clusters(bubble);
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

    if (bubble.y % 2 !== 0) {
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
    if(n6 !== undefined && n6.state === "full") {
      neighbors.push(n6);
    }
  }
  debugger
  return neighbors;
}

clusters(bubble) {
  let color = bubble.color;
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
    checked.forEach(bubble => {
      bubble.color = null;
      bubble.state = "empty";
    });
  }
}

}



export default Game;

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
    this.player = new Player(board);
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
      this.board = new Board();
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
    this.player.nextBubble = new Bubble(5, 18, colors[Math.floor(Math.random()*colors.length)], false, {}, "full");
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
      let neighbors = this.findNeighbors(current, this.board.grid);
      neighbors.forEach(neighbor => {
      if (neighbor.color === color){
          if (!queue.includes(neighbor) && !checked.includes(neighbor)) {
            queue.push(neighbor);
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
        let neighbors;
        if (top.includes(current)) {
          neighbors = this.bfsNeighbors(current, board);
        } else {
          neighbors = this.findNeighbors(current, board);
        }
        neighbors.forEach(child => {
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


export default Game;

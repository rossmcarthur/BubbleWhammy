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
              this.player.bubble = new Bubble(7, 18, colors[Math.floor(Math.random()*colors.length)], false, {xPos: 266.4, yPos: 632.6999999999999});
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



export default Game;

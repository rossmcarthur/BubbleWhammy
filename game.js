import Board from './board';
import Player from './player';

let newBoard = new Board();
newBoard.populate();

class Game {
  constructor(ctx, canv, board = newBoard) {
    this.ctx = ctx;
    this.canv = canv;
    this.board = board;
    this.player = new Player('Ross');
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  onMouseMove(e) {
    let mousePos = this.getMousePos(this.canv, e);
    let mouseAngle = this.radiansToDegrees(Math.atan2((this.player.y) - mousePos.y, mousePos.x - (this.player.x)));
    if (mouseAngle < 0) {
      mouseAngle = 180 + (180 + mouseAngle);
    }

    let lbound = 8;
    let ubound = 172;

    if (mouseAngle > 90 && mouseAngle < 270) {
      if (mouseAngle > ubound) {
        mouseAngle = ubound;
      }
    } else {
      if (mouseAngle < lbound || mouseAngle >= 270) {
        mouseANgle = lbound;
      }
    }
    this.player.angle = mouseAngle;
    
  }

  start() {
    this.canv.addEventListener('mousemove', this.onMouseMove);
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

  getMousePos(canv, e) {
    let rect = canv.getBoundingClientRect();
    return {
      x: Math.round((e.clientX - rect.left) / (rect.right - rect.left) * canv.width),
      y: Math.round((e.clientY - rect.top) / (rect.bottom - rect.top) * canv.width)
    };
  }

  renderPlayerAngle(ctx) {

    ctx.beginPath();
    ctx.moveTo(this.player.x, this.player.y);
    ctx.lineTo(this.player.x * Math.cos(this.player.angle * (Math.PI / 180)),
    this.player.y * Math.sin(this.player.angle * (Math.PI / 180)));
    ctx.stroke();
  }

  animate() {
  this.renderBubbles();
  this.player.draw(this.ctx);
  this.renderPlayerAngle(this.ctx);

  requestAnimationFrame(this.animate.bind(this));
  }
}


export default Game;

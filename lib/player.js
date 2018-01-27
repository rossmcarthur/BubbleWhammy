import Bubble from './bubble';

const colors = ["red", "blue", "green", "yellow", "purple", "white"];

class Player {
  constructor(name, board) {
    this.name = name;
    this.board = board;
    this.score = 0;
    this.x = 266.4;
    this.y = 675;
    this.angle = 0;
    this.bubble = new Bubble(7, 18, colors[Math.floor(Math.random()*colors.length)], false, {xPos: 266.4, yPos: 632.6999999999999}, "full");
    this.nextBubble = new Bubble(5, 18, colors[Math.floor(Math.random()*colors.length)], false, {}, "full");
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 70, 0, 2*Math.PI, true);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.stroke();
  }

}

export default Player;

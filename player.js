import Bubble from './bubble';

const colors = ["red", "blue", "green", "yellow", "purple", "white"];

class Player {
  constructor(name) {
    this.name = name;
    this.score = 0;
    this.x = 266.4;
    this.y = 710;
    this.angle = 0;
    // this.bubble = new Bubble(0, 0, this.x, this.y - 30, colors[Math.floor(Math.random()*colors.length)]);
    this.nextBubble = new Bubble(0, 0, 0, 700, colors[Math.floor(Math.random()*colors.length)]);
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

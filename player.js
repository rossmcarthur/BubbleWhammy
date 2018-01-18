class Player {
  constructor(name) {
    this.name = name;
    this.score = 0;
    this.x = 266.4;
    this.y = 710;
    this.angle = 0;
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

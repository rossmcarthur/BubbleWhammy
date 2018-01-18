class Bubble {

  constructor(x, y, canX, canY, color){
    this.x = x;
    this.y = y;
    this.canX = canX;
    this.canY = canY;
    this.present = true;
    this.color = color;
  }

  pos() {
    return [this.x, this.y];
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.canX, this.canY, 17, 30, 2*Math.PI, true);
    ctx.fill();
  }

}

export default Bubble;

class Bubble {

  constructor(x, y, canX, canY, color, angle = 0){
    this.x = x;
    this.y = y;
    this.canX = canX;
    this.canY = canY;
    this.present = true;
    this.color = color;
    this.angle = angle;
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

  getScreenPos(row, col) {
    let xPos = col * 33.3;
    if (row % 2 !== 0) {
      xPos += 16.65;
    }

    let yPos = row * 33.3;
    return { xPos: xPos, yPos: yPos };
  }

}

export default Bubble;

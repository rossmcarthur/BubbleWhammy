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

export default Bubble;

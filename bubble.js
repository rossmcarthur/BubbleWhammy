class Bubble {

 // canX, canY;
 // this.canX = canX;
 // this.canY = canY;
  constructor(x, y, color, loaded = false, pos = {}, angle = 0) {
    this.x = x;
    this.y = y;
    this.pos = pos;
    this.gridPos = {};
    this.present = true;
    this.color = color;
    this.angle = angle;
    this.loaded = loaded;
    this.speed = 10;
    }

    degreesToRadians(angle) {
      return angle * (Math.PI / 180);
    }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();

    if (this.loaded) {
      this.pos.xPos += this.speed * Math.cos(this.degreesToRadians(this.angle));
      this.pos.yPos += this.speed * -1 * Math.sin(this.degreesToRadians(this.angle));
      if (this.pos.xPos >= 500) {
        this.angle = Math.abs(180 - this.angle);
      } else if (this.pos.xPos <= 50) {
        this.angle = 180 - this.angle;
      }
    }
    
    ctx.arc(this.pos.xPos, this.pos.yPos, 17, 30, 2*Math.PI, true);
    ctx.fill();
  }

  getGridPos(xPos, yPos) {
    let yGrid = Math.floor(yPos / 33.3) - 1;
    let offset = 0;
    if (yPos % 66.6 === 0) {
      offset = 16.65;
    }
    let xGrid = Math.floor((xPos - offset) / 33.3) - 1;
    return { xGrid: xGrid, yGrid: yGrid };
  }

  getScreenPos(col, row) {
    let xPos;
    if (col === 0) {
      xPos = 33.3;
    } else {
        xPos = (col * 33.3) + 33.3;
    }
    if (row % 2 !== 0) {
      xPos += 16.65;
    }

    let yPos;
    if (row === 0) {
      yPos = 33.3;
    } else {
        yPos = (row * 33.3) + 33.3;
    }

    return { xPos: xPos, yPos: yPos };
  }

}

export default Bubble;

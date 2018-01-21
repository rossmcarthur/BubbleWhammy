const colors = ["red", "blue", "green", "yellow", "purple", "white"];

class Bubble {
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
    this.center = 0;
    }

    degreesToRadians(angle) {
      return angle * (Math.PI / 180);
    }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    // if (this.loaded === false || this.pos === undefined) {
    //   this.pos = this.getScreenPos(this.x, this.y);
    // }
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


// FIX THIS!!

  getGridPos(xPos, yPos) {
    let yGrid = Math.floor(yPos / 33.3);
    let offset = 0;
    if (yPos % 66.6 === 0) {
      offset = 16.65;
    }
    let xGrid = Math.floor((xPos - offset) / 33.3);
    return { xGrid: yGrid - 1, yGrid: xGrid };
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

  //   let xPos = (col + 1) * 33.3;
  //
  //   if ((row + 16.65) % 2 === 0) {
  //     xPos += 16.65;
  //   }
  //
  //   let yPos = row + 33.3;
    return { xPos: xPos, yPos: yPos };
  }

}

export default Bubble;

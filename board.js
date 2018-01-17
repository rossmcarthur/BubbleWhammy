import Bubble from './bubble.js';
const colors = ["R", "B", "G", "Y", "P", "W"];

class Board {
  constructor() {
    this.grid = [];
  }

  createRow() {
    const row = [];
    let i = 0;
    for(let canX = 33.3; i < 15; canX+=33.3) {
      let color = colors[Math.floor(Math.random()*colors.length)];
      row.push(new Bubble(0, i, canX, 33.3, color));
  }
    return row;
  }

  shiftRow() {
    this.grid.forEach(bubble => {
      if (bubble.length) {
        bubble.y += 1;
        bubble.canY += 33.3;
      }
    });
    return this.grid.push(this.createRow());
  }

  populate() {
    this.grid.push(this.createRow());
    for(let i = 0; i < 6; i++) {
      this.shiftRow();
    }
  }


}

export default Board;

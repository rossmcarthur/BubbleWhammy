import Bubble from './bubble.js';
const colors = ["red", "blue", "green", "yellow", "purple", "white"];

class Board {
  constructor() {
    this.grid = [];
  }

  createRow() {
    const row = [];
    let i = 0;
    for(let canX = 33.3; i < 15; canX+=33.3) {
      let color = colors[Math.floor(Math.random()*colors.length)];
      row.push(new Bubble(i, 0, canX, 33.3, color));
      i++;
    }
    return row;
  }

  shiftRow() {
    this.grid.forEach(row => {
      row.forEach(bubble => {
          bubble.y += 1;
          bubble.canY += 33.3;
          if (bubble.y % 2 !== 0) {
            bubble.canX += 16.65;
          } else if (bubble.y !== 0) {
            bubble.canX -= 16.65;
          }
      });
    });
    this.removeRow();
    return this.grid.unshift(this.createRow());
  }

  removeRow() {
    if (this.grid.length === 15) {
    return this.grid.pop();
    }
  }
  
  populate() {
    this.grid.unshift(this.createRow());
    for(let i = 0; i < 6; i++) {
      this.shiftRow();
    }
    for(let i = 0; i < 8; i++) {
      let emptyRow = [];
      for(let j = 0; j < 15; j++) {
        emptyRow.push([]);
      }
      this.grid.push(emptyRow);
    }
  }

}

export default Board;

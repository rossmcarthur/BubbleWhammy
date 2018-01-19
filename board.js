import Bubble from './bubble.js';
const colors = ["red", "blue", "green", "yellow", "purple", "white"];

class Board {
  constructor() {
    this.grid = [];
  }

  createRow() {
    const row = [];
    for(let i = 0; i < 15; i++) {
      let color = colors[Math.floor(Math.random()*colors.length)];
      let bubble = new Bubble(i, 0, color);
      bubble.pos = bubble.getScreenPos(bubble.x, bubble.y);
      row.push(bubble);
    }
    return row;
  }

  shiftRow() {
    this.grid.forEach(row => {
      row.forEach(bubble => {
          bubble.y += 1;
          bubble.pos = bubble.getScreenPos(bubble.x, bubble.y);
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
    for(let l = 0; l < 12; l++) {
      let emptyRow = [];
      for(let j = 0; j < 15; j++) {
        emptyRow.push([]);
      }
      this.grid.push(emptyRow);
    }
  }

}

export default Board;

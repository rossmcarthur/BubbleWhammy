import Bubble from './bubble';
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
      bubble.pos = bubble.getScreenPos(bubble, bubble.x, bubble.y);
      bubble.state = "full";
      if (this.grid.length < 1 || this.grid[0][0].shifted) {
        bubble.shifted = false;
      } else {
        bubble.shifted = true;
      }
      row.push(bubble);
    }
    return row;
  }

  shiftRow() {
    this.grid.forEach(row => {
      row.forEach(bubble => {
          bubble.y += 1;
          bubble.pos = bubble.getScreenPos(bubble, bubble.x, bubble.y);
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
    for(let i = 0; i < 1; i++) {
      this.shiftRow();
    }
    for(let l = 2; l < 18; l++) {
      let emptyRow = [];
      for(let j = 0; j < 15; j++) {
        let bubble = new Bubble(j, l);
        bubble.pos = bubble.getScreenPos(bubble, bubble.x, bubble.y);
        if (!this.grid[bubble.y - 1][bubble.x].shifted) {
          bubble.shifted = true;
        }
        emptyRow.push(bubble);
      }
      this.grid.push(emptyRow);
    }
  }

}

export default Board;

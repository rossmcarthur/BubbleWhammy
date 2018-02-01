### [Live](http://www.rossmcarthur.com/BubbleWhammy/)
![](https://media.giphy.com/media/3o7WIySsiCcCg505BC/giphy.gif)

Bubble Whammy is a bubble-shooter puzzle game built with JavaScript and HTML5 with Canvas. Using the cursor as a controller, players control where they want their bubbles to shoot, attempting to connect three or more similarly colored bubbles together, knocking them off the board.

### Features and Implementation

A bubble object is always aware of both its position on a 2-D grid as well as its pixel position on the canvas through the use of two functions `getGridPos` and `getScreenPos`, making the code involved in collision detection and animating the bubbles more DRY.
```JavaScript
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
```

Using the cursor's position on the canvas, a pointer is animated giving players an indication of the flightpath of the bubble they are shooting.
```JavaScript
handleMove(e) {
  const mousePos = this.getMousePos(this.canv, e);
  let mouseAngle = this.radiansToDegrees(Math.atan2((this.player.y) - mousePos.y, mousePos.x - (this.player.x)));
  if (mouseAngle < 0) {
    mouseAngle = 180 + (180 + mouseangle);
  }
  let lbound = 20;
  let ubound = 160;
  if (mouseAngle > 90 && mouseAngle < 270) {
    if (mouseAngle > ubound) {
      mouseAngle = ubound;
    }
  } else {
    if (mouseAngle < lbound || mouseAngle >= 270) {
      mouseAngle = lbound;
    }
  }
  this.player.angle = mouseAngle;
}
```
Bubble Whammy implements a breadth first search algorithm when a bubble is snapped into place, allowing efficient space complexity when interpreting if the shot bubble has created a cluster of three or more similarly colored clusters, or if any remaining bubbles are not connected to the grid through other bubbles.
```JavaScript
clusters(bubble) {
  const color = bubble.color;
  let checked = [];
  let queue = [bubble];
  while (queue.length >= 1) {
    let current = queue.shift();
    let children = this.findNeighbors(current, this.board.grid);
    children.forEach(child => {
      if (child.color === color){
        if (!queue.includes(child) && !checked.includes(child)) {
          queue.push(child);
        }
      }
    });
    if (!checked.includes(current)) {
      checked.push(current);
    }
  }
  if (checked.length >= 3) {
    checked.forEach(bubble => {
      this.score += 200;
      bubble.color = null;
      bubble.state = "empty";
    });
  }
}
```

### Future Direction

* Using Firebase to store global high scores.
* Adding animation for bubbles dropping and cursor aimer.
* Adding difficulty setting.

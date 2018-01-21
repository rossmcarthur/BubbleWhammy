

// 
// class CollisionDetector {
//   constructor(bubble, board, angle) {
//     this.bubble = bubble;
//     this.board = board;
//     this.angle = angle;
//   }
//
//   find_intersetcion(bubble, board, angle) {
//     let collision = null;
//     let pos = bubble.pos;
//     let start = {
//       x: bubble.pos.xPos,
//       y: bubble.pos.yPos
//     };
//     let dx = Math.sin(angle);
//     let dy = Math.cos(angle);
//
//     for(let i = 0; i < board.length; i++){
//       for(let j = 0; j < board[i].length; j++) {
//         let gridBubb = board[i][j];
//         if (gridBubb instanceof Array === false) {
//           let distanceToBubble = {
//             x: start.x - gridBubb.pos.xPos,
//             y: start.y - gridBubb.pos.yPos
//           };
//
//           let t = dx * distToBubble.x + dy * distToBubble.y;
//           let ex = -t * dx + start.x;
//           let ey = -t * dy + start.y;
//
//           let distEC = Math.sqrt((ex - pos.xPos) * (ex - pos.xPos) + (ey - pos.yPos) * (ey - pos.yPos));
//         }
//       }
//     }
//   }
// }

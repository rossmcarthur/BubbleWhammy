import Game from './game.js';
import Board from './board.js';


document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameBoard");
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, 1000, 1000);
  const game = new Game(ctx, canvas);
  game.start();
  game.animate();
});

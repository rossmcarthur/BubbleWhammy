import Game from './game.js';
import Board from './board.js';


document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameBoard");
  const ctx = canvas.getContext("2d");
  const game = new Game(ctx, canvas);
  game.start();
});

var Game = require('./game');
var GameView = require('./game_view');

document.addEventListener("DOMContentLoaded", function(){
  var canvasEl = document.getElementsByTagName("canvas")[0];
  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y;

  var ctx = canvasEl.getContext("2d");
  var game = new Game();

  // var startScreen = document.getElementsByClassName("start-screen")[0];
  //
  // startScreen.addEventListener("keydown", function(event) {
  //   startScreen.className  = "hide";
  // });
  new GameView(game, ctx, canvasEl).start();
});

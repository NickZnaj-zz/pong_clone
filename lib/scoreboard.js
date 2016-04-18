var ScoreBoard = function(game) {
  this.game = game;
};

ScoreBoard.prototype.draw = function(ctx) {
  ctx.fillStyle = "#aaa";
  // ctx.font = "100px 'Press Start 2P'";
  ctx.fillText(this.game.score.human, this.game.DIM_X / 3, this.game.DIM_Y / 2);
  ctx.fillText(this.game.score.ai, (this.game.DIM_X / 3) * 2, this.game.DIM_Y / 2);

  ctx.beginPath();
  ctx.moveTo(this.game.DIM_X / 2, 0);
  ctx.lineTo(this.game.DIM_X / 2, this.game.DIM_Y);
  ctx.lineWidth = 10;

  ctx.strokeStyle = "#aaa";
  ctx.stroke();
};

module.exports = ScoreBoard;

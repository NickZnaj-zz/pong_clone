var ScoreBoard = function(game) {
  this.game = game;
};

ScoreBoard.prototype.draw = function(ctx) {
  ctx.fillStyle = "#aaa";
  ctx.font = "100px Press-Start-2P";
  ctx.fillText(this.game.score.human, this.game.DIM_X / 2 - 100, this.game.DIM_Y / 2);
  ctx.fillText(this.game.score.ai, this.game.DIM_X / 2 + 100, this.game.DIM_Y / 2);
};

module.exports = ScoreBoard;

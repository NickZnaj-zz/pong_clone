var GameView = function(game, ctx) {
  this.ctx = ctx;
  this.game = game;
  // this.ball = this.game.addBall();
};

GameView.prototype.start = function () {
  var movement = function () {
    this.ctx.clearRect(0, 0, 1000, 1000);
    this.game.draw(this.ctx);
    this.game.moveObjects();
  }.bind(this);

  setInterval(movement, 20);
};

module.exports = GameView;

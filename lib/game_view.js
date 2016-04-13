var GameView = function(game, ctx) {
  this.ctx = ctx;
  this.game = game;
  // this.ball = this.game.addBall();
};

GameView.prototype.start = function () {
  // var movement = function () {
  //   this.ctx.clearRect(0, 0, 1000, 1000);
  //   this.game.draw(this.ctx);
  //   this.game.moveObjects();
  // }.bind(this);
  //
  // setInterval(movement, 20);

  this.lastTime = 0;
  requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.animate = function(time){
  var timeDelta = time - this.lastTime;

  this.game.step(timeDelta);
  this.game.draw(this.ctx);
  this.lastTime = time;

  requestAnimationFrame(this.animate.bind(this));
};

module.exports = GameView;

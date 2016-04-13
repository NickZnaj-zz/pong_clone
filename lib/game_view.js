var GameView = function(game, ctx) {
  this.ctx = ctx;
  this.game = game;

};

GameView.MOVES = {
  "up": [0, -20],
  "down": [0, 20]
};

GameView.prototype.bindKeyHandlers = function () {
  var paddle = this.game.paddles[0];
  Object.keys(GameView.MOVES).forEach(function(k) {
    var move = GameView.MOVES[k];
    key(k, function () {paddle.move(move, this.ctx);
    }.bind(this));
  }.bind(this));
};

GameView.prototype.start = function () {
  this.bindKeyHandlers();
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

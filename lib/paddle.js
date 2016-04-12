var Util = require('./util');

var DEFAULTS = {
  COLOR: "#990000",
  WIDTH: 10,
  HEIGHT: 50
};

var Paddle = function(options) {
  this.width = DEFAULTS.WIDTH;
  this.height = DEFAULTS.HEIGHT;
  this.color = DEFAULTS.COLOR;
  this.canvasSize = [];
};

Paddle.prototype.draw = function(ctx){
  ctx.fillStyle = DEFAULTS.COLOR;

  ctx.fillRect(20, this.canvasSize[1]/2 + DEFAULTS.HEIGHT / 2,
      20 + DEFAULTS.WIDTH, this.canvasSize[1] / 2 - DEFAULTS.HEIGHT / 2
    );

  ctx.fill();
};

module.exports = Paddle;

var Util = require('./util');
var PADDLE_DEFAULTS = require('./paddle_constants');


var Paddle = function(options) {
  this.width = PADDLE_DEFAULTS.WIDTH;
  this.height = PADDLE_DEFAULTS.HEIGHT;
  this.color = PADDLE_DEFAULTS.COLOR;
  this.canvasSize = [];
  this.pos = options.pos;
};

Paddle.prototype.draw = function(ctx){
  ctx.fillStyle = PADDLE_DEFAULTS.COLOR;

  ctx.fillRect(this.pos[0] - this.width, this.pos[1], this.pos[0], this.pos[1] + this.height);

  ctx.fill();
};

module.exports = Paddle;

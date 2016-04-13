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
  // ctx.clearRect(this.pos[0] - this.width, this.pos[1], this.pos[0], this.pos[1] + this.height);
  ctx.fillStyle = this.color;
  // ctx.beginPath();


  ctx.fillRect(this.pos[0] - this.width, this.pos[1], this.pos[0], this.pos[1] + this.height);
  ctx.fill();
};

Paddle.prototype.move = function(impulse, ctx) {
  // ctx.clearRect(this.pos[0] - this.width, this.pos[1], this.pos[0], this.pos[1] + this.height);

  ctx.clearRect(0, 0, 600, 600);
  this.pos[0] += impulse[0];

  var newY = this.pos[1] + impulse[1];
  if( newY >= 0 && newY <= this.canvasSize[1] - this.height) {
    this.pos[1] = newY;
  }
  this.draw(ctx);
  console.log(this.height + "  " + this.pos);
};

module.exports = Paddle;

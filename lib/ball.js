var Util = require('./util');


var DEFAULTS = {
  COLOR: "#990000",
  RADIUS:  20,
  SPEED: 5
};

var Ball = function (options) {
  this.pos = options.pos;
  this.vel = [-4, -5];
  this.radius = DEFAULTS.RADIUS;
  this.color = DEFAULTS.COLOR;
  this.canvasSize = [];
};

Ball.prototype.draw = function(ctx) {
  ctx.fillStyle = this.color;

  ctx.beginPath();
  ctx.arc(
    this.pos[0],  this.pos[1], this.radius, 0, 2 * Math.PI, true
  );
  ctx.fill();
};


Ball.prototype.move = function() {
  this.pos[0] += this.vel[0];
  this.pos[1] += this.vel[1];

  if (this.pos[1] <= 0 + this.radius ) this.vel[1] = -(this.vel[1]);
  if (this.pos[1] >= this.canvasSize[1] - this.radius) this.vel[1] = -(this.vel[1]);
  if (this.pos[0] <= 0 + this.radius) this.vel[0] = -(this.vel[0]);
  if (this.pos[0] >= this.canvasSize[0] - this.radius) this.vel[0] = -(this.vel[0]);
};

Ball.isCollided = function(paddle){
  var centerDist = Util.dist(this.pos, paddle.pos);
  return centerDist < (this.radius);
};




module.exports = Ball;

var Util = require('./util');


var DEFAULTS = {
  COLOR: "#990000",
  RADIUS:  10,
  SPEED: 5
};

var Ball = function (options) {
  this.pos = options.pos;
  this.vel = [3, -5];
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

var NORMAL_FRAME_TIME_DELTA = 1000/60;
Ball.prototype.move = function(timeDelta) {
  var velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
    offsetX = this.vel[0] * velocityScale,
    offsetY = this.vel[1] * velocityScale;

    this.lastX = this.pos[0];
    this.lastY = this.pos[1];

  this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
  // this.pos[0] += this.vel[0];
  // this.pos[1] += this.vel[1];

  if (this.pos[1] <= 0 + this.radius ) this.vel[1] = -(this.vel[1]);
  if (this.pos[1] >= this.canvasSize[1] - this.radius) this.vel[1] = -(this.vel[1]);
  if (this.pos[0] <= 0 + this.radius) this.vel[0] = -(this.vel[0]);
  if (this.pos[0] >= this.canvasSize[0] - this.radius) this.vel[0] = -(this.vel[0]);
};

Ball.prototype.isCollided = function(paddle){
  if (
    paddle.human &&
    (this.pos[1] < paddle.pos[1] + paddle.height) &&
    (this.pos[1] > paddle.pos[1]) &&
    ((this.pos[0] - this.radius) <= paddle.pos[0])
  ){
    return true;
  } else if (
    !paddle.human &&
    (this.pos[0] + this.radius >= paddle.pos[0]) &&
    (this.pos[1] >= paddle.pos[1]) &&
    (this.pos[1] <= paddle.pos[1] + paddle.height)
  ){
    return true;
  } else return false;
  // var centerDist = Util.dist(this.pos, paddle.pos);
  // return centerDist < (this.radius);
};




module.exports = Ball;

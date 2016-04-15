var Util = require('./util');


var DEFAULTS = {
  COLOR: "#d00",
  RADIUS:  10,
  SPEED: 5
};

var Ball = function (options) {
  this.pos = options.pos;
  this.vel = [4, 10];
  this.radius = DEFAULTS.RADIUS;
  this.color = "purple";
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

Ball.prototype.bounceOff = function(surface){
  if (surface === "top" || surface === "bottom"){
    this.vel[1] = -(this.vel[1]);
  } else {
    this.vel[0] = -(this.vel[0]);
  }
  console.log(surface);
};

var NORMAL_FRAME_TIME_DELTA = 1000/60;
Ball.prototype.move = function(timeDelta) {
  this.changedDir = false;
  var velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
    offsetX = this.vel[0] * velocityScale,
    offsetY = this.vel[1] * velocityScale;

    this.lastX = this.pos[0];
    this.lastY = this.pos[1];

  this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];

  var fudgeFactor = 2;

  if (this.pos[1] <= 0 + this.radius ) {
    this.vel[1] = -(this.vel[1]);
    this.changedDir = true;
  }
  if (this.pos[1] >= this.canvasSize[1] - this.radius ) {
    this.vel[1] = -(this.vel[1]);
    this.changedDir = true;
  }
  if (this.pos[0] <= 0 + this.radius ) {
    this.vel[0] = -(this.vel[0]);
    this.changedDir = true;
  }
  if (this.pos[0] >= this.canvasSize[0] - this.radius ) {
    this.vel[0] = -(this.vel[0]);
    this.changedDir = true;
  }
};

Ball.prototype.isCollided = function(paddle){
  var topLeft = paddle.pos;
  var topRight = [paddle.pos[0] + paddle.width, paddle.pos[1]];
  var bottomLeft = [paddle.pos[0], paddle.pos[1] + paddle.height];
  var bottomRight = [paddle.pos[0] + paddle.width, paddle.pos[1] + paddle.height];

  if ( paddle.human ) {

    if (
    (this.pos[0] - this.radius < topRight[0]) && // main side
    (this.pos[1] + this.radius > topRight[1]) &&
    (this.pos[1] - this.radius < bottomRight[1]) &&
    (this.collisionPoint = "side")){
      return true;
    }

    if ((this.pos[0] > topLeft[0] ) &&     // top side
    (this.pos[0] < topRight[0]) &&
    (this.pos[1] + this.radius >= topRight[1]) &&
    (this.pos[1] - this.radius <= topRight[1]) &&
    (this.collisionPoint = "top")){
      return true;
    }

    if ((this.pos[0] > bottomLeft[0] ) &&
    (this.pos[0] < bottomRight[0] ) &&    // bottom side
    (this.pos[1] - this.radius < bottomLeft[1]) &&
    (this.pos[1] + this.radius > bottomLeft[1]) &&
    (this.collisionPoint = "bottom")){
      return true;
    }
  }

  else if (!paddle.human){

    if ((this.pos[0] > topLeft[0]) &&               // top side
    (this.pos[0] < topRight[0]) &&
    (this.pos[1] + this.radius >= topLeft[1]) &&
    (this.pos[1] - this.radius <= topLeft[1]) &&
    (this.collisionPoint = "top")) {return true;}

    if ((this.pos[0] + this.radius > topLeft[0]) && // main side
    (this.pos[1] > topRight[1]) &&
    (this.pos[1] < bottomRight[1]) &&
    (this.collisionPoint = "side")){
      return true;
    }

    if ((this.pos[0] > bottomLeft[0] ) &&
    (this.pos[0] < bottomRight[0] ) &&             // bottom side
    (this.pos[1] - this.radius < bottomLeft[1]) &&
    (this.pos[1] + this.radius > bottomLeft[1]) &&
    (this.collisionPoint = "bottom")){
      return true;
    }

  } else return false;
};




module.exports = Ball;

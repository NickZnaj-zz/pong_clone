var Util = require('./util');
var Paddle = require('./paddle');


var DEFAULTS = {
  COLOR: "#d00",
  RADIUS:  10,
  VELOCITY: [-7, 3],
  POS: [300, 300]
};


var Ball = function (options) {
  this.pos = options.pos || DEFAULTS.POS;
  this.vel = [0, 0];
  this.radius = DEFAULTS.RADIUS;
  this.color = "purple";
  this.canvasSize = [];
  this.pastPositions = [];
  this.spin = 0;
};

Ball.prototype.startMoving = function() {
  // console.log("defaults" + DEFAULTS.VELOCITY);
  this.vel = DEFAULTS.VELOCITY.slice();
  // console.log("stsrting vel" + this.vel);
};

Ball.prototype.draw = function(ctx) {
  if (this.pastPositions.length > 20)  this.pastPositions.splice(0, 1);
  this.drawGhost(ctx);
  ctx.fillStyle = this.color;

  ctx.beginPath();
  ctx.arc(
    this.pos[0],  this.pos[1], this.radius, 0, 2 * Math.PI, true
  );
  ctx.fill();

};

Ball.prototype.drawGhost = function(ctx)  {
  this.pastPositions.forEach(function(el) {

    ctx.strokeStyle = "#aaa";

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.arc(el[0], el[1], this.radius - 2, 0, 2 * Math.PI, true);
    ctx.stroke();
  }.bind(this));

};

Ball.prototype.bounceOff = function(surface, isHuman){

  if (surface === "top" || surface === "bottom"){
    this.vel[1] = -(this.vel[1]);

  }
  if (surface === "side") {
    this.vel[0] = -(this.vel[0]);
  }

  if (isHuman){
    var newVel = this.newCurvingVel(this.vel[0], this.vel[1]);
    this.vel = newVel.slice();
    console.log(newVel);
  }


  console.log(surface);

  // if (surface === "top" || surface === "bottom"){
  //   this.vel[1] = -(this.vel[1]);
  // }
  // if (surface === "side") {
  //   this.vel[0] = -(this.vel[0]);
  // }


};
Ball.prototype.newCurvingVel = function(xInitial, yInitial) {
  this.spin = this.shiftY / 7 || this.spin;

  var shiftY = this.shiftY || 0;
  var maxShift = 2;

  if (shiftY !== 0){
    if (shiftY < -(maxShift)) shiftY = -(maxShift);
    if (shiftY > maxShift) shiftY = maxShift;
  }
  var maxF = 1.2;

  var F = shiftY / maxF;

  var thetaInitial = Util.findTheta(xInitial, yInitial);
  // if (thetaInitial !== 0) console.log(thetaInitial);
  var thetaFinal = thetaInitial * F;

  var vFinal = Util.findMagnitude(xInitial, yInitial);

  // var xFinal = Math.sqrt(Math.pow(vFinal, 2) * Math.pow((Math.cos(thetaFinal)), 2));
  // var yFinal = Math.sqrt(Math.pow(vFinal, 2) * Math.pow((Math.sin(thetaFinal)), 2));

  var xFinal = vFinal * Math.cos(thetaFinal);
  var yFinal = vFinal * Math.sin(thetaFinal);

  // if (xInitial < 0) xFinal *= -1;
  // if (yInitial < 0) yFinal *= -1;

  if (yFinal < 0) yFinal *= -1;

  return [xFinal, yFinal];
};

var NORMAL_FRAME_TIME_DELTA = 1000/60;
Ball.prototype.move = function(timeDelta) {
  this.changedDir = false;


  var velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
  offsetX = this.vel[0] * velocityScale,
  offsetY = this.vel[1] * velocityScale;

  this.lastX = this.pos[0];
  this.lastY = this.pos[1];

  this.pastPositions.push(this.pos);

  this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
  // console.log(this.pos);

  var fudgeFactor = 2;

  if (this.pos[1] <= 0 + this.radius && this.vel[1] < 0 ) {
    this.vel[1] = -(this.vel[1]);
     this.changedDir = true;
  }
  if (this.pos[1] >= this.canvasSize[1] - this.radius && this.vel[1] > 0) {
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

  //  APPLY THE SPIN

  if (this.spin < 0){
    this.spin *= 0.96;
    this.vel[1] -= this.spin;
  }

  if (this.spin > 0){
    this.spin *= 0.96 ;
    this.vel[1] -= this.spin;
  }

  // var newVel = this.newCurvingVel(this.vel[0], this.vel[1]);
  // this.vel = newVel.slice();

  // console.log(this.vel);
    this.vel[0] *= 1.00005;
    this.vel[1] *= 1.00005;


};


Ball.prototype.isCollided = function(paddle){
  var topLeft = paddle.pos;
  var topRight = [paddle.pos[0] + paddle.width, paddle.pos[1]];
  var bottomLeft = [paddle.pos[0], paddle.pos[1] + paddle.height];
  var bottomRight = [paddle.pos[0] + paddle.width, paddle.pos[1] + paddle.height];

  if ( paddle.human ) {

    if (
    (this.vel[0] < 0) &&
    (this.pos[0] - this.radius < topRight[0]) && // main side
    (this.pos[1] + this.radius > topRight[1]) &&
    (this.pos[1] - this.radius < bottomRight[1]) &&
    (this.collisionPoint = "side")){
      return true;
    }

    if (
    (this.pos[0] + this.radius > topLeft[0] ) &&     // top side
    (this.pos[0] < topRight[0]) &&
    (this.pos[1] + this.radius >= topRight[1]) &&
    (this.pos[1] - this.radius <= topRight[1]) &&
    (this.collisionPoint = "top")){
      return true;
    }

    if (
    (this.pos[0] > bottomLeft[0] ) &&
    (this.pos[0] < bottomRight[0] ) &&    // bottom side
    (this.pos[1] - this.radius < bottomLeft[1]) &&
    (this.pos[1] + this.radius > bottomLeft[1]) &&
    (this.collisionPoint = "bottom")){
      return true;
    }
  }

  else if (!paddle.human){

    if (
    (this.pos[0] > topLeft[0]) &&               // top side
    (this.pos[0] < topRight[0]) &&
    (this.pos[1] + this.radius >= topLeft[1]) &&
    (this.pos[1] - this.radius <= topLeft[1]) &&
    (this.collisionPoint = "top")) {return true;}

    if (
    (this.vel[0] > 0) &&
    (this.pos[0] + this.radius > topLeft[0]) && // main side
    (this.pos[1] > topRight[1]) &&
    (this.pos[1] < bottomRight[1]) &&
    (this.collisionPoint = "side")){
      return true;
    }

    if (
    (this.pos[0] > bottomLeft[0] ) &&
    (this.pos[0] < bottomRight[0] ) &&             // bottom side
    (this.pos[1] - this.radius < bottomLeft[1]) &&
    (this.pos[1] + this.radius > bottomLeft[1]) &&
    (this.collisionPoint = "bottom")){
      return true;
    }

  } else return false;
};

Ball.prototype.reset = function(pos){
  this.vel = [0, 0];
  this.pastPositions = [];
  this.pos = pos;
};




module.exports = Ball;

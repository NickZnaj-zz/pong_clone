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
  ctx.fillStyle = this.color;
  ctx.fillRect(this.pos[0], this.pos[1], this.width, this.height);
  ctx.fill();
};

Paddle.prototype.move = function(impulse, ball) {

  if(this.human) {
    this.pos[0] += impulse[0];

    var newY = this.pos[1] + impulse[1];
    if( newY >= 0 && newY <= this.canvasSize[1] - this.height) {
      this.pos[1] = newY;
    }
  }
  else {
    this.AiMove(ball);
  }
};


// Paddle.prototype.AiMove = function(ball) {
//   var newY = this.pos[1] - 1;
//   if( newY >= 0 ) {
//     this.pos[1] = newY;
//     return;
//   }
//   newY = this.pos[1] + 1;
//   if(newY <= this.canvasSize[1] - this.height){
//     this.pos[1] = newY;
//   }
// };

Paddle.prototype.aiPredict = function(ball) {

  var slope = Util.slope(
    ball.pos[1], ball.lastY, ball.pos[0], ball.lastX
  );

  this.prediction = {};

  var prediction = Util.extrapolatePoint(slope, this.pos[0], ball.pos[0], ball.pos[1]);

  if ( prediction > 0 ){
    this.prediction.y = prediction;
  }
};

Paddle.prototype.AiMove = function(bball){
  var ball = bball[0];
  var deltaX = ball.pos[0] - ball.lastX;
  var deltaY = ball.pos[1] - ball.lastY;

  if (
    ((ball.pos[0] < this.pos[0]) && (ball.vel[0] < 0))
  ){
    return;
  }
  this.aiPredict(ball);

  if (this.prediction.y) {
    if (this.prediction.y < this.pos[1]) {
      if (this.AiInBounds(this.prediction.y)) this.AiMoveUp();
    }

    else if (this.prediction.y > this.pos[1]) {
      if (this.AiInBounds(this.prediction.y)) this.AiMoveDown();
    }

    // else {
    //   this.AiStopMovingUp();
    //   this.AiStopMovingDown();
    // }
  } else {
    this.AiWander();
  }
};

Paddle.prototype.AiWander = function() {
  if (this.AiInBounds(this.pos[1] + 10))  {
    this.AiMoveDown();
  } else  {
    this.AiMoveUp();
  }
};

Paddle.prototype.AiInBounds = function(coord) {
  if (
    (this.pos[1] - coord >= 0 || coord) &&
    this.pos[1] + this.height + coord <= this.canvasSize[1]){
      return true;
    }

  else if (
    this.pos[1] - coord >= 0 &&
    this.pos[1] - coord <= this.canvasSize[1]){
      return true;
    }

  else return false;
};

Paddle.prototype.AiMoveUp = function() {
  this.pos[1] -= 5;
};

Paddle.prototype.AiMoveDown = function() {
  this.pos[1] += 5;
};

Paddle.prototype.AiStopMovingUp = function() {
};

Paddle.prototype.AiStopMovingDown = function() {

};


module.exports = Paddle;

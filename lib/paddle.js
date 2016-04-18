var Util = require('./util');
var PADDLE_DEFAULTS = require('./paddle_constants');


var Paddle = function(options) {
  this.width = PADDLE_DEFAULTS.WIDTH;
  this.height = PADDLE_DEFAULTS.HEIGHT;
  this.color = PADDLE_DEFAULTS.COLOR;
  this.canvasSize = [];
  this.pos = options.pos;
  this.increment = 10;
};

Paddle.prototype.draw = function(ctx){
  ctx.fillStyle = this.color;
  ctx.fillRect(this.pos[0], this.pos[1], this.width, this.height);
  ctx.fill();
};

Paddle.prototype.move = function(options) {
  if(this.human) {
    if(options.mouse){
      this.pos[1] = options.mouse.y;
    } else
    {this.pos[0] += options.move[0];

      var newY = this.pos[1] + options.move[1];
      if( newY >= 0 && newY <= this.canvasSize[1] - this.height) {
        this.pos[1] = newY;
      }
    }
  }
  else {
    this.AiMove(options.ball);
  }
};


Paddle.prototype.aiPredict = function(ball) {

  var slope = Util.slope(
    ball.pos[1], ball.lastY, ball.pos[0], ball.lastX
  );

  this.prediction = {};

  var prediction = Util.extrapolatePoint(slope, this.pos[0], ball.pos[0], ball.pos[1]);

  if ( prediction > 0 ){
    this.prediction.y = prediction;
  } else if (prediction < 0) {
    this.prediction.y = Math.abs(prediction);
  }
};

Paddle.prototype.AiMove = function(bball){
  var ball = bball[0];
  var deltaX = ball.pos[0] - ball.lastX;
  var deltaY = ball.pos[1] - ball.lastY;

  this.deltas = [deltaX, deltaY];
  if (
    ((ball.pos[0] < this.pos[0]) && (ball.vel[0] < 0))
  ){
    return;
  }
  this.pos[1] += this.height/2; // //
  this.aiPredict(ball);         // makes contact primarily in center of paddle
  this.pos[1] -= this.height/2; // //

  if (this.prediction.y) {

    if (this.prediction.y < this.pos[1]) {
      if (this.willNotBeOutOfBoundsUp()) {
        if (this.prediction.y < this.pos[1] || this.prediction.y > this.pos[1] + this.height) {
         this.AiMoveUp();
       }
      }
    }

    else if (this.prediction.y > this.pos[1]) {
      if (this.willNotBeOutOfBoundsDown()){
        if (this.prediction.y < this.pos[1] || this.prediction.y > this.pos[1] + this.height) {
          this.AiMoveDown();
        }
      }
    }

    // else {
    //   this.AiStopMovingUp();
    //   this.AiStopMovingDown();
    // }
  } else {
    this.AiWander();
  }
};

Paddle.prototype.willNotBeOutOfBoundsUp = function() {
  return (this.pos[1] - this.increment > 0);
};
Paddle.prototype.willNotBeOutOfBoundsDown = function() {
  return (this.pos[1] + this.increment + this.height < this.canvasSize[1]);
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
    this.pos[1] -= this.increment;
};

Paddle.prototype.AiMoveDown = function() {
    this.pos[1] += this.increment;
};

Paddle.prototype.AiStopMovingUp = function() {
};

Paddle.prototype.AiStopMovingDown = function() {

};


module.exports = Paddle;

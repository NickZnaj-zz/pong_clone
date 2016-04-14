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


  ctx.fillRect(this.pos[0] - this.width, this.pos[1], this.pos[0], this.pos[1] + this.height);
  ctx.fill();
};

Paddle.prototype.move = function(impulse, ball) {

  if(this.human) {
    this.pos[0] += impulse[0];

    var newY = this.pos[1] + impulse[1];
    if( newY >= 0 && newY <= this.canvasSize[1] - this.height) {
      this.pos[1] = newY;
    }
    console.log(this.height + "  " + this.pos);
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

  this.prediction = {x: this.pos[0] };

  this.prediction.y =
  Util.extrapolatePoint(slope, this.pos[0], ball.pos[0], ball.pos[1]);
};

Paddle.prototype.AiMove = function(bball){
  var ball = bball[0];
  var deltaX = ball.pos[0] - ball.lastX;
  var deltaY = ball.pos[1] - ball.lastY;

  if (
    ((ball.pos[0] < this.pos[0]) && (deltaX < 0)) ||
    ((ball.pos[0] > this.pos[0] + this.width) && deltaX > 0)
  ){
    this.AiStopMovingUp();
    this.AiStopMovingDown();
    return;
  }

  this.aiPredict(ball);

  if (this.prediction.y) {
    if (this.prediction.y < this.pos[1]) {
      this.AiStopMovingDown();
      this.AiMoveUp();
    } else if (this.prediction.y > this.pos[1]) {
      this.AiStopMovingUp();
      this.AiMoveDown();
    } else {
      this.AiStopMovingUp();
      this.AiStopMovingDown();
    }
  }
};

Paddle.prototype.AiMoveUp = function() {
  this.pos[1] -= 1;
};

Paddle.prototype.AiMoveDown = function() {
  this.pos[1] += 1;
};

Paddle.prototype.AiStopMovingUp = function() {
};

Paddle.prototype.AiStopMovingDown = function() {

};


module.exports = Paddle;

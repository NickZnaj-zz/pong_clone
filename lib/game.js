var Ball = require('./ball');

var Game = function() {
  this.ball = [];
  this.paddles = [];
  this.addBall();
};

Game.DIM_X = 600;
Game.DIM_Y  = 300;
Game.BG_COLOR = "#000000";


Game.prototype.add = function(object) {
  if (object instanceof Ball){
    this.ball.push(object);
  } else {
    throw 'how did you even?';
  }
};

Game.prototype.draw = function(ctx) {
  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  ctx.fillStyle = Game.BG_COLOR;
  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

  this.allObjects().forEach(function (object) {
    object.draw(ctx);
  });
};

Game.prototype.allObjects  = function() {
  return [].concat(this.paddles, this.ball);
};

Game.prototype.addBall = function() {
  var ball = new Ball({
    pos: [100, 100],
    game: this,
    canvasSize: []
  });

  ball.canvasSize.push(Game.DIM_X);
  ball.canvasSize.push(Game.DIM_Y);
  this.add(ball);
  return ball;
};

Game.prototype.moveObjects = function(){
  this.ball[0].move();
};



module.exports = Game;

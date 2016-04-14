var Ball = require('./ball');
var Paddle = require('./paddle');
var PADDLE_DEFAULTS = require('./paddle_constants');


var Game = function() {
  this.ball = [];
  this.paddle = null;
  this.ai = null;
  this.addBall();
  this.addPaddle(); ////////
  this.addAi();
};

Game.DIM_X = 600;
Game.DIM_Y  = 300;
Game.BG_COLOR = "#000000";


Game.prototype.add = function(object) {
  if (object instanceof Ball){
    this.ball.push(object);
  } else if(object instanceof Paddle && object.human) {
    this.paddle = object;
  } else if ( object instanceof Paddle && !object.human) {
    this.ai = object;
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
  return [].concat(this.paddle, this.ai, this.ball);
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

Game.prototype.addPaddle = function() {
  var paddle = new Paddle({
    game: this,
    canvasSize: [],
    pos: []
  });
  paddle.canvasSize.push(Game.DIM_X);
  paddle.canvasSize.push(Game.DIM_Y);
  paddle.pos =
    [PADDLE_DEFAULTS.WIDTH,
     Game.DIM_Y - PADDLE_DEFAULTS.HEIGHT];
  paddle.human = true;
  this.add(paddle);
  return paddle;
};

Game.prototype.addAi = function() {
  var ai = new Paddle({
    game: this,
    canvasSize: [],
    pos: []
  });
  ai.canvasSize.push(Game.DIM_X);
  ai.canvasSize.push(Game.DIM_Y);
  ai.pos =
  [Game.DIM_X - PADDLE_DEFAULTS.WIDTH,
   Game.DIM_Y - PADDLE_DEFAULTS.HEIGHT];
  ai.human = false;

  this.add(ai);
  return ai;
};

Game.prototype.moveObjects = function(delta){
  this.ball[0].move(delta);
  this.ai.move(delta, this.ball);
};

Game.prototype.checkCollisions = function() {
  var game = this;

  this.allObjects().forEach(function(obj1) {
    game.allObjects().forEach(function(obj2) {
      if (obj1 instanceof Ball && obj2 instanceof Ball) { return;}

      if (obj1 instanceof Ball && obj1.isCollided(obj2)) {
        obj1.vel[0] = -(obj1.vel[0]);
      }
    });
  });
};

Game.prototype.step = function(delta, ctx) {
  this.moveObjects(delta);
  this.checkCollisions();
};


module.exports = Game;

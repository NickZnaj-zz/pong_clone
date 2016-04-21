var Ball = require('./ball');
var Paddle = require('./paddle');
var Particle = require('./particle');
var ScoreBoard = require('./scoreboard');
var PADDLE_DEFAULTS = require('./paddle_constants');


var mouse = {};

var Game = function() {
  this.ball = [];
  this.paddle = null;
  this.ai = null;

  this.mouse = {};

  this.DIM_X = 900;
  this.DIM_Y = 600;

  this.score = {human: 0, ai: 0};
  this.scoreBoard = new ScoreBoard(this);

  this.addBall();
  this.addPaddle();
  this.addAi();

  this.particles = [];
};

Game.DIM_X = 900;
Game.DIM_Y  = 600;
Game.BG_COLOR = "#000000";


Game.prototype.add = function(object) {
  if (object instanceof Ball){
    this.ball.push(object);
  } else if(object instanceof Paddle && object.human) {
    this.paddle = object;
  } else if ( object instanceof Paddle && !object.human) {
    this.ai = object;
  } else {
    throw 'how did you...?';
  }
};

Game.prototype.draw = function(ctx) {
  ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
  ctx.fillStyle = Game.BG_COLOR;
  ctx.fillRect(0, 0, this.DIM_X, this.DIM_Y);
  ctx.rect = (0, 0, this.DIM_X, this.DIM_Y);
  ctx.strokeStyle = "purple";
  // ctx.stroke();
  ctx.font = "100px 'Press Start 2P'";

  this.allObjects().forEach(function (object) {

    if (object instanceof Ball) {
      object.ctx = ctx;
    }
    object.draw(ctx);
  });
};

Game.prototype.allObjects  = function() {
  return [].concat(this.scoreBoard, this.paddle, this.ai, this.ball);
};

Game.prototype.addBall = function() {
  var ball = new Ball({
    pos: [this.DIM_X / 2, this.DIM_Y / 2],
    canvasSize: []
  });

  ball.canvasSize.push(this.DIM_X);
  ball.canvasSize.push(this.DIM_Y);
  this.add(ball);
  return ball;
};

Game.prototype.addPaddle = function() {
  var paddle = new Paddle({
    game: this,
    canvasSize: [],
    pos: []
  });
  paddle.canvasSize.push(this.DIM_X);
  paddle.canvasSize.push(this.DIM_Y);
  paddle.pos =
    [0,
     this.DIM_Y / 2 - PADDLE_DEFAULTS.HEIGHT / 2];
  paddle.human = true;
  this.add(paddle);
  return paddle;
};

Game.prototype.addAi = function() {
  var ai = new Paddle({
    game: this,
    canvasSize: [],
    pos: [],
    width: PADDLE_DEFAULTS.WIDTH
  });
  ai.canvasSize.push(this.DIM_X);
  ai.canvasSize.push(this.DIM_Y);

  ai.pos =
  [this.DIM_X - PADDLE_DEFAULTS.WIDTH,
   this.DIM_Y / 2 - PADDLE_DEFAULTS.HEIGHT / 2];
  ai.human = false;

  this.add(ai);
  return ai;
};

Game.prototype.moveObjects = function(delta){
  this.ball[0].move(delta);
  this.ai.move({delta: delta, ball: this.ball});
};

Game.prototype.checkCollisions = function() {
  var game = this;

  this.allObjects().forEach(function(obj1) {
    game.allObjects().forEach(function(obj2) {
      if (obj1 instanceof Ball && obj2 instanceof Ball) { return;}

      if (obj1 instanceof Ball && obj2 instanceof Paddle && obj1.isCollided(obj2)) {
        obj1.bounceOff(obj1.collisionPoint, obj2.human);

        // for(var i = 0; i < 20; i++) {
        //   this.particles.push(new Particle.createParticles(obj1.pos[0], obj1.pos[1], 5));
        // }
        // Particle.emitParticles();
      }
    }.bind(this));
  }.bind(this));
};

Game.prototype.checkIfPoint = function(){
  if (this.ball[0].pos[0] < this.paddle.pos[0] + this.paddle.width) {
    this.score.ai += 1;
    this.ball[0].reset([this.DIM_X / 2, this.DIM_Y / 2]);
  }
  if (this.ball[0].pos[0] > this.ai.pos[0]) {
    this.score.human += 1;
    this.ball[0].reset([this.DIM_X / 2, this.DIM_Y / 2]);
  }
  return false;
};

Game.prototype.step = function(delta, ctx) {
  this.checkCollisions();
  this.moveObjects(delta);
  this.checkIfPoint();
};




module.exports = Game;

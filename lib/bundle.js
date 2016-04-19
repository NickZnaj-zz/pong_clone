/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(1);
	var GameView = __webpack_require__(8);
	
	document.addEventListener("DOMContentLoaded", function(){
	  var canvasEl = document.getElementsByTagName("canvas")[0];
	  canvasEl.width = Game.DIM_X;
	  canvasEl.height = Game.DIM_Y;
	
	  var ctx = canvasEl.getContext("2d");
	  var game = new Game();
	  new GameView(game, ctx, canvasEl).start();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Ball = __webpack_require__(2);
	var Paddle = __webpack_require__(4);
	var Particle = __webpack_require__(6);
	var ScoreBoard = __webpack_require__(7);
	var PADDLE_DEFAULTS = __webpack_require__(5);
	
	
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
	        obj1.bounceOff(obj1.collisionPoint);
	
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	var Paddle = __webpack_require__(4);
	
	
	var DEFAULTS = {
	  COLOR: "#d00",
	  RADIUS:  10,
	  VELOCITY: [5, 5],
	  POS: [300, 300]
	};
	
	var Ball = function (options) {
	  this.pos = options.pos || DEFAULTS.POS;
	  this.vel = [0, 0];
	  this.radius = DEFAULTS.RADIUS;
	  this.color = "purple";
	  this.canvasSize = [];
	  this.pastPositions = [];
	};
	
	Ball.prototype.startMoving = function() {
	  this.vel = DEFAULTS.VELOCITY;
	};
	
	Ball.prototype.draw = function(ctx) {
	  if (this.pastPositions.length > 10)  this.pastPositions.splice(0, 1);
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
	
	    ctx.fillStyle = "#aaa";
	
	    ctx.beginPath();
	    ctx.arc(el[0], el[1], this.radius, 0, 2 * Math.PI, true);
	    ctx.fill();
	  }.bind(this));
	
	};
	
	Ball.prototype.bounceOff = function(surface){
	  if (surface === "top" || surface === "bottom"){
	    this.vel[1] = -(this.vel[1]);
	  }
	  if (surface === "side") {
	    this.vel[0] = -(this.vel[0]);
	  }
	  console.log(surface);
	  console.log(this.shiftY);
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
	
	
	    this.vel[0] *= 1.0005;
	    this.vel[1] *= 1.0005;
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
	
	Ball.prototype.reset = function(pos){
	  this.pos = pos;
	  this.vel = [0,0];
	};
	
	
	
	
	module.exports = Ball;


/***/ },
/* 3 */
/***/ function(module, exports) {

	var Util = {
	  inherits: function(ChildClass, BaseClass) {
	    function Surrogate() { this.constructor = ChildClass;}
	    Surrogate.prototype = BaseClass.prototype;
	    ChildClass.prototype = new Surrogate();
	  },
	
	  dist: function(pos1, pos2) {
	
	    return Math.sqrt(
	      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
	    );
	  },
	
	  slope: function(y1, y2, x1, x2) {
	    var slope = (y1 - y2) / (x1 - x2);
	
	    return slope;
	  },
	
	  extrapolatePoint: function(slope, x1, x2, y2) {
	    var collisionY =
	    slope*(x1 - x2) + y2;
	
	    return collisionY;
	  }
	};
	
	module.exports = Util;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	var PADDLE_DEFAULTS = __webpack_require__(5);
	
	
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
	      if (options.mouse.y > this.canvasSize[1]-this.height){
	        this.pos[1] = this.canvasSize[1] - this.height;
	      } else this.pos[1] = options.mouse.y;
	    } else{
	      this.pos[0] += options.move[0];
	
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
	    ((ball.pos[0] < this.pos[0]) && (ball.vel[0] < 0)) ||
	    (ball.vel[0] === 0)
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


/***/ },
/* 5 */
/***/ function(module, exports) {

	var PADDLE_DEFAULTS = {
	  COLOR: "#aaa",
	  WIDTH: 10,
	  HEIGHT: 80
	};
	
	module.exports = PADDLE_DEFAULTS;


/***/ },
/* 6 */
/***/ function(module, exports) {

	var Particle = function() {
	
	};
	
	Particle.prototype.emitParticles = function() {
		for(var j = 0; j < 20; j++) {
			par = particles[j];
	
			ctx.beginPath();
			ctx.fillStyle = "white";
			if (par.radius > 0) {
				ctx.arc(par.x, par.y, par.radius, 0, Math.PI*2, false);
			}
			ctx.fill();
	
			par.x += par.vx;
			par.y += par.vy;
	
			par.radius = Math.max(par.radius - 0.05, 0.0);
	
		}
	};
	
	Particle.prototype.createParticles = function(x, y, m) {
		this.x = x || 0;
		this.y = y || 0;
	
		this.radius = 1.2;
	
		this.vx = -1.5 + Math.random()*3;
		this.vy = m * Math.random()*1.5;
	};
	
	module.exports = Particle;


/***/ },
/* 7 */
/***/ function(module, exports) {

	var ScoreBoard = function(game) {
	  this.game = game;
	};
	
	ScoreBoard.prototype.draw = function(ctx) {
	  ctx.fillStyle = "#aaa";
	  // ctx.font = "100px 'Press Start 2P'";
	  ctx.fillText(this.game.score.human, this.game.DIM_X / 3, this.game.DIM_Y / 2);
	  ctx.fillText(this.game.score.ai, (this.game.DIM_X / 3) * 2, this.game.DIM_Y / 2);
	
	  ctx.beginPath();
	  ctx.moveTo(this.game.DIM_X / 2, 0);
	  ctx.lineTo(this.game.DIM_X / 2, this.game.DIM_Y);
	  ctx.lineWidth = 10;
	
	  ctx.strokeStyle = "#aaa";
	  ctx.stroke();
	};
	
	module.exports = ScoreBoard;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(1);
	
	var GameView = function(game, ctx, canvasEl) {
	  this.ctx = ctx;
	  this.game = game;
	  this.canvasEl = canvasEl;
	};
	
	GameView.MOVES = {
	  "up": [0, -20],
	  "down": [0, 20]
	};
	
	 var startBtn = {
	   width: 200,
	   height: 100,
	   x: 900/2,
	   y: 600/2 - 50,
	
	   draw: function(ctx) {
	    // ctx.beginPath();
	    // ctx.rect = (this.x, this.y, this.width, this.height);
	    // ctx.lineWidth = 5;
	    // ctx.strokeStyle = "blue";
	    // ctx.stroke();
	
	    ctx.font = "24px 'Press Start 2P'";
	    ctx.textAlign = "center";
	    ctx.textBaseline = "middle";
	    ctx.fillStyle = "white";
			ctx.fillText("Press Space to Pong", this.x, this.y );
		}
	};
	
	var restartBtn = {
		width: 200,
		height: 100,
		x: Game.DIM_X / 2,
		y: Game.DIM_Y / 2,
	
		draw: function(ctx) {
	    // ctx.beginPath();
	    // ctx.rect = (this.x, this.y, this.width, this.height);
	    // ctx.lineWidth = 5;
	    // ctx.strokeStyle = "blue";
	    // ctx.stroke();
	
			ctx.font = "24px 'Press Start 2P'";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillStyle = "white";
			ctx.fillText("Restart", this.x, this.y - 25 );
		}
	};
	
	GameView.prototype.trackPosition = function(e) {
	  this.game.ball[0].shiftY = e.movementY;
	  this.game.mouse.x = e.offsetX;
	  this.game.mouse.y = e.offsetY - this.game.paddle.height / 2;
	  this.game.paddle.move({mouse: this.game.mouse});
	};
	
	GameView.prototype.bindKeyHandlers = function () {
	  var paddle = this.game.paddle;
	  Object.keys(GameView.MOVES).forEach(function(k) {
	    var move = GameView.MOVES[k];
	    var options = {move: move, ball: this.game.ball};
	    key(k, "all", function (){paddle.move(options);
	    }.bind(this));
	  }.bind(this));
	
	  key("space", function(){ this.startRound(); }.bind(this));
	};
	
	GameView.prototype.newGame = function(){
	  this.game = new Game();
	  this.start();
	};
	
	GameView.prototype.startRound = function() {
	  this.game.ball[0].startMoving();
	};
	
	GameView.prototype.btnClick = function(e) {
	  var mouseX = e.offsetX,
		    mouseY = e.offsetY;
	  console.log(mouseX + "   " + mouseY);
	  console.log(restartBtn.x + "   " + restartBtn.y);
	
		// if(mouseX >= startBtn.x && mouseX <= startBtn.x + startBtn.width) {
		// 	this.start();
		// }
	
	  if (this.gameOver()){
	    if (mouseX >= restartBtn.x && mouseX <= restartBtn.x + restartBtn.width &&
	        mouseY >= restartBtn.y && mouseY <= restartBtn.y + restartBtn.height){
	      this.newGame();
	    }
	  }
	  this.canvasEl.removeEventListener("mousedown", this.btnClick);
	};
	
	GameView.prototype.start = function () {
	
	  this.canvasEl.addEventListener("mousemove", this.trackPosition.bind(this), true);
	  this.canvasEl.addEventListener("mousedown", this.btnClick.bind(this), true);
	
	  this.bindKeyHandlers();
	  this.lastTime = 0;
	  requestAnimationFrame(this.animate.bind(this));
	};
	
	GameView.prototype.animate = function(time){
	  if(this.gameOver()) {
	    console.log("game over");
	    window.cancelAnimationFrame(requestAnimationFrame(this.animate.bind(this)));
	    restartBtn.draw(this.ctx);
	  }
	  else{
	    if (this.game.ball[0].vel[0] === 0) {
	      startBtn.draw(this.ctx);
	    }
	    var timeDelta = time - this.lastTime;
	    if (timeDelta > 5) {
	    this.game.step(timeDelta);
	    this.game.draw(this.ctx);
	    this.lastTime = time;
	    requestAnimationFrame(this.animate.bind(this));}
	  }
	
	};
	
	GameView.prototype.gameOver = function(){
	  return (
	    this.game.score.human  >= 3 ||
	    this.game.score.ai  >= 3
	  );
	
	};
	
	
	module.exports = GameView;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map
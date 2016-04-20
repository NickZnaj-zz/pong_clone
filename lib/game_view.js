var Game = require('./game');

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

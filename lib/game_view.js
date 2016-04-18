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
	x: 600/2 - 50,
	y: 600/2 - 25,

	draw: function(ctx) {
		ctx.strokeStyle = "blue";
		ctx.lineWidth = "2";
		ctx.strokeRect(this.x, this.y, this.width, this.height);

    ctx.font = "24px 'Press Start 2P'";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStyle = "white";
		ctx.fillText("Press Space to Pong", 600/2, 600/2 - 25 );
	}
};

var restartBtn = {
	width: 200,
	height: 100,
	x: 600/2 - 50,
	y: 600/2 - 50,

	draw: function(ctx) {
		ctx.font = "24px 'Press Start 2P'";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStyle = "white";
		ctx.fillText("Restart", 600/2, 600/2 - 25 );
	}
};

GameView.prototype.trackPosition = function(e) {
  this.game.mouse.x = e.pageX;
  this.game.mouse.y = e.pageY;
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

GameView.prototype.startRound = function() {
  this.game.ball[0].startMoving();
};

GameView.prototype.btnClick = function(e) {
  var mouseX = e.pageX,
	    mouseY = e.pageY;

	if(mouseX >= startBtn.x && mouseX <= startBtn.x + startBtn.width) {
		this.start();
	}

  if (this.gameOver()){
    if (mouseX >= restartBtn.x && mouseX <= restartBtn.x + restartBtn.w){
      this.start();
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
    this.game = new Game();
    restartBtn.draw(this.ctx);
  }
  else{
    startBtn.draw(this.ctx);
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

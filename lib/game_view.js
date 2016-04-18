var GameView = function(game, ctx, canvasEl) {
  this.ctx = ctx;
  this.game = game;
  this.canvasEl = canvasEl;
  this.game.mouse = {};
};

GameView.MOVES = {
  "up": [0, -20],
  "down": [0, 20]
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
};


GameView.prototype.btnClick = function(e) {
      var mx = e.pageX,
			    my = e.pageY;

	if(mx >= startBtn.x && mx <= startBtn.x + startBtn.w) {
		animloop();

		startBtn = {};
	}

	if(over == 1) {
		if(mx >= restartBtn.x && mx <= restartBtn.x + restartBtn.w) {
			ball.x = 20;
			ball.y = 20;
			points = 0;
			ball.vx = 4;
			ball.vy = 8;
			animloop();

			over = 0;
		}
	}
};

GameView.prototype.start = function () {

  this.canvasEl.addEventListener("mousemove", this.trackPosition.bind(this), true);
  this.canvasEl.addEventListener("mousedown", this.btnClick.bind(this), true);

  this.bindKeyHandlers();
  this.lastTime = 0;
  requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.animate = function(time){
  var timeDelta = time - this.lastTime;
  if (timeDelta > 5) {
  this.game.step(timeDelta);
  this.game.draw(this.ctx);
  this.lastTime = time; }

  requestAnimationFrame(this.animate.bind(this));
};

module.exports = GameView;

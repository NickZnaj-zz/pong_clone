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
};

GameView.prototype.bindKeyHandlers = function () {
  var paddle = this.game.paddle;
  Object.keys(GameView.MOVES).forEach(function(k) {
    var move = GameView.MOVES[k];
    key(k, function () {paddle.move(move, this.game.ball);
      debugger
    }.bind(this));
  }.bind(this));
};


function btnClick(e) {

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
}

GameView.prototype.start = function () {

  this.canvasEl.addEventListener("mousemove", this.trackPosition.bind(this), true);
  this.canvasEl.addEventListener("mousedown", btnClick, true);

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

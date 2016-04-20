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

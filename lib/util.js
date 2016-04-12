var Util = {
  inherits: function(ChildClass, BaseClass) {
    function Surrogate() { this.constructor = ChildClass;}
    Surrogate.prototype = BaseClass.prototype;
    ChildClass.prototype = new Surrogate();
  },

  dist: function(ballPos, paddlePos) {
    return Math.sqrt(
      Math.pow(ballPos[0] - paddlePos[0], 2) + Math.pow(ballPos[1] - paddlePos[1], 2)
    );
  }
};

module.exports = Util;

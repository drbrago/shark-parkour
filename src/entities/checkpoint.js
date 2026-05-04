(function () {
  "use strict";

  var SharkParkour = window.SharkParkour || (window.SharkParkour = {});
  var C = SharkParkour.Constants;

  class Checkpoint {
    constructor(data, index) {
      this.x = data.x;
      this.y = data.y;
      this.w = 28;
      this.h = 72;
      this.index = index;
      this.active = false;
      this.respawn = {
        x: data.x - 18,
        y: data.y - C.PLAYER_HEIGHT
      };
    }

    getBounds() {
      return {
        x: this.x - 8,
        y: this.y - this.h + 8,
        w: this.w + 16,
        h: this.h
      };
    }
  }

  SharkParkour.Checkpoint = Checkpoint;
})();

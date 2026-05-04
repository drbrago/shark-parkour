(function () {
  "use strict";

  var SharkParkour = window.SharkParkour || (window.SharkParkour = {});

  class Spike {
    constructor(data) {
      this.x = data.x;
      this.y = data.y;
      this.w = data.w;
      this.h = data.h;
    }

    getBounds() {
      // A slightly smaller hit box keeps the visible triangles fair and forgiving.
      return {
        x: this.x + 5,
        y: this.y + 8,
        w: this.w - 10,
        h: this.h - 8
      };
    }
  }

  SharkParkour.Spike = Spike;
})();

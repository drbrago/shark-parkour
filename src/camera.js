(function () {
  "use strict";

  var SharkParkour = window.SharkParkour || (window.SharkParkour = {});
  var C = SharkParkour.Constants;
  var clamp = SharkParkour.Collision.clamp;

  class Camera {
    constructor(levelWidth, levelHeight) {
      this.x = 0;
      this.y = 0;
      this.width = C.CANVAS_WIDTH;
      this.height = C.CANVAS_HEIGHT;
      this.levelWidth = levelWidth;
      this.levelHeight = levelHeight;
    }

    follow(target, dt) {
      var desiredX = target.x + target.w / 2 - this.width * 0.42;
      var maxX = Math.max(0, this.levelWidth - this.width);

      // Smooth horizontal follow, then clamp so the camera never shows outside the level.
      this.x += (desiredX - this.x) * Math.min(1, dt * 8);
      this.x = clamp(this.x, 0, maxX);
      this.y = 0;
    }
  }

  SharkParkour.Camera = Camera;
})();

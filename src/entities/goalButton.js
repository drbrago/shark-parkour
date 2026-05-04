(function () {
  "use strict";

  var SharkParkour = window.SharkParkour || (window.SharkParkour = {});

  class GoalButton {
    constructor(data) {
      this.x = data.x;
      this.y = data.y;
      this.w = data.w;
      this.h = data.h;
      this.pressed = false;
    }

    getBounds() {
      return {
        x: this.x,
        y: this.y,
        w: this.w,
        h: this.h
      };
    }
  }

  SharkParkour.GoalButton = GoalButton;
})();

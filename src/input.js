(function () {
  "use strict";

  var SharkParkour = window.SharkParkour || (window.SharkParkour = {});

  var ACTIONS = Object.freeze({
    left: ["ArrowLeft", "KeyA"],
    right: ["ArrowRight", "KeyD"],
    jump: ["Space", "KeyW"],
    restart: ["KeyR"],
    interact: ["KeyE"]
  });

  function isGameKey(code) {
    return Object.keys(ACTIONS).some(function (action) {
      return ACTIONS[action].indexOf(code) !== -1;
    });
  }

  class Input {
    constructor(target) {
      this.target = target || window;
      this.down = new Set();
      this.pressed = new Set();
      this.released = new Set();

      this.target.addEventListener("keydown", this.handleKeyDown.bind(this));
      this.target.addEventListener("keyup", this.handleKeyUp.bind(this));
      window.addEventListener("blur", this.clear.bind(this));
    }

    handleKeyDown(event) {
      if (!isGameKey(event.code)) {
        return;
      }

      event.preventDefault();
      if (!event.repeat && !this.down.has(event.code)) {
        this.pressed.add(event.code);
      }
      this.down.add(event.code);
    }

    handleKeyUp(event) {
      if (!isGameKey(event.code)) {
        return;
      }

      event.preventDefault();
      this.down.delete(event.code);
      this.released.add(event.code);
    }

    isDown(action) {
      return ACTIONS[action].some(function (code) {
        return this.down.has(code);
      }, this);
    }

    wasPressed(action) {
      return ACTIONS[action].some(function (code) {
        return this.pressed.has(code);
      }, this);
    }

    wasReleased(action) {
      return ACTIONS[action].some(function (code) {
        return this.released.has(code);
      }, this);
    }

    axisX() {
      var left = this.isDown("left") ? 1 : 0;
      var right = this.isDown("right") ? 1 : 0;
      return right - left;
    }

    clearTransient() {
      this.pressed.clear();
      this.released.clear();
    }

    clear() {
      this.down.clear();
      this.clearTransient();
    }
  }

  SharkParkour.Input = Input;
})();

(function () {
  "use strict";

  window.addEventListener("DOMContentLoaded", function () {
    var canvas = document.getElementById("game");
    if (!canvas) {
      throw new Error("Game canvas with id 'game' was not found.");
    }

    var input = new window.SharkParkour.Input(window);
    window.SharkParkour.loadBackground().then(function (background) {
      var game = new window.SharkParkour.Game(canvas, input, background);
      game.start();
      window.SharkParkour.game = game;
    });
  });
})();

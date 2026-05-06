(function () {
  "use strict";

  var SharkParkour = window.SharkParkour || (window.SharkParkour = {});
  var C = SharkParkour.Constants;
  var OLD_GROUND_Y = 456;
  var GROUND_Y = C.GROUND_Y;
  var GROUND_SHIFT = GROUND_Y - OLD_GROUND_Y;
  var LAVA_Y = C.CANVAS_HEIGHT - 44;
  var LAVA_HEIGHT = 64;

  function groundPlatform(x, width) {
    return {
      x: x,
      y: GROUND_Y,
      w: width,
      h: C.GROUND_PLATFORM_HEIGHT
    };
  }

  function shiftedPlatform(x, y, width, height) {
    return {
      x: x,
      y: y + GROUND_SHIFT,
      w: width,
      h: height
    };
  }

  function groundSpike(x, width, height) {
    return {
      x: x,
      y: GROUND_Y - height,
      w: width,
      h: height
    };
  }

  function lavaZone(x, width) {
    return {
      x: x + 4,
      y: LAVA_Y,
      width: width - 8,
      height: LAVA_HEIGHT
    };
  }

  // Level data is deliberately plain objects so additional levels can be added
  // later without changing the player, collision, camera, or rendering systems.
  SharkParkour.Level = {
    name: "Downtown Dash",
    width: 3900,
    height: 540,
    killY: 590,
    playerStart: { x: 96, y: GROUND_Y - C.PLAYER_HEIGHT },
    platforms: [
      groundPlatform(0, 470),
      groundPlatform(535, 430),
      groundPlatform(1040, 320),
      groundPlatform(1435, 520),
      groundPlatform(2015, 365),
      groundPlatform(2448, 385),
      groundPlatform(2928, 420),
      groundPlatform(3410, 490),

      shiftedPlatform(380, 388, 105, 22),
      shiftedPlatform(700, 394, 140, 22),
      shiftedPlatform(1180, 374, 145, 22),
      shiftedPlatform(1585, 382, 130, 22),
      shiftedPlatform(1850, 334, 150, 22),
      shiftedPlatform(2240, 380, 120, 22),
      shiftedPlatform(2620, 360, 140, 22),
      shiftedPlatform(3100, 370, 160, 22),
      shiftedPlatform(3600, 392, 145, 22)
    ],
    spikes: [
      groundSpike(1558, 32, 26),
      groundSpike(2138, 32, 26),
      groundSpike(2174, 32, 26),
      groundSpike(3030, 32, 26),
      groundSpike(3066, 32, 26),
      groundSpike(3190, 32, 26),
      groundSpike(3525, 32, 26),
      groundSpike(3562, 32, 26)
    ],
    lavaZones: [
      lavaZone(470, 65),
      lavaZone(965, 75),
      lavaZone(1360, 75),
      lavaZone(1955, 60),
      lavaZone(2380, 68),
      lavaZone(2833, 95),
      lavaZone(3348, 62)
    ],
    checkpoints: [
      { x: 745, y: GROUND_Y },
      { x: 1685, y: GROUND_Y },
      { x: 2570, y: GROUND_Y },
      { x: 3265, y: GROUND_Y }
    ],
    goalButton: { x: 3740, y: GROUND_Y - 33, w: 74, h: 33 }
  };
})();

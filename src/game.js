(function () {
  "use strict";

  var SharkParkour = window.SharkParkour || (window.SharkParkour = {});
  var C = SharkParkour.Constants;
  var rectsOverlap = SharkParkour.Collision.rectsOverlap;
  var distanceBetweenRects = SharkParkour.Collision.distanceBetweenRects;

  class Game {
    constructor(canvas, input, background) {
      if (!canvas || !canvas.getContext) {
        throw new Error("A valid canvas is required to start Shark Parkour.");
      }

      this.canvas = canvas;
      this.input = input;
      this.renderer = new SharkParkour.Renderer(canvas);
      this.background = background || SharkParkour.createCityBackground();
      this.level = cloneLevel(SharkParkour.Level);
      this.camera = new SharkParkour.Camera(this.level.width, this.level.height);
      this.player = new SharkParkour.Player(this.level.playerStart);
      this.spikes = this.level.spikes.map(function (data) {
        return new SharkParkour.Spike(data);
      });
      this.checkpoints = this.level.checkpoints.map(function (data, index) {
        return new SharkParkour.Checkpoint(data, index);
      });
      this.goalButton = new SharkParkour.GoalButton(this.level.goalButton);
      this.lava = new SharkParkour.LavaSystem(this.level.lavaZones);
      this.respawnPoint = {
        x: this.level.playerStart.x,
        y: this.level.playerStart.y
      };
      this.activeCheckpointIndex = -1;
      this.message = "";
      this.messageTimer = 0;
      this.state = "playing";
      this.time = 0;
      this.lastTimestamp = 0;
      this.rafId = 0;
    }

    start() {
      this.lastTimestamp = performance.now();
      this.rafId = requestAnimationFrame(this.loop.bind(this));
    }

    loop(timestamp) {
      var dt = Math.min((timestamp - this.lastTimestamp) / 1000, C.FRAME_TIME_LIMIT);
      this.lastTimestamp = timestamp;
      this.update(dt);
      this.renderer.render(this);
      this.input.clearTransient();
      this.rafId = requestAnimationFrame(this.loop.bind(this));
    }

    update(dt) {
      this.time += dt;
      if (this.messageTimer > 0) {
        this.messageTimer -= dt;
      }

      this.lava.update(dt);

      if (this.input.wasPressed("restart")) {
        this.respawn("Back to checkpoint");
        if (this.state === "won") {
          this.goalButton.pressed = false;
          this.state = "playing";
        }
      }

      if (this.state === "won") {
        this.camera.follow(this.player, dt);
        return;
      }

      this.player.update(dt, this.input, this.level);
      this.checkCheckpointContacts();
      this.checkHazards();
      this.checkGoal();
      this.camera.follow(this.player, dt);
    }

    checkCheckpointContacts() {
      var playerBounds = this.player.getBounds();
      for (var i = 0; i < this.checkpoints.length; i += 1) {
        var checkpoint = this.checkpoints[i];
        if (!rectsOverlap(playerBounds, checkpoint.getBounds())) {
          continue;
        }

        if (this.activeCheckpointIndex !== checkpoint.index) {
          this.activeCheckpointIndex = checkpoint.index;
          this.respawnPoint = {
            x: checkpoint.respawn.x,
            y: checkpoint.respawn.y
          };
          this.setCheckpointActive(checkpoint.index);
          this.showMessage("Checkpoint reached", C.CHECKPOINT_MESSAGE_TIME);
        }
      }
    }

    setCheckpointActive(index) {
      for (var i = 0; i < this.checkpoints.length; i += 1) {
        this.checkpoints[i].active = this.checkpoints[i].index <= index;
      }
    }

    checkHazards() {
      var playerBounds = this.player.getBounds();
      if (this.player.y > this.level.killY) {
        this.respawn("Splash! Try again");
        return;
      }

      for (var i = 0; i < this.spikes.length; i += 1) {
        if (rectsOverlap(playerBounds, this.spikes[i].getBounds())) {
          this.respawn("Ouch! Back to checkpoint");
          return;
        }
      }

      if (this.lava.collidesWith(playerBounds)) {
        this.respawn("Too hot! Back to checkpoint");
        return;
      }
    }

    checkGoal() {
      if (!this.isPlayerNearGoal()) {
        return;
      }

      if (this.input.wasPressed("interact")) {
        this.goalButton.pressed = true;
        this.state = "won";
        this.showMessage("You win!", C.WIN_MESSAGE_TIME);
      }
    }

    isPlayerNearGoal() {
      return distanceBetweenRects(this.player.getBounds(), this.goalButton.getBounds()) <= C.INTERACTION_RANGE ||
        rectsOverlap(this.player.getBounds(), this.goalButton.getBounds());
    }

    respawn(message) {
      this.player.spawnAt(this.respawnPoint);
      this.showMessage(message, C.CHECKPOINT_MESSAGE_TIME);
    }

    showMessage(message, duration) {
      this.message = message;
      this.messageTimer = duration;
    }
  }

  function cloneLevel(level) {
    return {
      name: level.name,
      width: level.width,
      height: level.height,
      killY: level.killY,
      playerStart: clonePoint(level.playerStart),
      platforms: level.platforms.map(cloneRect),
      spikes: level.spikes.map(cloneRect),
      lavaZones: (level.lavaZones || []).map(cloneZone),
      checkpoints: level.checkpoints.map(clonePoint),
      goalButton: cloneRect(level.goalButton)
    };
  }

  function cloneRect(rect) {
    return {
      x: rect.x,
      y: rect.y,
      w: rect.w,
      h: rect.h
    };
  }

  function clonePoint(point) {
    return {
      x: point.x,
      y: point.y
    };
  }

  function cloneZone(zone) {
    return {
      x: zone.x,
      y: zone.y,
      width: zone.width,
      height: zone.height
    };
  }

  SharkParkour.Game = Game;
})();

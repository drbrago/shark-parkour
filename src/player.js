(function () {
  "use strict";

  var SharkParkour = window.SharkParkour || (window.SharkParkour = {});
  var C = SharkParkour.Constants;
  var clamp = SharkParkour.Collision.clamp;

  class Player {
    constructor(start) {
      this.w = C.PLAYER_WIDTH;
      this.h = C.PLAYER_HEIGHT;
      this.spawnAt(start);
    }

    spawnAt(point) {
      this.x = point.x;
      this.y = point.y;
      this.vx = 0;
      this.vy = 0;
      this.facing = 1;
      this.grounded = false;
      this.coyoteTimer = 0;
      this.jumpBufferTimer = 0;
      this.invulnerableTimer = C.RESPAWN_INVULNERABLE_TIME;
    }

    getBounds() {
      return {
        x: this.x,
        y: this.y,
        w: this.w,
        h: this.h
      };
    }

    update(dt, input, level) {
      if (this.invulnerableTimer > 0) {
        this.invulnerableTimer -= dt;
      }

      if (input.wasPressed("jump")) {
        this.jumpBufferTimer = C.JUMP_BUFFER_TIME;
      } else {
        this.jumpBufferTimer -= dt;
      }

      if (this.grounded) {
        this.coyoteTimer = C.COYOTE_TIME;
      } else {
        this.coyoteTimer -= dt;
      }

      var move = input.axisX();
      var acceleration = this.grounded ? C.GROUND_ACCELERATION : C.AIR_ACCELERATION;
      var targetVx = move * C.MOVE_SPEED;

      if (move !== 0) {
        this.vx = moveToward(this.vx, targetVx, acceleration * dt);
        this.facing = move > 0 ? 1 : -1;
      } else if (this.grounded) {
        this.vx = moveToward(this.vx, 0, C.FRICTION * dt);
      } else {
        this.vx = moveToward(this.vx, 0, C.FRICTION * 0.28 * dt);
      }

      if (this.jumpBufferTimer > 0 && this.coyoteTimer > 0) {
        this.vy = C.JUMP_VELOCITY;
        this.grounded = false;
        this.coyoteTimer = 0;
        this.jumpBufferTimer = 0;
      }

      if (input.wasReleased("jump") && this.vy < 0) {
        this.vy *= C.JUMP_CUT_MULTIPLIER;
      }

      this.vy = clamp(this.vy + C.GRAVITY * dt, -1200, C.MAX_FALL_SPEED);

      // Resolve each axis separately so platform contacts stay stable.
      this.moveAndCollideX(this.vx * dt, level.platforms);
      this.moveAndCollideY(this.vy * dt, level.platforms);
      this.x = clamp(this.x, 0, level.width - this.w);
    }

    moveAndCollideX(amount, platforms) {
      this.x += amount;

      for (var i = 0; i < platforms.length; i += 1) {
        var platform = platforms[i];
        if (!overlaps(this, platform)) {
          continue;
        }

        if (amount > 0) {
          this.x = platform.x - this.w - C.EPSILON;
        } else if (amount < 0) {
          this.x = platform.x + platform.w + C.EPSILON;
        }
        this.vx = 0;
      }
    }

    moveAndCollideY(amount, platforms) {
      this.y += amount;
      this.grounded = false;

      for (var i = 0; i < platforms.length; i += 1) {
        var platform = platforms[i];
        if (!overlaps(this, platform)) {
          continue;
        }

        if (amount > 0) {
          this.y = platform.y - this.h - C.EPSILON;
          this.vy = 0;
          this.grounded = true;
        } else if (amount < 0) {
          this.y = platform.y + platform.h + C.EPSILON;
          this.vy = 0;
        }
      }
    }
  }

  function moveToward(value, target, maxDelta) {
    if (Math.abs(target - value) <= maxDelta) {
      return target;
    }
    return value + Math.sign(target - value) * maxDelta;
  }

  function overlaps(player, rect) {
    return (
      player.x < rect.x + rect.w &&
      player.x + player.w > rect.x &&
      player.y < rect.y + rect.h &&
      player.y + player.h > rect.y
    );
  }

  SharkParkour.Player = Player;
})();

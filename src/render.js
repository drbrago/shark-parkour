(function () {
  "use strict";

  var SharkParkour = window.SharkParkour || (window.SharkParkour = {});
  var C = SharkParkour.Constants;

  class Renderer {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.ctx.imageSmoothingEnabled = false;
      this.pixelFont = "16px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    }

    render(game) {
      var ctx = this.ctx;
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, C.CANVAS_WIDTH, C.CANVAS_HEIGHT);

      SharkParkour.drawBackground(ctx, game.background, game.camera, this.canvas);
      drawWorld(ctx, game);
      drawHud(ctx, game);
    }
  }

  function drawWorld(ctx, game) {
    var camera = game.camera;
    ctx.save();
    ctx.translate(-Math.round(camera.x), -Math.round(camera.y));

    drawPlatforms(ctx, game.level.platforms);

    for (var i = 0; i < game.spikes.length; i += 1) {
      drawSpike(ctx, game.spikes[i]);
    }

    for (var c = 0; c < game.checkpoints.length; c += 1) {
      drawCheckpoint(ctx, game.checkpoints[c], game.time);
    }

    drawGoalButton(ctx, game.goalButton, game.isPlayerNearGoal());
    drawPlayer(ctx, game.player, game.time);

    ctx.restore();
  }

  function drawPlatforms(ctx, platforms) {
    for (var i = 0; i < platforms.length; i += 1) {
      var p = platforms[i];
      ctx.fillStyle = "#514657";
      pixelRect(ctx, p.x, p.y, p.w, p.h);
      ctx.fillStyle = "#7a7780";
      pixelRect(ctx, p.x, p.y, p.w, 10);
      ctx.fillStyle = "#a6a1a4";
      pixelRect(ctx, p.x, p.y, p.w, 3);

      ctx.fillStyle = "#3c3540";
      for (var x = p.x + 8; x < p.x + p.w; x += 42) {
        pixelRect(ctx, x, p.y + 18, 24, 4);
      }
      for (var y = p.y + 34; y < p.y + p.h; y += 24) {
        pixelRect(ctx, p.x, y, p.w, 3);
      }
    }
  }

  function drawSpike(ctx, spike) {
    var count = Math.max(1, Math.floor(spike.w / 16));
    for (var i = 0; i < count; i += 1) {
      var x = spike.x + i * (spike.w / count);
      var w = spike.w / count;
      ctx.fillStyle = "#f5f6ff";
      ctx.beginPath();
      ctx.moveTo(Math.round(x), Math.round(spike.y + spike.h));
      ctx.lineTo(Math.round(x + w / 2), Math.round(spike.y));
      ctx.lineTo(Math.round(x + w), Math.round(spike.y + spike.h));
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#cdd3e3";
      ctx.beginPath();
      ctx.moveTo(Math.round(x + w / 2), Math.round(spike.y));
      ctx.lineTo(Math.round(x + w), Math.round(spike.y + spike.h));
      ctx.lineTo(Math.round(x + w / 2), Math.round(spike.y + spike.h));
      ctx.closePath();
      ctx.fill();
    }
  }

  function drawCheckpoint(ctx, checkpoint, time) {
    var poleX = checkpoint.x + 7;
    var baseY = checkpoint.y;
    var glow = checkpoint.active ? 6 + Math.sin(time * 8) * 3 : 0;

    if (checkpoint.active) {
      ctx.fillStyle = "rgba(73, 228, 166, 0.22)";
      pixelRect(ctx, poleX - 10 - glow, baseY - 70 - glow, 44 + glow * 2, 80 + glow * 2);
    }

    ctx.fillStyle = "#24344b";
    pixelRect(ctx, poleX, baseY - 62, 6, 62);
    ctx.fillStyle = checkpoint.active ? "#49e4a6" : "#ffdf68";
    pixelRect(ctx, poleX + 6, baseY - 60, 32, 18);
    pixelRect(ctx, poleX + 6, baseY - 42, 22, 12);
    ctx.fillStyle = "#172234";
    pixelRect(ctx, poleX - 8, baseY - 4, 30, 8);
  }

  function drawGoalButton(ctx, button, isNear) {
    ctx.fillStyle = "#2b3448";
    pixelRect(ctx, button.x - 12, button.y + button.h - 4, button.w + 24, 12);
    ctx.fillStyle = button.pressed ? "#62e0a3" : "#ef5757";
    pixelRect(ctx, button.x, button.y, button.w, button.h);
    ctx.fillStyle = button.pressed ? "#b7ffd7" : "#ffd5d5";
    pixelRect(ctx, button.x + 10, button.y + 5, button.w - 20, 8);
    ctx.fillStyle = "#172234";
    pixelText(ctx, "E", button.x + button.w / 2 - 5, button.y + 23, "14px monospace");

    if (isNear && !button.pressed) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      pixelText(ctx, "Press E", button.x - 1, button.y - 14, "14px monospace");
    }
  }

  function drawPlayer(ctx, player, time) {
    var px = Math.round(player.x);
    var py = Math.round(player.y);
    var flip = player.facing < 0;
    var bob = player.grounded ? Math.round(Math.sin(time * 18) * 1) : 0;

    ctx.save();
    if (flip) {
      ctx.translate(px + player.w, py + bob);
      ctx.scale(-1, 1);
      px = 0;
      py = 0;
    } else {
      ctx.translate(px, py + bob);
      px = 0;
      py = 0;
    }

    if (player.invulnerableTimer > 0 && Math.floor(time * 18) % 2 === 0) {
      ctx.globalAlpha = 0.55;
    }

    ctx.fillStyle = "#1a82c4";
    pixelRect(ctx, px + 7, py + 8, 22, 17);
    pixelRect(ctx, px + 18, py + 5, 15, 15);
    pixelRect(ctx, px + 5, py + 14, 30, 10);

    ctx.fillStyle = "#6fd0ff";
    pixelRect(ctx, px + 13, py + 19, 22, 6);
    pixelRect(ctx, px + 23, py + 12, 7, 5);

    ctx.fillStyle = "#11659d";
    pixelRect(ctx, px + 14, py + 3, 8, 8);
    pixelRect(ctx, px + 1, py + 12, 8, 6);
    pixelRect(ctx, px - 2, py + 9, 6, 5);
    pixelRect(ctx, px - 2, py + 18, 6, 5);

    ctx.fillStyle = "#eff9ff";
    pixelRect(ctx, px + 28, py + 9, 4, 4);
    ctx.fillStyle = "#172234";
    pixelRect(ctx, px + 30, py + 10, 2, 2);

    ctx.fillStyle = "#103f6b";
    pixelRect(ctx, px + 12, py + 25, 5, 7);
    pixelRect(ctx, px + 25, py + 25, 5, 7);
    ctx.fillStyle = "#273041";
    pixelRect(ctx, px + 8, py + 31, 10, 4);
    pixelRect(ctx, px + 22, py + 31, 10, 4);

    ctx.restore();
  }

  function drawHud(ctx, game) {
    ctx.fillStyle = "rgba(13, 22, 34, 0.68)";
    pixelRect(ctx, 14, 14, 490, 58);
    ctx.fillStyle = "#edf6ff";
    pixelText(ctx, "A/D or Arrows: Move   Space/W: Jump   R: Checkpoint", 28, 38, "15px monospace");
    pixelText(ctx, "Reach the city button and press E", 28, 60, "15px monospace");

    if (game.messageTimer > 0) {
      ctx.fillStyle = "rgba(13, 22, 34, 0.76)";
      ctx.font = "20px monospace";
      var textWidth = ctx.measureText(game.message).width;
      pixelRect(ctx, C.CANVAS_WIDTH / 2 - textWidth / 2 - 18, 88, textWidth + 36, 42);
      ctx.fillStyle = "#ffffff";
      pixelText(ctx, game.message, C.CANVAS_WIDTH / 2 - textWidth / 2, 115, "20px monospace");
    }

    if (game.state === "won") {
      ctx.fillStyle = "rgba(10, 18, 30, 0.82)";
      pixelRect(ctx, 216, 174, 528, 166);
      ctx.fillStyle = "#62e0a3";
      pixelText(ctx, "COURSE COMPLETE!", 328, 232, "34px monospace");
      ctx.fillStyle = "#edf6ff";
      pixelText(ctx, "The shark made it through downtown.", 274, 274, "18px monospace");
      pixelText(ctx, "Press R to replay from your latest checkpoint.", 252, 306, "16px monospace");
    }
  }

  function pixelRect(ctx, x, y, w, h) {
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  function pixelText(ctx, text, x, y, font) {
    ctx.font = font;
    ctx.textBaseline = "top";
    ctx.fillText(text, Math.round(x), Math.round(y));
  }

  SharkParkour.Renderer = Renderer;
})();

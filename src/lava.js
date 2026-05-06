(function () {
  "use strict";

  var SharkParkour = window.SharkParkour || (window.SharkParkour = {});
  var rectsOverlap = SharkParkour.Collision.rectsOverlap;

  class LavaSystem {
    constructor(lavaZones) {
      this.zones = (lavaZones || []).map(normalizeZone);
      this.particles = [];
      this.rng = createRng(909);

      for (var i = 0; i < this.zones.length; i += 1) {
        this.zones[i].spawnTimer = randRange(this.rng, 0.2, 1.1);
      }
    }

    update(dt) {
      for (var i = 0; i < this.zones.length; i += 1) {
        var zone = this.zones[i];
        zone.spawnTimer -= dt;

        if (zone.spawnTimer <= 0) {
          this.spawnSmoke(zone);
          zone.spawnTimer = randRange(this.rng, 0.6, 1.8);
        }
      }

      for (var p = this.particles.length - 1; p >= 0; p -= 1) {
        var particle = this.particles[p];
        particle.age += dt;
        particle.x += particle.drift * dt;
        particle.y -= particle.speed * dt;

        if (particle.age >= particle.lifetime) {
          this.particles.splice(p, 1);
        }
      }
    }

    draw(ctx, camera, time) {
      for (var i = 0; i < this.zones.length; i += 1) {
        drawLavaZone(ctx, this.zones[i], time);
      }

      drawSmoke(ctx, this.particles);
    }

    collidesWith(rect) {
      for (var i = 0; i < this.zones.length; i += 1) {
        if (rectsOverlap(rect, this.zones[i])) {
          return true;
        }
      }
      return false;
    }

    spawnSmoke(zone) {
      var pieces = [];
      var pieceCount = randInt(this.rng, 2, 4);

      for (var i = 0; i < pieceCount; i += 1) {
        pieces.push({
          x: randInt(this.rng, -5, 8),
          y: randInt(this.rng, -5, 5),
          size: randInt(this.rng, 4, 8),
          color: ["#c8c8c8", "#a0a0a0", "#777777"][randInt(this.rng, 0, 2)]
        });
      }

      this.particles.push({
        x: zone.x + randRange(this.rng, 10, Math.max(10, zone.w - 10)),
        y: zone.y + randRange(this.rng, 1, 8),
        age: 0,
        lifetime: randRange(this.rng, 1.1, 1.9),
        speed: randRange(this.rng, 15, 28),
        drift: randRange(this.rng, -10, 10),
        pieces: pieces
      });
    }
  }

  function drawLavaZone(ctx, zone, time) {
    var x = Math.floor(zone.x);
    var y = Math.floor(zone.y);
    var width = Math.floor(zone.w);
    var height = Math.floor(zone.h);
    var phase = Math.floor(time * 8 + zone.x * 0.07);

    ctx.fillStyle = "#7a130d";
    pixelRect(ctx, x, y, width, height);

    ctx.fillStyle = "#c72612";
    pixelRect(ctx, x, y + 8, width, Math.max(0, height - 8));

    ctx.fillStyle = "#f05a18";
    pixelRect(ctx, x, y, width, 10);

    for (var sx = 0; sx < width; sx += 12) {
      var wave = positiveModulo(Math.floor(sx / 12) + phase, 4);
      var waveHeight = 4 + wave * 2;
      ctx.fillStyle = wave % 2 === 0 ? "#ff8a1c" : "#e83d13";
      pixelRect(ctx, x + sx, y - Math.min(3, wave), Math.min(12, width - sx), waveHeight);
    }

    for (var hx = 4; hx < width; hx += 28) {
      var offset = positiveModulo(hx + phase * 7, width);
      ctx.fillStyle = "#ffd64a";
      pixelRect(ctx, x + offset, y + 4 + positiveModulo(phase + hx, 3), Math.min(12, width - offset), 3);
    }

    ctx.fillStyle = "#4d0b09";
    pixelRect(ctx, x, y + height - 8, width, 8);
  }

  function drawSmoke(ctx, particles) {
    for (var i = 0; i < particles.length; i += 1) {
      var particle = particles[i];
      var alpha = Math.max(0, 1 - particle.age / particle.lifetime);

      ctx.save();
      ctx.globalAlpha = alpha * 0.75;

      for (var p = 0; p < particle.pieces.length; p += 1) {
        var piece = particle.pieces[p];
        ctx.fillStyle = piece.color;
        pixelRect(ctx, particle.x + piece.x, particle.y + piece.y, piece.size, piece.size);
      }

      ctx.restore();
    }
  }

  function normalizeZone(zone) {
    return {
      x: zone.x,
      y: zone.y,
      w: zone.w || zone.width,
      h: zone.h || zone.height
    };
  }

  function createRng(seed) {
    return function rng() {
      seed |= 0;
      seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function randInt(rng, min, max) {
    return Math.floor(rng() * (max - min + 1)) + min;
  }

  function randRange(rng, min, max) {
    return rng() * (max - min) + min;
  }

  function positiveModulo(value, divisor) {
    return ((value % divisor) + divisor) % divisor;
  }

  function pixelRect(ctx, x, y, w, h) {
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  SharkParkour.LavaSystem = LavaSystem;
})();

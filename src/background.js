(function () {
  "use strict";

  var SharkParkour = window.SharkParkour || (window.SharkParkour = {});

  var FALLBACK_SKY_COLOR = "#8ed4f6";
  var LAYER_DEFS = [
    {
      name: "sky",
      src: "assets/images/background/sky.png",
      scrollFactor: 0,
      repeat: false,
      alpha: 1
    },
    {
      name: "far-buildings",
      src: "assets/images/background/far-buildings.png",
      scrollFactor: 0.15,
      repeat: true,
      alpha: 1
    },
    {
      name: "mid-buildings",
      src: "assets/images/background/mid-buildings.png",
      scrollFactor: 0.35,
      repeat: true,
      alpha: 0.95
    },
    {
      name: "near-buildings",
      src: "assets/images/background/near-buildings.png",
      scrollFactor: 0.6,
      repeat: true,
      alpha: 0.9
    },
    {
      name: "street",
      src: "assets/images/background/street.png",
      scrollFactor: 0.85,
      repeat: true,
      alpha: 1
    }
  ];

  async function loadBackground() {
    var layers = await Promise.all(LAYER_DEFS.map(loadLayer));
    return {
      layers: layers
    };
  }

  function createCityBackground() {
    return {
      layers: LAYER_DEFS.map(function (definition) {
        return {
          name: definition.name,
          image: null,
          scrollFactor: definition.scrollFactor,
          repeat: definition.repeat,
          alpha: definition.alpha
        };
      })
    };
  }

  function drawBackground(ctx, background, camera, canvas) {
    if (!ctx || !canvas || !background || !background.layers) {
      drawSkyFallback(ctx, canvas);
      return;
    }

    ctx.save();
    ctx.imageSmoothingEnabled = false;

    var cameraX = camera ? camera.x : 0;
    var skyLayer = findLayer(background.layers, "sky");
    drawSky(ctx, skyLayer, cameraX, canvas);

    for (var i = 0; i < background.layers.length; i += 1) {
      var layer = background.layers[i];
      if (!layer || !layer.repeat) {
        continue;
      }

      drawRepeatingLayer(
        ctx,
        layer.image,
        cameraX,
        layer.scrollFactor,
        canvas.width,
        canvas.height,
        layer.alpha
      );
    }

    ctx.restore();
  }

  function loadLayer(definition) {
    return loadImage(definition.src, definition.name).then(function (image) {
      return {
        name: definition.name,
        image: image,
        scrollFactor: definition.scrollFactor,
        repeat: definition.repeat,
        alpha: definition.alpha
      };
    });
  }

  function loadImage(src, name) {
    return new Promise(function (resolve) {
      if (typeof Image === "undefined") {
        warnMissingImage(src, name);
        resolve(null);
        return;
      }

      var image = new Image();
      image.onload = function () {
        resolve(image);
      };
      image.onerror = function () {
        warnMissingImage(src, name);
        resolve(null);
      };
      image.src = src;
    });
  }

  function drawSky(ctx, layer, cameraX, canvas) {
    drawSkyFallback(ctx, canvas);

    if (!layer || !layer.image) {
      return;
    }

    drawCoverImage(ctx, layer.image, cameraX, layer.scrollFactor, canvas, layer.alpha);
  }

  function drawSkyFallback(ctx, canvas) {
    if (!ctx || !canvas) {
      return;
    }

    ctx.fillStyle = FALLBACK_SKY_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function drawCoverImage(ctx, image, cameraX, scrollFactor, canvas, alpha) {
    if (!image || !image.width || !image.height) {
      return;
    }

    var scale = Math.max(canvas.width / image.width, canvas.height / image.height);
    var sourceWidth = Math.min(image.width, Math.ceil(canvas.width / scale));
    var sourceHeight = Math.min(image.height, Math.ceil(canvas.height / scale));
    var maxSourceX = Math.max(0, image.width - sourceWidth);
    var sourceX = scrollFactor > 0 ? positiveModulo(cameraX * scrollFactor, Math.max(1, maxSourceX)) : maxSourceX / 2;
    var sourceY = Math.max(0, (image.height - sourceHeight) / 2);

    ctx.save();
    ctx.globalAlpha = alpha == null ? 1 : alpha;
    ctx.drawImage(
      image,
      Math.floor(sourceX),
      Math.floor(sourceY),
      sourceWidth,
      sourceHeight,
      0,
      0,
      canvas.width,
      canvas.height
    );
    ctx.restore();
  }

  function drawRepeatingLayer(ctx, image, cameraX, scrollFactor, canvasWidth, canvasHeight, alpha) {
    if (!image || !image.width || !image.height) {
      return;
    }

    var scale = canvasHeight / image.height;
    var drawWidth = image.width * scale;
    var drawHeight = canvasHeight;
    var offset = positiveModulo(cameraX * scrollFactor, drawWidth);

    ctx.save();
    ctx.globalAlpha = alpha == null ? 1 : alpha;

    for (var x = -offset; x < canvasWidth + drawWidth; x += drawWidth) {
      ctx.drawImage(
        image,
        Math.floor(x),
        0,
        Math.ceil(drawWidth),
        drawHeight
      );
    }

    ctx.restore();
  }

  function findLayer(layers, name) {
    for (var i = 0; i < layers.length; i += 1) {
      if (layers[i] && layers[i].name === name) {
        return layers[i];
      }
    }
    return null;
  }

  function warnMissingImage(src, name) {
    if (typeof console !== "undefined" && console.warn) {
      console.warn("Background layer failed to load:", name, src);
    }
  }

  function positiveModulo(value, divisor) {
    return ((value % divisor) + divisor) % divisor;
  }

  SharkParkour.loadBackground = loadBackground;
  SharkParkour.createCityBackground = createCityBackground;
  SharkParkour.drawBackground = drawBackground;
})();

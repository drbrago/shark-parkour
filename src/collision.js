(function () {
  "use strict";

  var SharkParkour = window.SharkParkour || (window.SharkParkour = {});

  function rectsOverlap(a, b) {
    return (
      a.x < b.x + b.w &&
      a.x + a.w > b.x &&
      a.y < b.y + b.h &&
      a.y + a.h > b.y
    );
  }

  function rectCenter(rect) {
    return {
      x: rect.x + rect.w / 2,
      y: rect.y + rect.h / 2
    };
  }

  function distanceBetweenRects(a, b) {
    var ac = rectCenter(a);
    var bc = rectCenter(b);
    var dx = ac.x - bc.x;
    var dy = ac.y - bc.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function expandedRect(rect, amount) {
    return {
      x: rect.x - amount,
      y: rect.y - amount,
      w: rect.w + amount * 2,
      h: rect.h + amount * 2
    };
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  SharkParkour.Collision = {
    rectsOverlap: rectsOverlap,
    distanceBetweenRects: distanceBetweenRects,
    expandedRect: expandedRect,
    clamp: clamp
  };
})();

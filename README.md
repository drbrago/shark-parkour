# Shark Parkour

A small 2D browser platformer made with plain HTML, CSS, JavaScript, and HTML Canvas. No React, Phaser, bundlers, package installs, or external assets are required.

## How To Run

Open `index.html` directly in a browser.

Optional local server:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Controls

- `A` or `Left Arrow`: move left
- `D` or `Right Arrow`: move right
- `Space` or `W`: jump
- `E`: press the goal button when near it
- `R`: restart from the latest checkpoint

## File Structure

```text
/
  index.html
  styles.css
  src/
    main.js
    game.js
    input.js
    player.js
    level.js
    background.js
    camera.js
    collision.js
    render.js
    constants.js
    entities/
      checkpoint.js
      spike.js
      goalButton.js
```

The scripts use a shared `window.SharkParkour` namespace so the game still works when opened through `file://`.

## Editing The Level

Edit `src/level.js`. The level is plain data:

- `playerStart`: shark starting position
- `platforms`: solid rectangles the player can stand on
- `spikes`: hazard rectangles drawn as pointy spikes
- `lavaZones`: animated pit hazards that respawn the player on contact
- `checkpoints`: checkpoint posts that update respawn
- `goalButton`: final button position and size
- `killY`: vertical fall line that triggers respawn
- `width` and `height`: level bounds

Add more platforms or checkpoints by appending objects to the arrays. Platforms and spikes use `{ x, y, w, h }`; lava zones use `{ x, y, width, height }`.

Ground-level platforms use `GROUND_Y` from `src/constants.js` so their top surface stays aligned with the decorative street background. Keep pits as gaps between ground platform segments rather than adding collision to the background image.

Add lava to a pit by appending a `{ x, y, width, height }` object to `lavaZones` in `src/level.js`. Lava is hazardous, smoke is decorative only, and falling below `killY` still respawns as a fallback.

## Editing The Background

Background assets live in `assets/images/background/`:

- `sky.png`
- `far-buildings.png`
- `mid-buildings.png`
- `near-buildings.png`
- `street.png`

Edit `src/background.js` to tune each layer's `scrollFactor`, `alpha`, or image path. `loadBackground()` loads all five images before the game loop starts. `drawBackground()` draws the sky to cover the canvas, then repeats the city layers horizontally using `camera.x` for parallax.

To replace a layer, put a new PNG at the same path or update that layer's `src` value in `src/background.js`. Background images are decorative only; they do not contain collision data and should not be treated as platforms, hazards, checkpoints, or goal objects.

## Manual Test Checklist

- Player can move left and right
- Player can jump
- Player collides with platforms
- Player dies in pits
- Player dies on lava
- Player dies on spikes
- Checkpoints update respawn
- `R` respawns at checkpoint
- Camera follows player
- Parallax background scrolls
- `E` completes the level at the button
# shark-parkour

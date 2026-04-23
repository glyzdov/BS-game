# BS-game — Beer Station Pub

Mobile web game (portrait only) based on a real craft-beer pub. The game is a collection of **mini-games, dialogs, and quests**. The player can play as the **bartender** or as a **guest**. Each mini-game may use its own camera (side 2D, top-down, isometric, character-centric).

## Conventions

- **Language:** all files in the repo (docs, code comments, commit messages, CLAUDE.md) are written in **English**. Chat with the user may be in Russian.
- **Orientation:** portrait only. Base canvas resolution `720 × 1280`, scaled with `Phaser.Scale.FIT` + `CENTER_BOTH`.
- **Small steps:** implement features incrementally. Do not rush or bundle unrelated changes.
- **Keep this file up to date** whenever the stack, structure, or workflow changes.

## Art direction

The game uses **pixel art**. All sprites, tiles, UI elements, and backgrounds are authored as pixel art and rendered with nearest-neighbor scaling.

- `pixelArt: true` and `roundPixels: true` in the Phaser config disable texture smoothing and snap draw positions to integer pixels.
- CSS `image-rendering: pixelated` keeps the canvas crisp when the browser upscales it to the physical screen.
- Target sprite sizes:
  - Icons / UI: 16×16, 24×24, 32×32
  - Characters: 32×32, 48×48, 64×64
  - Tiles: 16×16 or 32×32
  - Full scenes / backgrounds: 128×128 up to 360×640 (half of the game resolution, scales 2× cleanly)
- Color: start in **RGB** mode; switch specific assets to **Indexed** with a custom palette when we want a constrained retro look (e.g. a GB-style mini-game).
- Reference photos in `reference/` are for color, mood, and subject — not literal style. Translate them into pixel-art interpretations.

## Stack

- **Vite 8** — dev server and build
- **Phaser 4** — 2D game framework (scene manager, input, loader, tweens, physics available if needed)
- **Vanilla JavaScript** (ES modules), no TypeScript yet
- HTML/CSS overlay on top of the Phaser canvas for menus and dialogs when that is simpler than canvas text

## MCP servers

`.mcp.json` in the project root declares MCP servers shared with anyone who opens this repo in Claude Code.

- **`chrome-devtools`** — official Chrome DevTools MCP (`npx chrome-devtools-mcp@latest`). Used to open the running dev server in a real Chrome, take screenshots, read the console, inspect network, and run JS — so progress after each step can be verified visually and programmatically instead of asking the user to check the browser by hand.

After editing `.mcp.json`, the Claude Code session must be restarted for the server to load.

## Skills

Skills live under `.claude/skills/` and are auto-discovered by Claude Code.

- **`willibrandon-pixel-art-creator`** — canvas creation and low-level drawing primitives (pixels, lines, rectangles, circles, fills, palettes). **Use it as the default tool whenever a new sprite, tile, icon, or background is needed for BS-game.** The skill requires an **Aseprite MCP server** (it calls `mcp__aseprite__*` tools). Until the MCP server is configured in `.mcp.json`, the skill is consulted as a reference (sizes, color modes, palette/layer conventions) but cannot execute drawing — in that case, produced assets must be hand-made or generated elsewhere and placed in `src/assets/`.

### Phaser 4 gotcha

Phaser 4's ESM bundle exports only **named** exports — there is no default export.
Always import as:

```js
import * as Phaser from "phaser";
```

`import Phaser from "phaser"` will throw `does not provide an export named 'default'`.

## Project layout

```
.
├── index.html              # portrait viewport, iOS meta, loads src/main.js
├── package.json
├── .mcp.json               # project-scoped MCP servers (chrome-devtools)
├── reference/              # real photos and logo of Beer Station Pub — art direction source
├── src/
│   ├── main.js             # Phaser.Game config (720×1280, Scale.FIT), scene list
│   ├── styles.css          # full-viewport canvas, no scroll/zoom/select, 100dvh
│   └── scenes/
│       └── BootScene.js    # temporary title screen
└── CLAUDE.md               # this file
```

## Run

```sh
npm install
npm run dev       # starts Vite (http://localhost:5173 or next free port)
npm run build
npm run preview
```

## Current state

- Step 1 complete: Vite + Phaser 4 scaffold, portrait canvas, `BootScene` renders the "BEER STATION PUB" title. Verified in browser.
- Art direction set to pixel art. `pixelArt` + `roundPixels` enabled in Phaser; canvas CSS set to `image-rendering: pixelated`. Pixel-art creator skill registered in `.claude/skills/` (pending Aseprite MCP server to execute drawing).

## Next planned steps

1. **Main menu scene** with the BS logo (from `reference/`) and two buttons: *Play as bartender* / *Play as guest*.
2. **Scene / mini-game manager** — directory structure under `src/minigames/<name>/` with a registration pattern so each mini-game is a self-contained module (own scene, own camera, own input).
3. First concrete mini-game (candidate: **beer pong** — the real pub has a beer-pong table, visible in `reference/photo_2026-03-26_*.jpg`).
4. Dialog system (HTML overlay driving a simple reply tree).
5. Meta layer: money / reputation / quest progress shared across mini-games.

## Memory and skills

Cross-session notes live in the user-level Claude memory (not in the repo). When this file and memory disagree, CLAUDE.md wins for anything about the repo's code and structure; memory wins for user preferences and past feedback.

Skills/agents for scaffolding new mini-games and dialogs will be added **after** the scene manager exists, so they can codify a real proven structure rather than a guessed one.

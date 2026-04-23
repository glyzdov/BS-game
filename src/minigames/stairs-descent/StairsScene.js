import * as Phaser from "phaser";

const W = 720;
const H = 1280;

const COLOR_BG = 0x0a0a0a;
const COLOR_CREAM = 0xf1e6c9;
const COLOR_GOLD = 0xb8986a;
const COLOR_BRICK_DARK = 0x2a1a12;
const COLOR_BRICK_LIGHT = 0x3a251a;
const COLOR_WOOD_DARK = 0x1a120c;
const COLOR_WOOD_LIGHT = 0x2a1d12;
const COLOR_STUMBLE = 0x8a2a2a;

const CREAM_CSS = "#f1e6c9";
const GOLD_CSS = "#b8986a";

const WALL_W = 90;
const PLAY_X = WALL_W;
const PLAY_W = W - WALL_W * 2;
const LANE_W = PLAY_W / 2;
const LEFT_LANE_X = PLAY_X + LANE_W / 2;
const RIGHT_LANE_X = PLAY_X + LANE_W + LANE_W / 2;

const TARGET_Y = H - 260;
const SPAWN_Y = 180;
const MARKER_RADIUS = 46;

const STEP_COUNT = 20;
const STEP_INTERVAL_MS = 500;
const TRAVEL_MS = 1500;
const WINDOW_PERFECT = 60;
const WINDOW_GOOD = 150;
const MISS_MARGIN = 180;

const MAX_COMPOSURE = 3;

export class StairsScene extends Phaser.Scene {
  constructor() {
    super("StairsScene");
  }

  init(data) {
    this.role = data?.role ?? "guest";
  }

  create() {
    this.drawBackground();
    this.drawWalls();
    this.drawPlayfield();
    this.drawHud();
    this.drawCharacter();

    this.composure = MAX_COMPOSURE;
    this.stepIndex = 0;
    this.completed = 0;
    this.markers = [];
    this.finished = false;

    this.spawnStartTime = this.time.now + 400;
    for (let i = 0; i < STEP_COUNT; i++) {
      const side = i % 2 === 0 ? "L" : "R";
      this.markers.push({
        side,
        index: i,
        spawnTime: this.spawnStartTime + i * STEP_INTERVAL_MS,
        targetTime: this.spawnStartTime + i * STEP_INTERVAL_MS + TRAVEL_MS,
        tapped: false,
        resolved: false,
        gfx: null,
      });
    }

    this.setupInput();
  }

  drawBackground() {
    this.add.rectangle(0, 0, W, H, COLOR_BG).setOrigin(0, 0);
  }

  drawWalls() {
    const g = this.add.graphics();

    // Left wall — brick pattern
    g.fillStyle(COLOR_BRICK_DARK, 1);
    g.fillRect(0, 0, WALL_W, H);
    g.fillStyle(COLOR_BRICK_LIGHT, 1);
    const brickH = 20;
    const brickW = 42;
    for (let y = 0; y < H; y += brickH) {
      const offset = (y / brickH) % 2 === 0 ? 0 : brickW / 2;
      for (let x = -brickW; x < WALL_W; x += brickW) {
        g.fillRect(x + offset + 2, y + 2, brickW - 4, brickH - 4);
      }
    }

    // Right wall — vertical wooden planks
    g.fillStyle(COLOR_WOOD_DARK, 1);
    g.fillRect(W - WALL_W, 0, WALL_W, H);
    g.fillStyle(COLOR_WOOD_LIGHT, 1);
    const plankW = 22;
    for (let x = W - WALL_W + 2; x < W - 2; x += plankW) {
      g.fillRect(x, 0, plankW - 3, H);
    }

    // Inner borders
    g.lineStyle(2, COLOR_GOLD, 0.6);
    g.lineBetween(WALL_W, 0, WALL_W, H);
    g.lineBetween(W - WALL_W, 0, W - WALL_W, H);
  }

  drawPlayfield() {
    const g = this.add.graphics();

    // Lane divider
    g.lineStyle(1, COLOR_CREAM, 0.08);
    g.lineBetween(W / 2, 140, W / 2, H - 160);

    // Staircase decoration — faint horizontal ledges between spawn and target
    const steps = 8;
    const stepSpan = (TARGET_Y - SPAWN_Y) / steps;
    g.lineStyle(1, COLOR_CREAM, 0.06);
    for (let i = 0; i <= steps; i++) {
      const y = SPAWN_Y + i * stepSpan;
      g.lineBetween(PLAY_X + 10, y, W - PLAY_X - 10, y);
    }

    // Target line
    const tg = this.add.graphics();
    tg.lineStyle(2, COLOR_CREAM, 0.9);
    tg.lineBetween(PLAY_X + 6, TARGET_Y, W - PLAY_X - 6, TARGET_Y);
    // Target tick marks for each lane
    tg.fillStyle(COLOR_GOLD, 1);
    tg.fillTriangle(
      LEFT_LANE_X - 10, TARGET_Y - 14,
      LEFT_LANE_X + 10, TARGET_Y - 14,
      LEFT_LANE_X, TARGET_Y - 2,
    );
    tg.fillTriangle(
      RIGHT_LANE_X - 10, TARGET_Y - 14,
      RIGHT_LANE_X + 10, TARGET_Y - 14,
      RIGHT_LANE_X, TARGET_Y - 2,
    );
  }

  drawHud() {
    // Title strip
    this.add
      .text(W / 2, 40, "СПУСК ПО ЛЕСТНИЦЕ", {
        fontFamily: "Georgia, serif",
        fontSize: "18px",
        color: GOLD_CSS,
        letterSpacing: 4,
      })
      .setOrigin(0.5, 0);

    const roleRu = this.role === "bartender" ? "БАРМЕН" : "ГОСТЬ";
    this.roleLabel = this.add
      .text(W / 2, 68, roleRu, {
        fontFamily: "Georgia, serif",
        fontSize: "12px",
        color: CREAM_CSS,
        letterSpacing: 3,
      })
      .setOrigin(0.5, 0);

    // Composure label + pips
    this.add
      .text(PLAY_X, 104, "ВЫДЕРЖКА", {
        fontFamily: "Georgia, serif",
        fontSize: "12px",
        color: GOLD_CSS,
        letterSpacing: 2,
      })
      .setOrigin(0, 0);

    this.composurePips = [];
    for (let i = 0; i < MAX_COMPOSURE; i++) {
      const pip = this.add.rectangle(
        PLAY_X + 130 + i * 24,
        110,
        18,
        8,
        COLOR_CREAM,
      );
      this.composurePips.push(pip);
    }

    // Step counter
    this.stepText = this.add
      .text(W - PLAY_X, 104, `СТУПЕНЬ 0/${STEP_COUNT}`, {
        fontFamily: "Georgia, serif",
        fontSize: "12px",
        color: GOLD_CSS,
        letterSpacing: 2,
      })
      .setOrigin(1, 0);

    // Lane hints
    this.add
      .text(LEFT_LANE_X, H - 140, "ЛЕВАЯ", {
        fontFamily: "Georgia, serif",
        fontSize: "14px",
        color: GOLD_CSS,
        letterSpacing: 3,
      })
      .setOrigin(0.5);
    this.add
      .text(RIGHT_LANE_X, H - 140, "ПРАВАЯ", {
        fontFamily: "Georgia, serif",
        fontSize: "14px",
        color: GOLD_CSS,
        letterSpacing: 3,
      })
      .setOrigin(0.5);

    // Feedback text
    this.feedbackText = this.add
      .text(W / 2, TARGET_Y - 90, "", {
        fontFamily: "Georgia, serif",
        fontSize: "28px",
        color: CREAM_CSS,
        fontStyle: "bold",
        letterSpacing: 3,
      })
      .setOrigin(0.5)
      .setAlpha(0);
  }

  drawCharacter() {
    // Simple pixel-art silhouette at bottom-center built from rectangles.
    // Cream highlights on black body to read on dark bg.
    const cx = Math.round(W / 2);
    const baseY = H - 70;

    this.character = this.add.container(cx, baseY);

    const g = this.add.graphics();
    // Body
    g.fillStyle(0x1a1a1a, 1);
    g.fillRect(-14, -46, 28, 36); // torso
    g.fillRect(-16, -10, 12, 10); // left leg
    g.fillRect(4, -10, 12, 10); // right leg
    g.fillRect(-22, -42, 8, 18); // left arm
    g.fillRect(14, -42, 8, 18); // right arm
    // Head
    g.fillStyle(0xd9c69a, 1);
    g.fillRect(-10, -64, 20, 18);
    // Cream collar highlight
    g.fillStyle(COLOR_CREAM, 1);
    g.fillRect(-12, -46, 24, 3);
    // Face dot
    g.fillStyle(0x1a1a1a, 1);
    g.fillRect(-4, -56, 3, 3);
    g.fillRect(3, -56, 3, 3);

    this.character.add(g);
  }

  setupInput() {
    // Divide the screen vertically into two tap halves (entire lower area).
    const leftZone = this.add
      .zone(0, 0, W / 2, H)
      .setOrigin(0, 0)
      .setInteractive();
    const rightZone = this.add
      .zone(W / 2, 0, W / 2, H)
      .setOrigin(0, 0)
      .setInteractive();

    leftZone.on("pointerdown", () => this.handleTap("L"));
    rightZone.on("pointerdown", () => this.handleTap("R"));
  }

  update() {
    if (this.finished) return;

    const now = this.time.now;

    for (const m of this.markers) {
      if (m.resolved) continue;

      if (!m.gfx && now >= m.spawnTime) {
        m.gfx = this.createMarkerGfx(m);
      }

      if (m.gfx) {
        const t = Phaser.Math.Clamp(
          (now - m.spawnTime) / TRAVEL_MS,
          0,
          1 + MISS_MARGIN / TRAVEL_MS,
        );
        const y = SPAWN_Y + (TARGET_Y - SPAWN_Y) * t;
        m.gfx.setY(Math.round(y));

        if (now - m.targetTime > MISS_MARGIN) {
          this.resolveMiss(m);
        }
      }
    }

    if (
      this.completed >= STEP_COUNT &&
      this.markers.every((m) => m.resolved)
    ) {
      this.finish(true);
    }
  }

  createMarkerGfx(m) {
    const x = m.side === "L" ? LEFT_LANE_X : RIGHT_LANE_X;
    const container = this.add.container(x, SPAWN_Y);

    const ring = this.add.graphics();
    ring.lineStyle(3, COLOR_CREAM, 1);
    ring.strokeCircle(0, 0, MARKER_RADIUS);
    ring.fillStyle(COLOR_BG, 1);
    ring.fillCircle(0, 0, MARKER_RADIUS - 2);

    const letter = this.add
      .text(0, 0, m.side, {
        fontFamily: "Georgia, serif",
        fontSize: "44px",
        color: CREAM_CSS,
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    container.add([ring, letter]);
    return container;
  }

  handleTap(side) {
    if (this.finished) return;

    const now = this.time.now;

    // Find nearest unresolved marker on that side by |now - targetTime|.
    let best = null;
    let bestDelta = Infinity;
    for (const m of this.markers) {
      if (m.resolved || m.tapped) continue;
      if (!m.gfx) continue; // not spawned yet
      const d = Math.abs(now - m.targetTime);
      if (d < bestDelta && m.side === side) {
        bestDelta = d;
        best = m;
      }
    }

    // If the closest marker of EITHER side is a wrong-side one and very close
    // to the target, treat this tap as a wrong-side stumble on that marker.
    let closestAny = null;
    let closestAnyDelta = Infinity;
    for (const m of this.markers) {
      if (m.resolved || m.tapped) continue;
      if (!m.gfx) continue;
      const d = Math.abs(now - m.targetTime);
      if (d < closestAnyDelta) {
        closestAnyDelta = d;
        closestAny = m;
      }
    }

    if (
      closestAny &&
      closestAny.side !== side &&
      closestAnyDelta < WINDOW_GOOD
    ) {
      this.resolveWrongSide(closestAny);
      return;
    }

    if (!best || bestDelta > WINDOW_GOOD) {
      this.showFeedback("ОСЕЧКА", COLOR_STUMBLE);
      this.loseComposure();
      this.bumpCharacter(side, true);
      return;
    }

    best.tapped = true;
    best.resolved = true;
    this.completed += 1;
    this.stepText.setText(`СТУПЕНЬ ${this.completed}/${STEP_COUNT}`);

    if (bestDelta <= WINDOW_PERFECT) {
      this.showFeedback("ТОЧНО", COLOR_CREAM);
    } else {
      this.showFeedback("ХОРОШО", COLOR_GOLD);
    }

    this.flashMarker(best, true);
    this.bumpCharacter(side, false);
  }

  resolveMiss(m) {
    m.resolved = true;
    this.showFeedback("ПРОМАХ", COLOR_STUMBLE);
    this.flashMarker(m, false);
    this.loseComposure();
  }

  resolveWrongSide(m) {
    m.resolved = true;
    this.showFeedback("НЕ ТА НОГА", COLOR_STUMBLE);
    this.flashMarker(m, false);
    this.loseComposure();
  }

  flashMarker(m, success) {
    if (!m.gfx) return;
    const color = success ? COLOR_CREAM : COLOR_STUMBLE;
    this.tweens.add({
      targets: m.gfx,
      alpha: 0,
      scale: success ? 1.4 : 0.8,
      duration: 240,
      onComplete: () => m.gfx?.destroy(),
    });
    const flash = this.add.circle(m.gfx.x, m.gfx.y, MARKER_RADIUS + 10, color, 0.6);
    this.tweens.add({
      targets: flash,
      alpha: 0,
      scale: 1.8,
      duration: 320,
      onComplete: () => flash.destroy(),
    });
  }

  showFeedback(text, tint) {
    const color = Phaser.Display.Color.IntegerToColor(tint).rgba;
    this.feedbackText.setText(text);
    this.feedbackText.setColor(color);
    this.feedbackText.setAlpha(1);
    this.tweens.add({
      targets: this.feedbackText,
      alpha: 0,
      duration: 500,
      delay: 250,
    });
  }

  bumpCharacter(side, stumble) {
    const dx = side === "L" ? -6 : 6;
    this.tweens.add({
      targets: this.character,
      x: this.character.x + dx,
      y: this.character.y + (stumble ? 6 : -4),
      duration: 80,
      yoyo: true,
      ease: "Quad.easeOut",
    });
    if (stumble) {
      this.cameras.main.shake(120, 0.004);
    }
  }

  loseComposure() {
    this.composure = Math.max(0, this.composure - 1);
    const pip = this.composurePips[this.composure];
    if (pip) {
      pip.setFillStyle(COLOR_STUMBLE);
      this.tweens.add({
        targets: pip,
        alpha: 0.2,
        duration: 200,
      });
    }
    if (this.composure <= 0) {
      this.finish(false);
    }
  }

  finish(success) {
    if (this.finished) return;
    this.finished = true;

    const msg = success ? "ТЫ СПУСТИЛСЯ" : "ТЫ УПАЛ";
    const color = success ? CREAM_CSS : "#8a2a2a";

    const overlay = this.add
      .rectangle(0, 0, W, H, COLOR_BG, 0.85)
      .setOrigin(0, 0);

    this.add
      .text(W / 2, H / 2 - 40, msg, {
        fontFamily: "Georgia, serif",
        fontSize: "40px",
        color,
        fontStyle: "bold",
        letterSpacing: 3,
      })
      .setOrigin(0.5);

    const hint = this.add
      .text(W / 2, H / 2 + 40, success ? "тап — дальше" : "тап — ещё раз", {
        fontFamily: "Georgia, serif",
        fontSize: "18px",
        color: GOLD_CSS,
        letterSpacing: 2,
      })
      .setOrigin(0.5);

    overlay.setInteractive();
    overlay.on("pointerdown", () => {
      if (success) {
        this.scene.start("DialogScene", { role: this.role });
      } else {
        this.scene.restart({ role: this.role });
      }
    });

    // Suppress the lane tap zones so they don't intercept the overlay tap.
    this.input.enabled = true;
    hint; // keep ref to avoid unused linting
  }
}

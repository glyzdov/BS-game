import * as Phaser from "phaser";

// Character-centric dialog scene: bald bartender behind the counter,
// brick wall with 12 chalk beer tags + flags and wall-mounted taps.
// Style reference: reference/photo_2026-01-18_00-03-59.jpg
// (three bald bartenders, grid of numbered chalk tags with flags).

const W = 720;
const H = 1280;

const BLACK = 0x0a0a0a;
const CREAM = 0xf1e6c9;
const CREAM_CSS = "#f1e6c9";
const GOLD = 0xb8986a;
const GOLD_CSS = "#b8986a";

const BRICK = 0x2a1410;
const BRICK_HI = 0x3a1c16;
const MORTAR = 0x140805;
const WOOD = 0x3a2416;
const WOOD_DARK = 0x24160c;
const WOOD_HI = 0x5a3826;
const CHALK = 0x0e0e0e;
const CHALK_FRAME = 0x2a2420;
const AMBER = 0xd99a3a;

// Bartender palette — bald man with light stubble
const SKIN = 0xd8ae88;
const SKIN_SHADE = 0xb08868;
const STUBBLE = 0x4a3826;
const BROW = 0x2a1a10;
const HOODIE = 0x6a4a2e;
const HOODIE_SHADE = 0x4a321e;
const HOODIE_HI = 0x8a6a42;

// 12 beer tags — number, name, mini-flag palette.
// Flag is a 3-stripe motif (top, mid, bottom colors).
const BEERS = [
  { name: "PILS", flag: [0xdd0000, 0xffffff, 0xdd0000] },   // AT-ish red/white
  { name: "LAGER", flag: [0x000000, 0xdd0000, 0xffcc00] },  // DE
  { name: "WHEAT", flag: [0x0057b7, 0xffd500, 0x0057b7] },  // UA
  { name: "IPA",   flag: [0x012169, 0xffffff, 0xc8102e] },  // UK
  { name: "STOUT", flag: [0x009a49, 0xffffff, 0xff7900] },  // IE
  { name: "PORTER",flag: [0xdc143c, 0xffffff, 0xdc143c] },  // PL
  { name: "APA",   flag: [0xb22234, 0xffffff, 0x3c3b6e] },  // US
  { name: "SOUR",  flag: [0xfecc00, 0xce1126, 0x002664] },  // LT
  { name: "DUBBEL",flag: [0x000000, 0xffd90c, 0xfdda24] },  // BE
  { name: "TRIPEL",flag: [0xae1c28, 0xffffff, 0x21468b] },  // NL
  { name: "HELLES",flag: [0x002868, 0xffffff, 0xbf0a30] },  // CZ-ish
  { name: "RAUCH", flag: [0xdc143c, 0xffffff, 0x004b87] },  // generic
];

export class DialogScene extends Phaser.Scene {
  constructor() {
    super("DialogScene");
  }

  init(data) {
    this.role = data?.role ?? "guest";
  }

  create() {
    this.add.rectangle(0, 0, W, H, BLACK).setOrigin(0, 0);

    this.drawBrickWall();
    this.drawBottleShelf();
    this.drawFlagBunting();
    this.drawTagWall();
    this.drawLamps();
    this.drawBartender();
    this.drawCounter();
    this.drawCounterItems();
    this.drawDialogBox();
  }

  // ---------- brick wall ----------

  drawBrickWall() {
    const g = this.add.graphics();
    g.fillStyle(BRICK, 1);
    g.fillRect(0, 0, W, 900);

    const brickH = 28;
    const brickW = 72;
    // Horizontal mortar
    g.fillStyle(MORTAR, 1);
    for (let y = 0; y <= 900; y += brickH) {
      g.fillRect(0, y, W, 2);
    }
    // Vertical mortar, offset every other row
    for (let row = 0; row * brickH < 900; row++) {
      const y = row * brickH;
      const off = row % 2 === 0 ? 0 : brickW / 2;
      for (let x = -brickW; x < W + brickW; x += brickW) {
        g.fillRect(x + off, y, 2, brickH);
      }
    }
    // Brick variation — random highlight / dark dots
    for (let i = 0; i < 420; i++) {
      const x = (i * 137) % W;
      const y = (i * 71) % 900;
      g.fillStyle(i % 3 === 0 ? BRICK_HI : MORTAR, 1);
      g.fillRect(x, y, 3, 2);
    }
  }

  // ---------- bottle shelf on the right ----------

  drawBottleShelf() {
    const g = this.add.graphics();
    // A single tall shelf on the right side with whiskey-like bottles.
    const x0 = W - 140;
    const x1 = W - 20;
    const ys = [180, 300];
    for (const sy of ys) {
      g.fillStyle(WOOD_DARK, 1);
      g.fillRect(x0, sy, x1 - x0, 10);
      g.fillStyle(WOOD_HI, 1);
      g.fillRect(x0, sy, x1 - x0, 2);
      const count = 3;
      const step = (x1 - x0) / count;
      for (let i = 0; i < count; i++) {
        this.drawBottle(g, x0 + 8 + i * step, sy - 54, i % 3);
      }
    }
    // Warm backlight behind shelf
    g.fillStyle(AMBER, 0.12);
    g.fillRect(x0 - 10, 150, x1 - x0 + 20, 220);
  }

  drawBottle(g, x, y, variant) {
    const body = variant === 0 ? 0x241414 : variant === 1 ? 0x3a2410 : 0x1f3a20;
    g.fillStyle(body, 1);
    g.fillRect(x + 5, y + 6, 4, 10);  // neck
    g.fillRect(x + 1, y + 16, 12, 36); // body
    g.fillStyle(GOLD, 1);
    g.fillRect(x + 5, y + 2, 4, 4);   // cap
    g.fillStyle(CREAM, 1);
    g.fillRect(x + 3, y + 26, 8, 10); // label
    g.fillStyle(body, 1);
    g.fillRect(x + 4, y + 29, 6, 1);
    g.fillRect(x + 4, y + 32, 6, 1);
    g.fillStyle(0xffffff, 0.2);
    g.fillRect(x + 2, y + 18, 1, 30);
  }

  // ---------- flag bunting across the top ----------

  drawFlagBunting() {
    const g = this.add.graphics();
    // String
    g.fillStyle(0x000000, 1);
    for (let x = 0; x < W; x += 2) {
      const y = 14 + Math.round(4 * Math.sin(x * 0.02));
      g.fillRect(x, y, 2, 1);
    }
    // Flags — small triangles hanging from string
    const palette = [
      0xdd0000, 0xffcc00, 0x0057b7, 0x009a49, 0xffffff,
      0xc8102e, 0x3c3b6e, 0xae1c28, 0x002868, 0xfecc00,
    ];
    const flagW = 28;
    const flagH = 22;
    for (let i = 0; i * (flagW + 8) < W - 20; i++) {
      const fx = 10 + i * (flagW + 8);
      const fy = 18;
      const c = palette[i % palette.length];
      g.fillStyle(c, 1);
      // Triangle hanging down
      for (let row = 0; row < flagH; row++) {
        const inset = Math.floor((row * (flagW / 2)) / flagH);
        g.fillRect(fx + inset, fy + row, flagW - inset * 2, 1);
      }
      g.fillStyle(0x000000, 0.3);
      g.fillRect(fx + 2, fy + flagH - 4, flagW - 4, 1);
    }
  }

  // ---------- 12 beer tags + 12 wall-mounted taps ----------

  drawTagWall() {
    const cols = 4;
    const rows = 3;
    const tagW = 140;
    const tagH = 110;
    const gapX = 16;
    const gapY = 14;
    const totalW = cols * tagW + (cols - 1) * gapX;
    const x0 = Math.round((W - totalW) / 2);
    const y0 = 90;

    const g = this.add.graphics();

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        const tx = x0 + c * (tagW + gapX);
        const ty = y0 + r * (tagH + gapY);
        this.drawBeerTag(g, tx, ty, tagW, tagH, idx + 1, BEERS[idx]);
        this.drawWallTap(g, tx + tagW / 2, ty + tagH - 4);
      }
    }
  }

  drawBeerTag(g, x, y, w, h, num, beer) {
    // Frame (slightly offset wood/metal look)
    g.fillStyle(CHALK_FRAME, 1);
    g.fillRect(x - 3, y - 3, w + 6, h + 6);
    // Chalkboard
    g.fillStyle(CHALK, 1);
    g.fillRect(x, y, w, h);
    // Chalk worn highlight along top edge
    g.fillStyle(0x2a2a2a, 0.5);
    g.fillRect(x, y, w, 2);
    // Tag nail
    g.fillStyle(0x888888, 1);
    g.fillRect(x + w / 2 - 2, y - 6, 4, 4);

    // Country flag stripe at left (3 horizontal bands)
    const flagW = 18;
    const flagH = 24;
    const fx = x + 6;
    const fy = y + 6;
    g.fillStyle(beer.flag[0], 1);
    g.fillRect(fx, fy, flagW, Math.floor(flagH / 3));
    g.fillStyle(beer.flag[1], 1);
    g.fillRect(fx, fy + Math.floor(flagH / 3), flagW, Math.floor(flagH / 3));
    g.fillStyle(beer.flag[2], 1);
    g.fillRect(
      fx,
      fy + 2 * Math.floor(flagH / 3),
      flagW,
      flagH - 2 * Math.floor(flagH / 3),
    );
    g.fillStyle(0x000000, 1);
    g.lineStyle(1, 0x000000, 1);
    g.strokeRect(fx, fy, flagW, flagH);

    // Chalk number (top-right)
    this.add
      .text(x + w - 10, y + 6, String(num), {
        fontFamily: "Georgia, serif",
        fontSize: "22px",
        color: CREAM_CSS,
        fontStyle: "bold",
      })
      .setOrigin(1, 0);

    // Chalk beer name — centered lower
    this.add
      .text(x + w / 2, y + 54, beer.name, {
        fontFamily: "Georgia, serif",
        fontSize: "18px",
        color: CREAM_CSS,
        fontStyle: "bold",
        letterSpacing: 2,
      })
      .setOrigin(0.5, 0.5);

    // Faux chalk scribbles — price line
    this.add
      .text(x + w / 2, y + 84, "0.5L", {
        fontFamily: "Georgia, serif",
        fontSize: "12px",
        color: GOLD_CSS,
        letterSpacing: 2,
      })
      .setOrigin(0.5, 0.5);
  }

  drawWallTap(g, cx, topY) {
    // Short brass tap mounted on the wall below the tag: vertical stem + spout.
    g.fillStyle(0x333333, 1);
    g.fillRect(cx - 8, topY, 16, 4);      // mount plate
    g.fillStyle(0xcfcfcf, 1);
    g.fillRect(cx - 3, topY + 4, 6, 14);  // stem
    g.fillStyle(GOLD, 1);
    g.fillRect(cx - 8, topY + 18, 16, 6); // nozzle
    g.fillStyle(CREAM, 1);
    g.fillRect(cx - 4, topY + 24, 8, 2);  // drip hole
  }

  // ---------- pendant lamps ----------

  drawLamps() {
    const g = this.add.graphics();
    const xs = [140, 360, 580];
    for (const x of xs) {
      // Cord from very top
      g.fillStyle(0x000000, 1);
      g.fillRect(x - 1, 0, 2, 62);
      g.fillStyle(0x141414, 1);
      g.fillRect(x - 16, 62, 32, 14);
      g.fillStyle(GOLD, 1);
      g.fillRect(x - 16, 74, 32, 2);
      // Warm halo
      g.fillStyle(AMBER, 0.22);
      g.fillCircle(x, 92, 60);
      g.fillStyle(AMBER, 0.5);
      g.fillCircle(x, 86, 18);
      g.fillStyle(CREAM, 1);
      g.fillRect(x - 3, 80, 6, 6);
    }
  }

  // ---------- bartender (bald, stubble, hoodie) ----------

  drawBartender() {
    const g = this.add.graphics();
    const cx = W / 2;

    // Shoulders/torso come out from counter level, head above counter.
    const headTop = 560;
    const headW = 110;
    const headH = 120;
    const headL = cx - headW / 2;

    // Neck shadow behind head
    g.fillStyle(SKIN_SHADE, 1);
    g.fillRect(cx - 28, headTop + headH - 16, 56, 30);

    // Bald head — rounded via pixel-circle approximation.
    this.fillPixelEllipse(g, cx, headTop + headH / 2, headW / 2, headH / 2, SKIN);

    // Head shading — right side slightly darker for form
    this.fillPixelEllipse(
      g,
      cx + 12,
      headTop + headH / 2 + 6,
      headW / 2 - 8,
      headH / 2 - 4,
      SKIN_SHADE,
      { mask: "right" },
    );

    // Top-of-head highlight (polished bald shine)
    g.fillStyle(0xffffff, 0.14);
    g.fillRect(cx - 22, headTop + 14, 40, 6);
    g.fillRect(cx - 14, headTop + 8, 24, 4);

    // Stubble pattern on scalp (very light dots near sides, suggesting shaved hairline)
    g.fillStyle(STUBBLE, 0.35);
    for (let i = 0; i < 30; i++) {
      const ang = (i / 30) * Math.PI; // upper half
      const rx = Math.cos(ang + Math.PI) * (headW / 2 - 6);
      const ry = Math.sin(ang + Math.PI) * (headH / 2 - 10);
      g.fillRect(Math.round(cx + rx), Math.round(headTop + headH / 2 + ry), 2, 2);
    }

    // Ears
    g.fillStyle(SKIN_SHADE, 1);
    g.fillRect(headL - 6, headTop + 56, 8, 22);
    g.fillRect(headL + headW - 2, headTop + 56, 8, 22);
    g.fillStyle(SKIN, 1);
    g.fillRect(headL - 4, headTop + 60, 4, 14);
    g.fillRect(headL + headW, headTop + 60, 4, 14);

    // Eyebrows
    g.fillStyle(BROW, 1);
    g.fillRect(cx - 28, headTop + 50, 18, 4);
    g.fillRect(cx + 10, headTop + 50, 18, 4);

    // Eyes (socket shade + iris + highlight)
    g.fillStyle(0x2a1a10, 1);
    g.fillRect(cx - 28, headTop + 58, 18, 10);
    g.fillRect(cx + 10, headTop + 58, 18, 10);
    g.fillStyle(CREAM, 1);
    g.fillRect(cx - 26, headTop + 60, 14, 6);
    g.fillRect(cx + 12, headTop + 60, 14, 6);
    g.fillStyle(0x3a2a1a, 1);
    g.fillRect(cx - 22, headTop + 60, 6, 6);
    g.fillRect(cx + 16, headTop + 60, 6, 6);
    g.fillStyle(0x000000, 1);
    g.fillRect(cx - 20, headTop + 62, 3, 3);
    g.fillRect(cx + 18, headTop + 62, 3, 3);
    g.fillStyle(0xffffff, 1);
    g.fillRect(cx - 17, headTop + 62, 1, 1);
    g.fillRect(cx + 21, headTop + 62, 1, 1);

    // Nose
    g.fillStyle(SKIN_SHADE, 1);
    g.fillRect(cx - 4, headTop + 68, 8, 18);
    g.fillStyle(SKIN, 1);
    g.fillRect(cx - 3, headTop + 70, 6, 14);

    // Stubble zone — full goatee/jawline shadow
    g.fillStyle(STUBBLE, 0.75);
    // Upper lip stubble (mustache area)
    g.fillRect(cx - 18, headTop + 86, 36, 5);
    // Chin / jaw stubble band
    g.fillRect(cx - 34, headTop + 96, 68, 18);
    // Soften edges
    g.fillStyle(STUBBLE, 0.4);
    g.fillRect(cx - 40, headTop + 94, 80, 4);
    g.fillRect(cx - 40, headTop + 114, 80, 4);

    // Mouth — closed slight smile
    g.fillStyle(0x3a1a12, 1);
    g.fillRect(cx - 12, headTop + 96, 24, 3);
    g.fillStyle(0x1a0a06, 1);
    g.fillRect(cx - 10, headTop + 98, 20, 1);

    // Shirt / hoodie
    const bodyTop = headTop + headH - 2;
    // Neck opening
    g.fillStyle(SKIN_SHADE, 1);
    g.fillRect(cx - 18, bodyTop - 4, 36, 10);
    // Hoodie main — clipped to the counter top so it doesn't peek below.
    const COUNTER_TOP = 840;
    g.fillStyle(HOODIE, 1);
    g.fillRect(cx - 140, bodyTop, 280, COUNTER_TOP - bodyTop);
    // Shoulders curve — add a bit of slope by darkening corners
    g.fillStyle(HOODIE_SHADE, 1);
    g.fillRect(cx - 140, bodyTop, 30, 12);
    g.fillRect(cx + 110, bodyTop, 30, 12);
    // Hood behind head — two lumps of hoodie fabric at shoulders
    g.fillStyle(HOODIE_SHADE, 1);
    g.fillRect(cx - 100, bodyTop + 4, 60, 26);
    g.fillRect(cx + 40, bodyTop + 4, 60, 26);
    // Hoodie drawstrings
    g.fillStyle(CREAM, 1);
    g.fillRect(cx - 14, bodyTop + 6, 2, 60);
    g.fillRect(cx + 12, bodyTop + 6, 2, 60);
    g.fillStyle(GOLD, 1);
    g.fillRect(cx - 16, bodyTop + 66, 6, 6);
    g.fillRect(cx + 10, bodyTop + 66, 6, 6);
    // Central zipper/print line
    g.fillStyle(HOODIE_SHADE, 1);
    g.fillRect(cx - 1, bodyTop + 30, 2, COUNTER_TOP - bodyTop - 30);
    // Hoodie highlight edge
    g.fillStyle(HOODIE_HI, 0.5);
    g.fillRect(cx - 140, bodyTop, 4, 160);

    // BS chest print
    this.add
      .text(cx, bodyTop + 110, "BS", {
        fontFamily: "Georgia, serif",
        fontSize: "28px",
        color: CREAM_CSS,
        fontStyle: "bold",
        letterSpacing: 3,
      })
      .setOrigin(0.5);
    this.add
      .text(cx, bodyTop + 140, "BEER STATION", {
        fontFamily: "Georgia, serif",
        fontSize: "12px",
        color: GOLD_CSS,
        letterSpacing: 3,
      })
      .setOrigin(0.5);
  }

  // Pixel ellipse (axis-aligned) filled in horizontal scanlines for a chunky look.
  fillPixelEllipse(g, cx, cy, rx, ry, color, opts = {}) {
    g.fillStyle(color, 1);
    for (let y = -ry; y <= ry; y++) {
      const dx = Math.floor(rx * Math.sqrt(1 - (y * y) / (ry * ry)));
      let xStart = cx - dx;
      let width = dx * 2 + 1;
      if (opts.mask === "right") {
        xStart = cx;
        width = dx + 1;
      }
      g.fillRect(xStart, cy + y, width, 1);
    }
  }

  // ---------- counter ----------

  drawCounter() {
    const g = this.add.graphics();
    const y = 840;
    g.fillStyle(WOOD_DARK, 1);
    g.fillRect(0, y, W, 120);
    g.fillStyle(WOOD, 1);
    g.fillRect(0, y, W, 16);
    g.fillStyle(WOOD_HI, 1);
    g.fillRect(0, y, W, 3);
    // Plank seams
    g.fillStyle(WOOD_DARK, 1);
    for (let x = 80; x < W; x += 140) {
      g.fillRect(x, y + 16, 2, 104);
    }
    // Front edge shadow
    g.fillStyle(0x000000, 0.45);
    g.fillRect(0, y + 110, W, 10);
    // Countertop grain
    g.fillStyle(WOOD_HI, 0.25);
    for (let i = 0; i < 40; i++) {
      const gx = (i * 71) % W;
      g.fillRect(gx, y + 8, 20, 1);
    }
  }

  drawCounterItems() {
    const g = this.add.graphics();
    const y = 840;
    // Pint on the left — full beer in front of the guest.
    this.drawPint(g, 70, y - 100);
    // Towel draped on counter
    g.fillStyle(CREAM, 1);
    g.fillRect(200, y - 6, 90, 16);
    g.fillStyle(0xa89272, 1);
    for (let i = 0; i < 5; i++) g.fillRect(210 + i * 16, y - 6, 2, 16);
    // Empty glass
    this.drawPint(g, W - 130, y - 100, true);
    // Small bowl of snacks (peanuts) center-counter
    g.fillStyle(0x1a1a1a, 1);
    g.fillRect(330, y - 14, 60, 18);
    g.fillStyle(GOLD, 1);
    for (let i = 0; i < 14; i++) {
      g.fillRect(334 + ((i * 4) % 52), y - 12 + ((i * 3) % 10), 3, 2);
    }
  }

  drawPint(g, x, y, empty = false) {
    g.fillStyle(0x2a2a2a, 1);
    g.fillRect(x, y, 56, 96);
    g.fillStyle(0xffffff, 0.14);
    g.fillRect(x + 4, y + 6, 4, 84);
    if (!empty) {
      g.fillStyle(AMBER, 1);
      g.fillRect(x + 4, y + 26, 48, 66);
      g.fillStyle(CREAM, 1);
      g.fillRect(x + 4, y + 14, 48, 12);
      g.fillRect(x + 2, y + 10, 52, 6);
    }
    g.fillStyle(CREAM, 0.6);
    g.fillRect(x, y, 56, 2);
    g.fillStyle(0x1a1a1a, 1);
    g.fillRect(x - 2, y + 94, 60, 4);
  }

  // ---------- dialog box ----------

  drawDialogBox() {
    const boxX = 30;
    const boxY = 980;
    const boxW = W - 60;
    const boxH = 260;

    const g = this.add.graphics();
    g.fillStyle(BLACK, 0.94);
    g.fillRect(boxX, boxY, boxW, boxH);
    g.lineStyle(3, CREAM, 1);
    g.strokeRect(boxX, boxY, boxW, boxH);
    g.lineStyle(1, GOLD, 1);
    g.strokeRect(boxX + 6, boxY + 6, boxW - 12, boxH - 12);

    this.add.text(boxX + 20, boxY + 12, "БАРМЕН", {
      fontFamily: "Georgia, serif",
      fontSize: "16px",
      color: GOLD_CSS,
      fontStyle: "bold",
      letterSpacing: 3,
    });

    const line =
      this.role === "bartender"
        ? "наконец-то. смена твоя — принимай стойку."
        : "добрался? присаживайся. что будешь?";

    this.add.text(boxX + 20, boxY + 46, line, {
      fontFamily: "Georgia, serif",
      fontSize: "20px",
      color: CREAM_CSS,
      wordWrap: { width: boxW - 40 },
      lineSpacing: 6,
    });

    const replies =
      this.role === "bartender"
        ? ["принять смену", "оглядеться"]
        : ["светлое, пожалуйста", "посмотрю меню"];

    replies.forEach((label, i) => {
      const y = boxY + 140 + i * 52;
      const rx = boxX + 20;
      const rw = boxW - 40;
      const rh = 44;
      const rg = this.add.graphics();
      rg.lineStyle(2, GOLD, 1);
      rg.strokeRect(rx, y, rw, rh);
      const hit = this.add
        .rectangle(rx, y, rw, rh, 0x000000, 0.001)
        .setOrigin(0, 0)
        .setInteractive({ useHandCursor: true });
      const t = this.add
        .text(rx + rw / 2, y + rh / 2, label, {
          fontFamily: "Georgia, serif",
          fontSize: "18px",
          color: CREAM_CSS,
          letterSpacing: 2,
        })
        .setOrigin(0.5);
      hit.on("pointerover", () => t.setColor(GOLD_CSS));
      hit.on("pointerout", () => t.setColor(CREAM_CSS));
      hit.on("pointerdown", () => this.scene.start("TitleScene"));
    });
  }
}

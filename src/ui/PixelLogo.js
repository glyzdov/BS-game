// Procedural pixel-art version of the Beer Station Pub badge.
// Builds a 128x128 texture once, scenes can display it as a sprite.

const SIZE = 128;
const BLACK = 0x0a0a0a;
const CREAM = 0xf1e6c9;
const GOLD = 0xb8986a;
const DARK = 0x050505;

const TEX_KEY = "bs_logo_px";

// 13x15 pixel monogram "BS" — two glyphs drawn side by side.
// 1 = cream pixel.
const B_GLYPH = [
  "111110",
  "100011",
  "100011",
  "100011",
  "111110",
  "111110",
  "100011",
  "100011",
  "100011",
  "111110",
];
const S_GLYPH = [
  "011111",
  "100000",
  "100000",
  "100000",
  "011110",
  "000001",
  "000001",
  "000001",
  "111110",
  "111110",
];

function drawGlyph(g, rows, ox, oy, px, color) {
  g.fillStyle(color, 1);
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[y].length; x++) {
      if (rows[y][x] === "1") {
        g.fillRect(ox + x * px, oy + y * px, px, px);
      }
    }
  }
}

// Filled circle via a scanline algorithm snapped to integer pixels.
function fillDisc(g, cx, cy, r, color) {
  g.fillStyle(color, 1);
  for (let y = -r; y <= r; y++) {
    const dx = Math.floor(Math.sqrt(r * r - y * y));
    g.fillRect(cx - dx, cy + y, dx * 2 + 1, 1);
  }
}

// Ring = disc minus inner disc (two passes).
function ring(g, cx, cy, rOuter, rInner, color) {
  fillDisc(g, cx, cy, rOuter, color);
  fillDisc(g, cx, cy, rInner, BLACK);
}

export function ensurePixelLogo(scene) {
  if (scene.textures.exists(TEX_KEY)) return TEX_KEY;

  const g = scene.make.graphics({ x: 0, y: 0, add: false });

  const cx = SIZE / 2;
  const cy = SIZE / 2;

  // Outer black disc with cream double-ring border.
  fillDisc(g, cx, cy, 62, CREAM);
  fillDisc(g, cx, cy, 60, BLACK);
  fillDisc(g, cx, cy, 58, CREAM);
  fillDisc(g, cx, cy, 56, BLACK);

  // Top arc text band — a cream arc strip where "BEER STATION PUB" sits.
  // Simulated as a thin gold band near the top.
  g.fillStyle(GOLD, 1);
  for (let a = -140; a <= -40; a += 1) {
    const rad = (a * Math.PI) / 180;
    const r = 48;
    const px = Math.round(cx + Math.cos(rad) * r);
    const py = Math.round(cy + Math.sin(rad) * r);
    g.fillRect(px, py, 2, 2);
  }

  // Bottom arc — "PREMIUM & CRAFT BEER" band.
  for (let a = 40; a <= 140; a += 1) {
    const rad = (a * Math.PI) / 180;
    const r = 48;
    const px = Math.round(cx + Math.cos(rad) * r);
    const py = Math.round(cy + Math.sin(rad) * r);
    g.fillRect(px, py, 2, 2);
  }

  // Side separator dots.
  g.fillStyle(CREAM, 1);
  g.fillRect(6, cy - 1, 4, 3);
  g.fillRect(SIZE - 10, cy - 1, 4, 3);

  // Central BS monogram. Each glyph is 6 columns * 10 rows, px=3 → 18x30.
  // Place them centered with a small gap.
  const px = 3;
  const glyphW = 6 * px;
  const glyphH = 10 * px;
  const gap = 4;
  const totalW = glyphW * 2 + gap;
  const baseX = Math.round(cx - totalW / 2);
  const baseY = Math.round(cy - glyphH / 2);

  // Cream drop shadow behind glyphs for weight.
  drawGlyph(g, B_GLYPH, baseX + 1, baseY + 1, px, DARK);
  drawGlyph(g, S_GLYPH, baseX + glyphW + gap + 1, baseY + 1, px, DARK);
  drawGlyph(g, B_GLYPH, baseX, baseY, px, CREAM);
  drawGlyph(g, S_GLYPH, baseX + glyphW + gap, baseY, px, CREAM);

  // Tiny hop leaves flanking the monogram (just suggested shapes).
  g.fillStyle(GOLD, 1);
  const hopY = baseY + glyphH + 6;
  // left hop
  g.fillRect(baseX - 10, hopY, 2, 2);
  g.fillRect(baseX - 12, hopY + 2, 6, 2);
  g.fillRect(baseX - 10, hopY + 4, 2, 2);
  // right hop
  const rx = baseX + totalW + 8;
  g.fillRect(rx, hopY, 2, 2);
  g.fillRect(rx - 2, hopY + 2, 6, 2);
  g.fillRect(rx, hopY + 4, 2, 2);

  g.generateTexture(TEX_KEY, SIZE, SIZE);
  g.destroy();

  return TEX_KEY;
}

export const PIXEL_LOGO_KEY = TEX_KEY;
export const PIXEL_LOGO_SIZE = SIZE;

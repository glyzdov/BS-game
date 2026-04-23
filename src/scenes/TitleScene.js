import * as Phaser from "phaser";
import { ensurePixelLogo, PIXEL_LOGO_KEY } from "../ui/PixelLogo.js";

const COLOR_BG = 0x0a0a0a;
const COLOR_CREAM = "#f1e6c9";
const COLOR_GOLD = "#b8986a";
const COLOR_CREAM_HEX = 0xf1e6c9;
const COLOR_GOLD_HEX = 0xb8986a;

export class TitleScene extends Phaser.Scene {
  constructor() {
    super("TitleScene");
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(0, 0, width, height, COLOR_BG).setOrigin(0, 0);

    ensurePixelLogo(this);
    const logo = this.add.image(width / 2, 360, PIXEL_LOGO_KEY);
    // Pixel logo is 128px; upscale by integer factor to stay crisp.
    logo.setScale(4);

    this.add
      .text(width / 2, 740, "ВЫБЕРИ РОЛЬ", {
        fontFamily: "Georgia, serif",
        fontSize: "22px",
        color: COLOR_GOLD,
        letterSpacing: 4,
      })
      .setOrigin(0.5);

    this.makeButton(width / 2, 860, "ВОЙТИ КАК ГОСТЬ", "guest");
    this.makeButton(width / 2, 1000, "ВОЙТИ КАК БАРМЕН", "bartender");

    this.add
      .text(width / 2, height - 40, "PREMIUM & CRAFT BEER", {
        fontFamily: "Georgia, serif",
        fontSize: "14px",
        color: COLOR_GOLD,
        letterSpacing: 3,
      })
      .setOrigin(0.5);
  }

  makeButton(x, y, label, role) {
    const w = 520;
    const h = 100;

    const bg = this.add
      .rectangle(x, y, w, h, COLOR_BG)
      .setStrokeStyle(2, COLOR_CREAM_HEX)
      .setInteractive({ useHandCursor: true });

    const text = this.add
      .text(x, y, label, {
        fontFamily: "Georgia, serif",
        fontSize: "32px",
        color: COLOR_CREAM,
        fontStyle: "bold",
        letterSpacing: 2,
      })
      .setOrigin(0.5);

    bg.on("pointerover", () => {
      bg.setFillStyle(COLOR_CREAM_HEX);
      text.setColor("#0a0a0a");
    });
    bg.on("pointerout", () => {
      bg.setFillStyle(COLOR_BG);
      text.setColor(COLOR_CREAM);
    });
    bg.on("pointerdown", () => {
      bg.setFillStyle(COLOR_GOLD_HEX);
      text.setColor("#0a0a0a");
    });
    bg.on("pointerup", () => {
      this.scene.start("StairsScene", { role });
    });
  }
}

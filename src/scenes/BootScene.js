import * as Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .rectangle(0, 0, width, height, 0x0a0a0a)
      .setOrigin(0, 0);

    this.add
      .text(width / 2, height / 2 - 40, "BEER STATION", {
        fontFamily: "serif",
        fontSize: "56px",
        color: "#f1e6c9",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 20, "PUB", {
        fontFamily: "serif",
        fontSize: "40px",
        color: "#f1e6c9",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 80, "PREMIUM & CRAFT BEER", {
        fontFamily: "serif",
        fontSize: "18px",
        color: "#b8986a",
        letterSpacing: 2,
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height - 60, "tap to start", {
        fontFamily: "sans-serif",
        fontSize: "16px",
        color: "#6b6b6b",
      })
      .setOrigin(0.5);
  }
}

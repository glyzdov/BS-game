import * as Phaser from "phaser";

const COLOR_BG = 0x0a0a0a;
const CREAM_CSS = "#f1e6c9";
const GOLD_CSS = "#b8986a";

export class PubScene extends Phaser.Scene {
  constructor() {
    super("PubScene");
  }

  init(data) {
    this.role = data?.role ?? "guest";
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(0, 0, width, height, COLOR_BG).setOrigin(0, 0);

    const roleRu = this.role === "bartender" ? "бармен" : "гость";

    this.add
      .text(width / 2, height / 2 - 60, "ВНУТРИ ПАБА", {
        fontFamily: "Georgia, serif",
        fontSize: "40px",
        color: CREAM_CSS,
        fontStyle: "bold",
        letterSpacing: 3,
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 10, `добро пожаловать, ${roleRu}`, {
        fontFamily: "Georgia, serif",
        fontSize: "20px",
        color: GOLD_CSS,
        letterSpacing: 2,
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 80, "(зал паба — дальше)", {
        fontFamily: "Georgia, serif",
        fontSize: "14px",
        color: "#6b6b6b",
      })
      .setOrigin(0.5);

    const back = this.add
      .text(width / 2, height - 80, "на главный экран", {
        fontFamily: "Georgia, serif",
        fontSize: "16px",
        color: GOLD_CSS,
        letterSpacing: 2,
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    back.on("pointerdown", () => this.scene.start("TitleScene"));
  }
}

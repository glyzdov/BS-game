import * as Phaser from "phaser";
import logoUrl from "../../reference/BS_logo.cd9217e5.png";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    this.load.image("bs_logo", logoUrl);
  }

  create() {
    this.scene.start("TitleScene");
  }
}

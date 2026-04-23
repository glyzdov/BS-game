import * as Phaser from "phaser";
import { BootScene } from "./scenes/BootScene.js";
import { TitleScene } from "./scenes/TitleScene.js";
import { StairsScene } from "./minigames/stairs-descent/StairsScene.js";
import { PubScene } from "./scenes/PubScene.js";
import { DialogScene } from "./scenes/DialogScene.js";

const GAME_WIDTH = 720;
const GAME_HEIGHT = 1280;

const config = {
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: "#0a0a0a",
  pixelArt: true,
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },
  scene: [BootScene, TitleScene, StairsScene, PubScene, DialogScene],
};

new Phaser.Game(config);

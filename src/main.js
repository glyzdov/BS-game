import * as Phaser from "phaser";
import { BootScene } from "./scenes/BootScene.js";

const GAME_WIDTH = 720;
const GAME_HEIGHT = 1280;

const config = {
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: "#0a0a0a",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },
  scene: [BootScene],
};

new Phaser.Game(config);

import Game from "./scenes/Game.js";
//import Nex_Level from "./scenes/Nex_Level.js";

// Create a new Phaser config object
const config = {
  type: Phaser.AUTO,
  width: 216,
  height: 216,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 216,
      height: 216,
    },
    max: {
      width: 216 * 2,
      height: 216 * 2,
    },
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0, x: 0 },
      debug: false, //muestra los colaiders y los movimientos
    },
  },

  pixelArt: true,
  
  // List of scenes to load
  // Only the first scene will be shown
  // Remember to import the scene before adding it to the list
  scene: [Game],
};

// Create a new Phaser game instance
window.game = new Phaser.Game(config);
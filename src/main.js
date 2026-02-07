import Phaser from 'phaser';
import Boot from './scenes/Boot.js';
import Preload from './scenes/Preload.js';
import Menu from './scenes/Menu.js';
import Game from './scenes/Game.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 800,
  height: 544, // 480 jogo + 64 faixa para botões de toque (não sobrepõem o nível)
  pixelArt: false,
  backgroundColor: '#2A2A38',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 350 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [Boot, Preload, Menu, Game],
};

export default new Phaser.Game(config);

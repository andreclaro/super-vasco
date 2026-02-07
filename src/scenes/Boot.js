import Phaser from 'phaser';

export default class Boot extends Phaser.Scene {
  constructor() {
    super({ key: 'Boot' });
  }

  preload() {
    // Minimal boot – no assets required here
  }

  create() {
    this.scene.start('Preload');
  }
}

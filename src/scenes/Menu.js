import Phaser from 'phaser';
import { LEVEL_CONFIG } from './Game.js';

export default class Menu extends Phaser.Scene {
  constructor() {
    super({ key: 'Menu' });
  }

  create() {
    // Fundo: textura gerada no Preload (azul + barras laterais)
    const bg = this.add.image(400, 240, 'menuBg');
    bg.setDepth(0);

    const title = this.add.text(400, 70, 'Super Vasco', {
      fontSize: '48px',
      fill: '#000000',
      fontFamily: 'Arial, sans-serif',
    }).setOrigin(0.5).setDepth(10);
    title.setStroke('#ffffff', 4);

    const subtitle = this.add.text(400, 130, 'Escolhe a dificuldade', {
      fontSize: '26px',
      fill: '#000000',
      fontFamily: 'Arial, sans-serif',
    }).setOrigin(0.5).setDepth(10);
    subtitle.setStroke('#ffffff', 2);

    const difficulties = [
      { key: 'veryEasy', label: 'Muito Fácil', y: 185 },
      { key: 'easy', label: 'Fácil', y: 238 },
      { key: 'medium', label: 'Médio', y: 291 },
      { key: 'hard', label: 'Difícil', y: 344 },
      { key: 'veryHard', label: 'Muito Difícil', y: 397 },
    ];

    difficulties.forEach(({ key, label, y }) => {
      const cfg = LEVEL_CONFIG[key];
      const desc = cfg.coinsTotal + ' moedas · ' + cfg.numGoombas + ' goombas · ' + cfg.numFlying + ' voadores';
      const btn = this.add.text(400, y, label + '\n' + desc, {
        fontSize: '18px',
        fill: '#000000',
        fontFamily: 'Arial, sans-serif',
        align: 'center',
      }).setOrigin(0.5).setDepth(10);
      btn.setStroke('#ffffff', 1);
      btn.setBackgroundColor('#ffffff');
      btn.setPadding(20, 12);
      btn.setInteractive({ useHandCursor: true });
      btn.on('pointerover', () => btn.setBackgroundColor('#eeeeee'));
      btn.on('pointerout', () => btn.setBackgroundColor('#ffffff'));
      btn.on('pointerdown', () => {
        this.scene.start('Game', { levelKey: key });
      });
    });
  }
}

import Phaser from 'phaser';

export default class Preload extends Phaser.Scene {
  constructor() {
    super({ key: 'Preload' });
  }

  preload() {
    // Nada a carregar de ficheiros – texturas geradas em create()
  }

  createPlaceholderTextures() {
    // Vasco: pixel-style character (red cap, face, blue overalls)
    const vascoGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    const M = 2; // scale / pixel size (16x16 logical → 32x32 texture)
    // Cap (red)
    vascoGraphics.fillStyle(0xe52521, 1);
    vascoGraphics.fillRect(2 * M, 0, 12 * M, 5 * M);
    vascoGraphics.fillRect(1 * M, 3 * M, 14 * M, 4 * M);
    // Cap brim
    vascoGraphics.fillRect(0, 5 * M, 16 * M, 2 * M);
    // Face (skin)
    vascoGraphics.fillStyle(0xffdbac, 1);
    vascoGraphics.fillRect(3 * M, 6 * M, 10 * M, 8 * M);
    // Eyes (white + pupil)
    vascoGraphics.fillStyle(0xffffff, 1);
    vascoGraphics.fillRect(4 * M, 8 * M, 2 * M, 2 * M);
    vascoGraphics.fillRect(10 * M, 8 * M, 2 * M, 2 * M);
    vascoGraphics.fillStyle(0x000000, 1);
    vascoGraphics.fillRect(5 * M, 9 * M, 1 * M, 1 * M);
    vascoGraphics.fillRect(11 * M, 9 * M, 1 * M, 1 * M);
    // Moustache (brown)
    vascoGraphics.fillStyle(0x8b4513, 1);
    vascoGraphics.fillRect(4 * M, 11 * M, 8 * M, 2 * M);
    // Overalls (blue)
    vascoGraphics.fillStyle(0x0066cc, 1);
    vascoGraphics.fillRect(2 * M, 13 * M, 12 * M, 6 * M);
    vascoGraphics.fillStyle(0x004499, 1);
    vascoGraphics.fillRect(6 * M, 14 * M, 4 * M, 5 * M); // center stripe
    // Buttons (yellow)
    vascoGraphics.fillStyle(0xffd700, 1);
    vascoGraphics.fillRect(5 * M, 15 * M, 2 * M, 2 * M);
    vascoGraphics.fillRect(9 * M, 15 * M, 2 * M, 2 * M);
    // Gloves (white)
    vascoGraphics.fillStyle(0xffffff, 1);
    vascoGraphics.fillRect(0, 14 * M, 3 * M, 3 * M);
    vascoGraphics.fillRect(13 * M, 14 * M, 3 * M, 3 * M);
    // Shoes (brown)
    vascoGraphics.fillStyle(0x654321, 1);
    vascoGraphics.fillRect(3 * M, 18 * M, 4 * M, 2 * M);
    vascoGraphics.fillRect(9 * M, 18 * M, 4 * M, 2 * M);
    vascoGraphics.generateTexture('vasco', 32, 32);

    // Platform/block: brown
    const blockGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    blockGraphics.fillStyle(0x8b4513, 1);
    blockGraphics.fillRect(0, 0, 32, 32);
    blockGraphics.lineStyle(2, 0x654321);
    blockGraphics.strokeRect(0, 0, 32, 32);
    blockGraphics.generateTexture('block', 32, 32);

    // Coin: yellow circle
    const coinGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    coinGraphics.fillStyle(0xffd700, 1);
    coinGraphics.fillCircle(8, 8, 8);
    coinGraphics.generateTexture('coin', 16, 16);

    // Goomba: mushroom-like enemy (brown body, eyes, feet)
    const goombaGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    const G = 1; // 1px units for 28x24 texture
    // Body (brown, rounded mushroom cap)
    goombaGraphics.fillStyle(0x8b4513, 1);
    goombaGraphics.fillEllipse(14, 10, 14, 10);
    // Lighter underside
    goombaGraphics.fillStyle(0xa0522d, 1);
    goombaGraphics.fillEllipse(14, 14, 12, 6);
    // Feet (darker brown, two blobs)
    goombaGraphics.fillStyle(0x654321, 1);
    goombaGraphics.fillEllipse(8, 22, 6, 4);
    goombaGraphics.fillEllipse(20, 22, 6, 4);
    // Eyes (white)
    goombaGraphics.fillStyle(0xffffff, 1);
    goombaGraphics.fillEllipse(8, 8, 5, 6);
    goombaGraphics.fillEllipse(20, 8, 5, 6);
    // Pupils (black, looking forward)
    goombaGraphics.fillStyle(0x000000, 1);
    goombaGraphics.fillEllipse(8, 9, 3, 4);
    goombaGraphics.fillEllipse(20, 9, 3, 4);
    // Eyebrows (angry look)
    goombaGraphics.fillStyle(0x654321, 1);
    goombaGraphics.fillRect(5, 3, 6, 2);
    goombaGraphics.fillRect(17, 3, 6, 2);
    goombaGraphics.generateTexture('goomba', 28, 24);

    // Flying enemy (Paratroopa-style: winged creature, yellow shell, wings)
    const flyGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    const F = 1;
    // Shell (yellow/orange)
    flyGraphics.fillStyle(0xffa500, 1);
    flyGraphics.fillEllipse(12, 10, 10, 8);
    flyGraphics.fillStyle(0xff8c00, 1);
    flyGraphics.fillEllipse(12, 12, 8, 5);
    // Wings (light blue, semi-transparent look with lighter fill)
    flyGraphics.fillStyle(0x87ceeb, 1);
    flyGraphics.fillEllipse(4, 8, 8, 5);
    flyGraphics.fillEllipse(20, 8, 8, 5);
    flyGraphics.fillStyle(0xb0e0e6, 1);
    flyGraphics.fillEllipse(4, 8, 5, 3);
    flyGraphics.fillEllipse(20, 8, 5, 3);
    // Eyes
    flyGraphics.fillStyle(0xffffff, 1);
    flyGraphics.fillEllipse(9, 7, 3, 4);
    flyGraphics.fillEllipse(15, 7, 3, 4);
    flyGraphics.fillStyle(0x000000, 1);
    flyGraphics.fillEllipse(9, 8, 2, 2);
    flyGraphics.fillEllipse(15, 8, 2, 2);
    flyGraphics.generateTexture('flyingEnemy', 24, 20);

    // Falling objects (rocks) – chuva de objetos para o jogador desviar
    const rockGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    rockGraphics.fillStyle(0x4a4a4a, 1);
    rockGraphics.fillEllipse(12, 12, 12, 12);
    rockGraphics.fillStyle(0x3a3a3a, 1);
    rockGraphics.fillEllipse(10, 14, 8, 6);
    rockGraphics.generateTexture('fallingObject', 24, 24);

    // Granizo – pelotas de gelo (chuva mais densa)
    const hailGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    hailGraphics.fillStyle(0xe8f4fc, 1);
    hailGraphics.fillCircle(6, 6, 6);
    hailGraphics.fillStyle(0xffffff, 0.9);
    hailGraphics.fillCircle(5, 5, 4);
    hailGraphics.generateTexture('hail', 12, 12);

    // Flag/goal: green
    const flagGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    flagGraphics.fillStyle(0x228b22, 1);
    flagGraphics.fillRect(0, 0, 24, 64);
    flagGraphics.generateTexture('flag', 24, 64);

    // Natural landscape background (800x480) – only fillRect/fillCircle/fillEllipse for compatibility
    const bg = this.make.graphics({ x: 0, y: 0, add: false });
    const W = 800;
    const H = 480;
    // Sky (solid light blue)
    bg.fillStyle(0x87ceeb, 1);
    bg.fillRect(0, 0, W, H);
    // Sun
    bg.fillStyle(0xfff8dc, 1);
    bg.fillCircle(680, 80, 50);
    bg.fillStyle(0xffeb99, 0.9);
    bg.fillCircle(680, 80, 42);
    // Distant mountains (blue-gray) – overlapping triangles simulated with rects/ellipses
    bg.fillStyle(0x6b8e9a, 1);
    bg.fillRect(0, 320, 250, 160);
    bg.fillEllipse(200, 420, 180, 120);
    bg.fillEllipse(400, 320, 220, 160);
    bg.fillEllipse(600, 280, 280, 200);
    bg.fillRect(700, 200, 100, 280);
    // Closer mountains (darker)
    bg.fillStyle(0x5a7a85, 1);
    bg.fillRect(0, 360, 350, 120);
    bg.fillEllipse(300, 420, 200, 80);
    bg.fillEllipse(520, 380, 220, 100);
    bg.fillRect(650, 340, 150, 140);
    // Hills (green)
    bg.fillStyle(0x4a7c23, 1);
    bg.fillRect(0, 400, W, 80);
    bg.fillEllipse(200, 420, 180, 60);
    bg.fillEllipse(500, 410, 220, 70);
    bg.fillStyle(0x5d9b2d, 1);
    bg.fillRect(0, 420, W, 60);
    bg.fillEllipse(300, 440, 200, 50);
    bg.fillEllipse(600, 435, 250, 55);
    // Clouds
    bg.fillStyle(0xffffff, 0.85);
    bg.fillEllipse(150, 100, 70, 30);
    bg.fillEllipse(180, 90, 50, 25);
    bg.fillEllipse(120, 95, 45, 22);
    bg.fillEllipse(400, 140, 80, 32);
    bg.fillEllipse(430, 128, 55, 28);
    bg.fillEllipse(370, 132, 50, 24);
    bg.fillEllipse(580, 110, 60, 28);
    bg.fillEllipse(610, 100, 40, 20);
    bg.generateTexture('landscape', W, H);

    // Fundo do menu: azul claro + barras laterais escuras (igual à imagem)
    const menuBg = this.make.graphics({ x: 0, y: 0, add: false });
    const barW = 12;
    menuBg.fillStyle(0x8caefb, 1);
    menuBg.fillRect(0, 0, W, H);
    menuBg.fillStyle(0x2a2a38, 1);
    menuBg.fillRect(0, 0, barW, H);
    menuBg.fillRect(W - barW, 0, barW, H);
    menuBg.generateTexture('menuBg', W, H);
  }

  create() {
    this.createPlaceholderTextures();
    this.scene.start('Menu');
  }
}

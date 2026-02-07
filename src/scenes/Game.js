import Phaser from 'phaser';
import { startBackgroundMusic, stopBackgroundMusic, isMusicRunning, isSoundMuted } from '../audio/backgroundMusic.js';
import { playCoinSound, playLoseSound, playStompSound } from '../audio/soundEffects.js';

const FLAG_X = 720;
const FLAG_Y = 416;

// Posições possíveis para moedas (usamos as primeiras N conforme o nível)
const COIN_POSITIONS = [
  { x: 180, y: 310 }, { x: 220, y: 310 }, { x: 380, y: 240 }, { x: 420, y: 240 },
  { x: 530, y: 310 }, { x: 620, y: 210 }, { x: 280, y: 320 }, { x: 340, y: 250 },
  { x: 480, y: 310 }, { x: 700, y: 380 },
];

// Configurações possíveis para Goombas (chão) – usamos as primeiras N
const GOOMBA_CONFIGS = [
  { x: 180, vx: -50, minX: 120, maxX: 240 },
  { x: 300, vx: -60, minX: 250, maxX: 380 },
  { x: 420, vx: 55, minX: 380, maxX: 520 },
  { x: 500, vx: 50, minX: 480, maxX: 600 },
  { x: 580, vx: -45, minX: 520, maxX: 660 },
  { x: 680, vx: 40, minX: 640, maxX: 760 },
  { x: 240, vx: -55, minX: 180, maxX: 320 },
  { x: 360, vx: 50, minX: 300, maxX: 440 },
  { x: 540, vx: -50, minX: 480, maxX: 620 },
  { x: 640, vx: 45, minX: 580, maxX: 720 },
];

// Configurações possíveis para inimigos voadores – usamos as primeiras N
const FLYING_CONFIGS = [
  { x: 260, y: 280, minX: 220, maxX: 340, speed: 45, amp: 25, phase: 0 },
  { x: 450, y: 200, minX: 380, maxX: 520, speed: -50, amp: 30, phase: Math.PI / 2 },
  { x: 600, y: 260, minX: 540, maxX: 680, speed: 55, amp: 20, phase: Math.PI },
  { x: 350, y: 320, minX: 280, maxX: 450, speed: -40, amp: 35, phase: Math.PI / 4 },
  { x: 520, y: 180, minX: 460, maxX: 620, speed: 48, amp: 28, phase: -Math.PI / 3 },
  { x: 320, y: 240, minX: 260, maxX: 400, speed: -48, amp: 22, phase: Math.PI / 3 },
  { x: 480, y: 260, minX: 420, maxX: 560, speed: 52, amp: 26, phase: -Math.PI / 4 },
  { x: 580, y: 220, minX: 520, maxX: 660, speed: -45, amp: 24, phase: Math.PI / 6 },
  { x: 400, y: 300, minX: 340, maxX: 480, speed: 50, amp: 30, phase: -Math.PI / 2 },
];

// Níveis de dificuldade: moedas, inimigos no chão, voadores, intervalo pedras (ms), intervalo granizo (ms), gravidade objetos (exportado para Menu)
export const LEVEL_CONFIG = {
  veryEasy: {
    label: 'Muito Fácil',
    coinsTotal: 5,
    numGoombas: 2,
    numFlying: 0,
    fallingInterval: 4000,
    hailInterval: 2000,
    fallingGravity: 30,
  },
  easy: {
    label: 'Fácil',
    coinsTotal: 6,
    numGoombas: 3,
    numFlying: 1,
    fallingInterval: 3000,
    hailInterval: 1000,
    fallingGravity: 32,
  },
  medium: {
    label: 'Médio',
    coinsTotal: 10,
    numGoombas: 6,
    numFlying: 5,
    fallingInterval: 2200,
    hailInterval: 550,
    fallingGravity: 35,
  },
  hard: {
    label: 'Difícil',
    coinsTotal: 10,
    numGoombas: 8,
    numFlying: 7,
    fallingInterval: 1600,
    hailInterval: 400,
    fallingGravity: 38,
  },
  veryHard: {
    label: 'Muito Difícil',
    coinsTotal: 10,
    numGoombas: 10,
    numFlying: 9,
    fallingInterval: 1100,
    hailInterval: 280,
    fallingGravity: 42,
  },
};

export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });
  }

  create() {
    const levelKey = this.scene.settings.data.levelKey;

    // Sem nível escolhido: voltar ao menu
    if (!levelKey || !LEVEL_CONFIG[levelKey]) {
      this.scene.start('Menu');
      return;
    }

    this.levelKey = levelKey;
    this.levelConfig = LEVEL_CONFIG[levelKey];
    this.coinsTotal = this.levelConfig.coinsTotal;

    this.gameOver = false;
    this.won = false;
    this.coinsCollected = 0;

    // Natural landscape background (behind everything)
    const bg = this.add.image(400, 240, 'landscape');
    bg.setDepth(-1);

    // Platforms (static group)
    this.platforms = this.physics.add.staticGroup();
    const groundY = 448;
    const blockW = 32;
    const blockH = 32;

    // Ground row
    for (let x = 0; x < 800; x += blockW) {
      this.platforms.create(x + blockW / 2, groundY + blockH / 2, 'block');
    }

    // Floating platforms
    const platformsData = [
      { x: 200, y: 350 },
      { x: 400, y: 280 },
      { x: 550, y: 350 },
      { x: 650, y: 250 },
    ];
    platformsData.forEach(({ x, y }) => {
      this.platforms.create(x, y, 'block');
      this.platforms.create(x + blockW, y, 'block');
    });

    // Player (Vasco)
    this.player = this.physics.add.sprite(80, groundY - 24, 'vasco');
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.1);
    this.player.setSize(28, 30);
    this.player.setOffset(2, 1);
    this.playerPrevVelocityY = 0;

    // Coins – quantidade conforme o nível
    this.coins = this.physics.add.group();
    const coinPositions = COIN_POSITIONS.slice(0, this.coinsTotal);
    coinPositions.forEach(({ x, y }) => {
      const coin = this.coins.create(x, y, 'coin');
      coin.body.setAllowGravity(false);
      coin.body.setImmovable(true);
      coin.setCircle(8);
    });

    // Goal flag
    this.flag = this.physics.add.staticImage(FLAG_X, FLAG_Y, 'flag');
    this.flag.setVisible(true);

    // Enemies (ground + flying) – quantidade conforme o nível
    this.enemies = this.physics.add.group();
    const groundY_off = groundY - 14;
    const goombaConfigs = GOOMBA_CONFIGS.slice(0, this.levelConfig.numGoombas);
    goombaConfigs.forEach(({ x, vx, minX, maxX }) => {
      const g = this.enemies.create(x, groundY_off, 'goomba');
      g.setVelocityX(vx);
      g.setCollideWorldBounds(false);
      g.setSize(24, 20);
      g.setOffset(2, 2);
      g.setData('minX', minX);
      g.setData('maxX', maxX);
      g.setData('flying', false);
    });

    this.flyingEnemies = this.physics.add.group();
    const flyingConfigs = FLYING_CONFIGS.slice(0, this.levelConfig.numFlying);
    flyingConfigs.forEach(({ x, y, minX, maxX, speed, amp, phase }) => {
      const f = this.flyingEnemies.create(x, y, 'flyingEnemy');
      f.body.setAllowGravity(false);
      f.setSize(20, 16);
      f.setOffset(2, 2);
      f.setData('minX', minX);
      f.setData('maxX', maxX);
      f.setData('speed', speed);
      f.setData('amp', amp);
      f.setData('phase', phase);
      f.setData('flying', true);
      f.setVelocityX(speed);
    });

    // Objetos que caem + granizo – intervalos e gravidade conforme o nível
    this.fallingObjects = this.physics.add.group();
    this.worldGravityY = this.physics.world.gravity.y;
    this.fallingGravity = this.levelConfig.fallingGravity;
    this.time.addEvent({
      delay: this.levelConfig.fallingInterval,
      callback: this.spawnFallingObject,
      callbackScope: this,
      loop: true,
    });
    this.time.addEvent({
      delay: this.levelConfig.hailInterval,
      callback: this.spawnHail,
      callbackScope: this,
      loop: true,
    });

    // Collisions
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.enemies, this.enemies);

    this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
    this.physics.add.overlap(this.player, this.flag, this.reachFlag, null, this);
    this.physics.add.collider(this.player, this.enemies, this.playerHitEnemy, null, this);
    this.physics.add.collider(this.player, this.flyingEnemies, this.playerHitEnemy, null, this);
    this.physics.add.collider(this.fallingObjects, this.platforms, this.fallingObjectHitGround, null, this);
    this.physics.add.overlap(this.player, this.fallingObjects, this.playerHitFallingObject, null, this);

    // UI
    this.coinsText = this.add.text(16, 16, 'Moedas: 0 / ' + this.coinsTotal, {
      fontSize: '20px',
      fill: '#fff',
      fontFamily: 'sans-serif',
    });
    this.coinsText.setScrollFactor(0);

    this.enemiesText = this.add.text(16, 42, 'Inimigos: ' + this.countEnemies(), {
      fontSize: '20px',
      fill: '#fff',
      fontFamily: 'sans-serif',
    });
    this.enemiesText.setScrollFactor(0);

    // Nível atual (abaixo do título)
    this.levelLabel = this.add.text(784, 44, 'Nível: ' + this.levelConfig.label, {
      fontSize: '16px',
      fill: '#fff',
      fontFamily: 'sans-serif',
    });
    this.levelLabel.setOrigin(1, 0);
    this.levelLabel.setScrollFactor(0);

    // Título do jogo (topo direito)
    const title = this.add.text(784, 16, 'Super Vasco', {
      fontSize: '24px',
      fill: '#000',
      fontFamily: 'sans-serif',
    });
    title.setOrigin(1, 0);
    title.setScrollFactor(0);

    // Botão desligar/ligar som (canto superior direito) – reflete estado real (música + efeitos)
    const soundButtonText = this.add.text(784, 48, isSoundMuted() ? 'Som: OFF' : 'Som: ON', {
      fontSize: '18px',
      fill: '#fff',
      fontFamily: 'sans-serif',
    });
    soundButtonText.setOrigin(1, 0);
    soundButtonText.setScrollFactor(0);
    soundButtonText.setBackgroundColor('#333333');
    soundButtonText.setPadding(8, 4);
    soundButtonText.setPosition(784, 70);
    soundButtonText.setInteractive({ useHandCursor: true });
    soundButtonText.on('pointerdown', () => {
      if (isMusicRunning()) {
        stopBackgroundMusic();
        soundButtonText.setText('Som: OFF');
      } else {
        startBackgroundMusic();
        soundButtonText.setText('Som: ON');
      }
    });

    this.cursors = this.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });

    // Start background music on first user interaction (browser autoplay policy), só se o som não estiver desligado
    const startMusicOnce = () => {
      if (!isMusicRunning() && !isSoundMuted()) startBackgroundMusic();
      this.input.off('pointerdown', startMusicOnce);
      this.input.keyboard.off('keydown', startMusicOnce);
    };
    this.input.once('pointerdown', startMusicOnce);
    this.input.keyboard.once('keydown', startMusicOnce);
  }

  update() {
    if (this.gameOver || this.won) return;

    // Guardar velocidade Y do frame anterior (ao aterrar num Goomba, a colisão com o chão pode zerar velocity antes do callback)
    this.playerPrevVelocityY = this.player.body.velocity.y;

    const t = this.time.now / 300;

    // Ground enemies: patrol back and forth
    this.enemies.children.entries.forEach((e) => {
      if (!e.active) return;
      const minX = e.getData('minX');
      const maxX = e.getData('maxX');
      if (e.x <= minX) e.setVelocityX(60);
      if (e.x >= maxX) e.setVelocityX(-60);
    });

    // Flying enemies: horizontal patrol + vertical bobbing
    this.flyingEnemies.children.entries.forEach((e) => {
      if (!e.active) return;
      const minX = e.getData('minX');
      const maxX = e.getData('maxX');
      const speed = e.getData('speed');
      const amp = e.getData('amp');
      const phase = e.getData('phase');
      if (e.x <= minX) e.setVelocityX(Math.abs(speed));
      if (e.x >= maxX) e.setVelocityX(-Math.abs(speed));
      e.setVelocityY(Math.sin(t + phase) * amp);
    });

    const left = this.cursors.left.isDown || this.cursors.a.isDown;
    const right = this.cursors.right.isDown || this.cursors.d.isDown;
    const jump = this.cursors.up.isDown || this.cursors.w.isDown || this.cursors.space.isDown;

    if (left) this.player.setVelocityX(-180);
    else if (right) this.player.setVelocityX(180);
    else this.player.setVelocityX(0);

    if (jump && this.player.body.touching.down) {
      this.player.setVelocityY(-320);
    }

    // Destruir objetos que caíram para fora do ecrã
    this.fallingObjects.children.entries.forEach((obj) => {
      if (obj.active && obj.y > 500) obj.destroy();
    });
  }

  countEnemies() {
    return (this.enemies ? this.enemies.countActive(true) : 0) +
           (this.flyingEnemies ? this.flyingEnemies.countActive(true) : 0);
  }

  collectCoin(player, coin) {
    coin.destroy();
    this.coinsCollected += 1;
    this.coinsText.setText('Moedas: ' + this.coinsCollected + ' / ' + this.coinsTotal);
    playCoinSound();
  }

  triggerWin() {
    if (this.won) return;
    this.won = true;
    this.physics.pause();
    this.add.text(400, 240, 'Vitória!', {
      fontSize: '48px',
      fill: '#ffd700',
      fontFamily: 'sans-serif',
    }).setOrigin(0.5);
    this.add.text(400, 290, 'R para reiniciar', {
      fontSize: '20px',
      fill: '#fff',
      fontFamily: 'sans-serif',
    }).setOrigin(0.5);
    this.input.keyboard.once('keydown-R', () => this.scene.restart({ levelKey: this.levelKey }));
  }

  reachFlag() {
    if (this.won) return;
    const allCoins = this.coinsCollected >= this.coinsTotal;
    const allEnemiesDead = this.countEnemies() === 0;
    if (allCoins && allEnemiesDead) {
      this.triggerWin();
    } else {
      const msg = [];
      if (!allCoins) msg.push('Apanha todas as ' + this.coinsTotal + ' moedas');
      if (!allEnemiesDead) msg.push('elimina todos os inimigos');
      const hint = this.add.text(400, 240, msg.join(' e '), {
        fontSize: '22px',
        fill: '#ffcc00',
        fontFamily: 'sans-serif',
      }).setOrigin(0.5);
      this.time.delayedCall(2000, () => hint.destroy());
    }
  }

  playerHitEnemy(player, enemy) {
    if (this.gameOver || this.won) return;
    // Stomp = estávamos/estamos a descer e viemos por cima do inimigo.
    // Velocidade do frame anterior: ao aterrar num Goomba, a colisão com o chão pode zerar velocity.y no mesmo frame.
    const falling = player.body.velocity.y >= 0 || this.playerPrevVelocityY >= 80;
    const centerAbove = player.y < enemy.y - 4;
    // Inimigos no chão: se estávamos a cair forte, mesmo que a física nos tenha já colocado no chão, contar como stomp
    const groundEnemyLenient = enemy.getData('flying') === false && this.playerPrevVelocityY >= 80 && player.y <= enemy.y + 14;
    const fromAbove = centerAbove || groundEnemyLenient;
    const stomping = falling && fromAbove;
    if (stomping) {
      enemy.destroy();
      player.setVelocityY(-220);
      playStompSound();
      if (this.enemiesText) this.enemiesText.setText('Inimigos: ' + this.countEnemies());
    } else {
      this.triggerGameOver();
    }
  }

  spawnFallingObject() {
    if (this.gameOver || this.won) return;
    const x = Phaser.Math.Between(40, 760);
    const obj = this.fallingObjects.create(x, -20, 'fallingObject');
    const gravity = (this.fallingGravity != null ? this.fallingGravity : 35) - this.worldGravityY;
    obj.setGravityY(gravity);
    obj.setCircle(10);
    obj.setCollideWorldBounds(false);
  }

  spawnHail() {
    if (this.gameOver || this.won) return;
    const x = Phaser.Math.Between(20, 780);
    const obj = this.fallingObjects.create(x, -15, 'hail');
    const gravity = (this.fallingGravity != null ? this.fallingGravity : 35) - this.worldGravityY;
    obj.setGravityY(gravity);
    obj.setCircle(5);
    obj.setCollideWorldBounds(false);
  }

  fallingObjectHitGround(obj, _platform) {
    obj.destroy();
  }

  playerHitFallingObject(player, obj) {
    if (this.gameOver || this.won) return;
    obj.destroy();
    this.triggerGameOver();
  }

  triggerGameOver() {
    if (this.gameOver) return;
    this.gameOver = true;
    this.physics.pause();
    playLoseSound();
    this.add.text(400, 240, 'Game Over', {
      fontSize: '48px',
      fill: '#e52521',
      fontFamily: 'sans-serif',
    }).setOrigin(0.5);
    this.add.text(400, 290, 'R para reiniciar', {
      fontSize: '20px',
      fill: '#fff',
      fontFamily: 'sans-serif',
    }).setOrigin(0.5);
    this.input.keyboard.once('keydown-R', () => this.scene.restart({ levelKey: this.levelKey }));
  }

}

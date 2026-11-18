/**
 * LOS JUEGOS DEL HAMBRE: ARENA EN LLAMAS
 * Motor Battle Royale 2D Top-Down en HTML5 Canvas + Web Audio API Sintetizado
 */

(() => {
  'use strict';

  // ==================== CONFIGURACIÓN DEL MUNDO ====================
  const WORLD_SIZE = 3200;
  const CENTER = WORLD_SIZE / 2;
  const TOTAL_TRIBUTES = 24;

  // Definición de Distritos y sus ventajas
  const DISTRICTS = {
    1:  { name: 'Lujo',        perk: '+15% Daño general + Cuchillo', dmgMult: 1.15, bowMult: 1.15, startItems: ['machete'] },
    2:  { name: 'Armamento',   perk: '+45 Escudo Táctico inicial',   dmgMult: 1.05, bowMult: 1.05, startShield: 45, startItems: ['grenade'] },
    3:  { name: 'Tecnología',  perk: 'Empieza con Minas Explosivas', dmgMult: 1.0,  bowMult: 1.1,  startItems: ['mine'] },
    4:  { name: 'Pesca',       perk: 'Ágil en agua +10% Velocidad',  dmgMult: 1.05, bowMult: 1.05, speedMult: 1.1, waterImmune: true, startItems: ['hunting_bow'] },
    5:  { name: 'Energía',     perk: '+35% Estamina y recarga veloz',dmgMult: 1.0,  bowMult: 1.05, staminaMult: 1.35, startItems: ['adrenaline'] },
    7:  { name: 'Madera',      perk: 'Empieza con Katana/Machete',   dmgMult: 1.1,  bowMult: 1.0,  startItems: ['machete', 'berries'] },
    8:  { name: 'Textil',      perk: 'Chaleco + Botiquín inicial',   dmgMult: 1.0,  bowMult: 1.0,  startShield: 25, startItems: ['medkit'] },
    10: { name: 'Ganadería',   perk: '+25 Vida Máxima inicial',      dmgMult: 1.0,  bowMult: 1.0,  bonusHp: 25, startItems: ['berries'] },
    11: { name: 'Agricultura', perk: 'Sigilo mejorado + Bayas',      dmgMult: 1.0,  bowMult: 1.1,  startItems: ['berries', 'hunting_bow'] },
    12: { name: 'Carbón',      perk: '+20% Daño Arcos y Explosivos', dmgMult: 1.05, bowMult: 1.22, startItems: ['hunting_bow', 'grenade'] }
  };

  // Catálogo completo de Armas, Arcos, Explosivos y Suministros
  const ITEM_CATALOG = {
    explosive_bow: {
      id: 'explosive_bow',
      name: 'Arco Explosivo',
      icon: '🏹🔥',
      shortIcon: '🏹',
      type: 'bow',
      rarity: 'legendary',
      damage: 45,
      explosionDamage: 58,
      explosionRadius: 115,
      chargeTime: 0.72,
      projSpeed: 980,
      range: 860,
      ammo: 18,
      maxAmmo: 30,
      explosive: true,
      desc: 'Arco Legendario: Mantené Clic Izq. para tensar. Las flechas detonan al impactar.'
    },
    hunting_bow: {
      id: 'hunting_bow',
      name: 'Arco de Caza',
      icon: '🏹',
      shortIcon: '🏹',
      type: 'bow',
      rarity: 'epic',
      damage: 58,
      chargeTime: 0.62,
      projSpeed: 1050,
      range: 880,
      ammo: 24,
      maxAmmo: 40,
      explosive: false,
      desc: 'Arco de precisión: Mantené Clic Izq. para mayor velocidad, alcance y daño crítico.'
    },
    crossbow: {
      id: 'crossbow',
      name: 'Ballesta Táctica',
      icon: '🎯',
      shortIcon: '🎯',
      type: 'gun',
      rarity: 'epic',
      damage: 52,
      fireRate: 0.75,
      projSpeed: 1220,
      range: 920,
      ammo: 16,
      maxAmmo: 32,
      pierce: true,
      spread: 0.015,
      pellets: 1,
      desc: 'Ballesta perforante: Disparo instantáneo que atraviesa enemigos.'
    },
    assault_rifle: {
      id: 'assault_rifle',
      name: 'Rifle del Capitolio',
      icon: '🔫',
      shortIcon: '🔫',
      type: 'gun',
      rarity: 'legendary',
      damage: 21,
      fireRate: 0.12,
      projSpeed: 1180,
      range: 780,
      ammo: 45,
      maxAmmo: 90,
      spread: 0.06,
      pellets: 1,
      desc: 'Rifle de Asalto automático del Capitolio de alta cadencia.'
    },
    shotgun: {
      id: 'shotgun',
      name: 'Escopeta de Combate',
      icon: '💥',
      shortIcon: '💥',
      type: 'gun',
      rarity: 'rare',
      damage: 14,
      fireRate: 0.68,
      projSpeed: 940,
      range: 420,
      ammo: 16,
      maxAmmo: 32,
      spread: 0.24,
      pellets: 7,
      desc: 'Escopeta de corto alcance: 7 perdigones letales en la Cornucopia.'
    },
    machete: {
      id: 'machete',
      name: 'Katana Táctica',
      icon: '🗡️',
      shortIcon: '🗡️',
      type: 'melee',
      rarity: 'rare',
      damage: 42,
      fireRate: 0.34,
      range: 82,
      desc: 'Arma cuerpo a cuerpo veloz. No consume munición y destroza cajas rápido.'
    },
    grenade: {
      id: 'grenade',
      name: 'Granada Frag',
      icon: '💣',
      shortIcon: '💣',
      type: 'throwable',
      throwType: 'grenade',
      rarity: 'rare',
      damage: 85,
      explosionRadius: 135,
      ammo: 3,
      maxAmmo: 6,
      desc: 'Granada de fragmentación: Explota tras 1.6s causando gran daño en área.'
    },
    molotov: {
      id: 'molotov',
      name: 'Bomba Molotov',
      icon: '🍾',
      shortIcon: '🍾',
      type: 'throwable',
      throwType: 'molotov',
      rarity: 'rare',
      damage: 25,
      explosionRadius: 110,
      ammo: 3,
      maxAmmo: 6,
      desc: 'Cóctel Molotov: Crea un charco de fuego que quema a los tributos.'
    },
    mine: {
      id: 'mine',
      name: 'Mina Explosiva',
      icon: '🚨',
      shortIcon: '🚨',
      type: 'throwable',
      throwType: 'mine',
      rarity: 'epic',
      damage: 92,
      explosionRadius: 125,
      ammo: 3,
      maxAmmo: 6,
      desc: 'Mina de Proximidad: Se oculta en el suelo y detona cuando alguien la pisa.'
    },
    medkit: {
      id: 'medkit',
      name: 'Botiquín Capitolio',
      icon: '🧰',
      shortIcon: '🧰',
      type: 'consumable',
      rarity: 'epic',
      healHp: 65,
      ammo: 2,
      maxAmmo: 4,
      desc: 'Restaura +65 de Vida instantáneamente al hacer Clic Izquierdo.'
    },
    shield_vest: {
      id: 'shield_vest',
      name: 'Chaleco Blindado',
      icon: '🛡️',
      shortIcon: '🛡️',
      type: 'consumable',
      rarity: 'rare',
      healShield: 55,
      ammo: 2,
      maxAmmo: 4,
      desc: 'Otorga +55 de Escudo Táctico al hacer Clic Izquierdo.'
    },
    berries: {
      id: 'berries',
      name: 'Bayas del Bosque',
      icon: '🍒',
      shortIcon: '🍒',
      type: 'consumable',
      rarity: 'common',
      healHp: 28,
      healStamina: 45,
      ammo: 3,
      maxAmmo: 6,
      desc: 'Restaura +28 de Vida y +45 de Estamina.'
    },
    adrenaline: {
      id: 'adrenaline',
      name: 'Adrenalina Pura',
      icon: '💉',
      shortIcon: '💉',
      type: 'consumable',
      rarity: 'epic',
      healHp: 20,
      speedBuff: 8,
      ammo: 2,
      maxAmmo: 3,
      desc: '+35% Velocidad, estamina infinita por 8s y +20 de Vida.'
    }
  };

  const BOT_NAMES = [
    { name: 'Cato', district: 2 },
    { name: 'Clove', district: 2 },
    { name: 'Glimmer', district: 1 },
    { name: 'Marvel', district: 1 },
    { name: 'Finnick', district: 4 },
    { name: 'Mags', district: 4 },
    { name: 'Thresh', district: 11 },
    { name: 'Rue', district: 11 },
    { name: 'Peeta', district: 12 },
    { name: 'Johanna', district: 7 },
    { name: 'Blight', district: 7 },
    { name: 'Beetee', district: 3 },
    { name: 'Wiress', district: 3 },
    { name: 'Foxface', district: 5 },
    { name: 'Gloss', district: 1 },
    { name: 'Cashmere', district: 1 },
    { name: 'Brutus', district: 2 },
    { name: 'Enobaria', district: 2 },
    { name: 'Chaff', district: 11 },
    { name: 'Seeder', district: 11 },
    { name: 'Cecelia', district: 8 },
    { name: 'Woof', district: 8 },
    { name: 'Titus', district: 6 }
  ];

  // ==================== MOTOR DE AUDIO WEB API ====================
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      return this.enabled;
    }

    playTone(freq, endFreq, duration, type = 'sine', gainVal = 0.18) {
      if (!this.enabled || !this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + duration);
      gain.gain.setValueAtTime(gainVal, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    }

    playNoise(duration, filterFreq = 900, gainVal = 0.25) {
      if (!this.enabled || !this.ctx) return;
      const now = this.ctx.currentTime;
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.45));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(filterFreq, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(gainVal, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
    }

    bowRelease(explosive = false) {
      this.playTone(explosive ? 320 : 240, 95, 0.16, 'triangle', 0.2);
      this.playNoise(0.1, 1800, 0.1);
    }

    gunShot(isShotgun = false) {
      this.playNoise(isShotgun ? 0.28 : 0.14, isShotgun ? 850 : 1600, isShotgun ? 0.32 : 0.18);
      this.playTone(isShotgun ? 140 : 220, 45, 0.12, 'sawtooth', 0.15);
    }

    meleeSwing() {
      this.playNoise(0.11, 2200, 0.14);
      this.playTone(420, 120, 0.11, 'sine', 0.12);
    }

    explosion() {
      this.playNoise(0.65, 480, 0.45);
      this.playTone(110, 24, 0.55, 'sawtooth', 0.35);
    }

    cannonBoom() {
      // El icónico cañonazo del Capitolio cuando muere un tributo
      this.playNoise(0.85, 320, 0.42);
      this.playTone(82, 26, 0.85, 'sine', 0.42);
    }

    gongStart() {
      this.playTone(196, 192, 1.3, 'triangle', 0.35);
      this.playTone(392, 380, 1.1, 'sine', 0.2);
    }

    pickup() {
      this.playTone(520, 880, 0.12, 'sine', 0.14);
    }

    heal() {
      this.playTone(440, 660, 0.22, 'triangle', 0.16);
    }

    hitMarker() {
      this.playTone(900, 450, 0.06, 'square', 0.1);
    }
  }

  const sfx = new SoundEngine();

  // ==================== ELEMENTOS DEL DOM ====================
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');
  const minimapCanvas = document.getElementById('minimap');
  const minimapCtx = minimapCanvas.getContext('2d');

  const startScreen = document.getElementById('start-screen');
  const endScreen = document.getElementById('end-screen');
  const hud = document.getElementById('hud');

  const inputName = document.getElementById('player-name');
  const selectDistrict = document.getElementById('player-district');
  const btnStart = document.getElementById('btn-start');
  const btnRestart = document.getElementById('btn-restart');
  const btnMenu = document.getElementById('btn-menu');
  const btnSound = document.getElementById('btn-sound');

  const hudDistrict = document.getElementById('hud-district');
  const hudName = document.getElementById('hud-name');
  const hudPerk = document.getElementById('hud-perk');
  const hudAlive = document.getElementById('hud-alive');
  const hudKills = document.getElementById('hud-kills');
  const hudStormTimer = document.getElementById('hud-storm-timer');

  const countdownBanner = document.getElementById('countdown-banner');
  const countdownNumber = document.getElementById('countdown-number');
  const cannonBanner = document.getElementById('cannon-banner');
  const cannonDetail = document.getElementById('cannon-detail');
  const killFeed = document.getElementById('kill-feed');
  const interactPrompt = document.getElementById('interact-prompt');
  const interactItemName = document.getElementById('interact-item-name');

  const chargeBarContainer = document.getElementById('charge-bar-container');
  const chargeLabel = document.getElementById('charge-label');
  const chargeFill = document.getElementById('charge-fill');

  const barShield = document.getElementById('bar-shield');
  const textShield = document.getElementById('text-shield');
  const barHp = document.getElementById('bar-hp');
  const textHp = document.getElementById('text-hp');
  const barStamina = document.getElementById('bar-stamina');
  const inventoryBar = document.getElementById('inventory-bar');
  const weaponHint = document.getElementById('weapon-hint');

  // ==================== ESTADO GLOBAL DE LA PARTIDA ====================
  let gameState = 'MENU'; // MENU | COUNTDOWN | PLAYING | ENDED
  let lastTime = performance.now();
  let matchTime = 0;
  let countdownTimer = 5.0;
  let cannonTimeout = null;
  let airdropTimer = 24;

  const camera = { x: CENTER, y: CENTER, shake: 0 };
  const keys = {};
  const mouse = { x: 0, y: 0, worldX: CENTER, worldY: CENTER, leftDown: false };

  let player = null;
  let tributes = [];
  let projectiles = [];
  let throwables = [];
  let mines = [];
  let fireZones = [];
  let chests = [];
  let crates = [];
  let groundLoot = [];
  let trees = [];
  let bushes = [];
  let particles = [];
  let floatingTexts = [];
  let pedestals = [];
  let airdrops = [];

  const storm = {
    x: CENTER,
    y: CENTER,
    currentRadius: 2150,
    targetRadius: 1500,
    phase: 1,
    phaseTimer: 35,
    shrinking: false,
    damagePerSec: 7
  };

  // ==================== UTILIDADES MATEMÁTICAS ====================
  const rand = (min, max) => Math.random() * (max - min) + min;
  const dist = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);
  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

  function cloneItem(itemId, customAmmo = null) {
    const base = ITEM_CATALOG[itemId];
    if (!base) return null;
    const copy = { ...base };
    if (customAmmo !== null) copy.ammo = customAmmo;
    return copy;
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // ==================== GENERACIÓN DE LA ARENA ====================
  function generateArena() {
    trees = [];
    bushes = [];
    chests = [];
    crates = [];
    groundLoot = [];
    projectiles = [];
    throwables = [];
    mines = [];
    fireZones = [];
    particles = [];
    floatingTexts = [];
    pedestals = [];
    airdrops = [];

    // 1. Pedestales de los 24 Tributos alrededor de la Cornucopia
    const pedestalRingRadius = 370;
    for (let i = 0; i < TOTAL_TRIBUTES; i++) {
      const angle = (i / TOTAL_TRIBUTES) * Math.PI * 2;
      pedestals.push({
        x: CENTER + Math.cos(angle) * pedestalRingRadius,
        y: CENTER + Math.sin(angle) * pedestalRingRadius,
        angle: angle + Math.PI
      });
    }

    // 2. Cofres Dorados en la Cornucopia Central (El Baño de Sangre)
    const cornucopiaLootSpots = 12;
    for (let i = 0; i < cornucopiaLootSpots; i++) {
      const angle = (i / cornucopiaLootSpots) * Math.PI * 2;
      const r = i % 2 === 0 ? 115 : 195;
      chests.push({
        x: CENTER + Math.cos(angle) * r,
        y: CENTER + Math.sin(angle) * r,
        tier: i % 3 === 0 ? 'legendary' : 'epic',
        opened: false,
        radius: 22
      });
    }

    // Garantizar al menos 2 Arcos Explosivos y armas clave sueltas junto a la Cornucopia
    const guaranteedCenterItems = [
      'explosive_bow', 'explosive_bow', 'hunting_bow', 'crossbow',
      'assault_rifle', 'shotgun', 'grenade', 'mine', 'molotov', 'machete', 'shield_vest', 'medkit'
    ];
    guaranteedCenterItems.forEach((id, idx) => {
      const a = (idx / guaranteedCenterItems.length) * Math.PI * 2 + 0.25;
      const d = rand(135, 255);
      spawnLoot(CENTER + Math.cos(a) * d, CENTER + Math.sin(a) * d, id);
    });

    // 3. Cofres y Cajas de suministros repartidos por el bosque y ruinas
    for (let i = 0; i < 42; i++) {
      let x = rand(220, WORLD_SIZE - 220);
      let y = rand(220, WORLD_SIZE - 220);
      if (dist(x, y, CENTER, CENTER) < 460) continue;
      chests.push({
        x, y,
        tier: Math.random() < 0.24 ? 'legendary' : (Math.random() < 0.55 ? 'epic' : 'rare'),
        opened: false,
        radius: 20
      });
    }

    for (let i = 0; i < 65; i++) {
      let x = rand(180, WORLD_SIZE - 180);
      let y = rand(180, WORLD_SIZE - 180);
      if (dist(x, y, CENTER, CENTER) < 260) continue;
      crates.push({
        x, y,
        hp: 60,
        maxHp: 60,
        radius: 22
      });
    }

    // 4. Árboles (bloquean movimiento y flechas) y Arbustos de Sigilo
    for (let i = 0; i < 145; i++) {
      let x = rand(120, WORLD_SIZE - 120);
      let y = rand(120, WORLD_SIZE - 120);
      // Dejar despejada la Cornucopia y los pedestales
      if (dist(x, y, CENTER, CENTER) < 465) continue;
      // No bloquear los puentes del río
      if (Math.abs(x - CENTER) < 110) continue;
      trees.push({
        x, y,
        radius: rand(30, 46),
        shade: rand(0.85, 1.15)
      });
    }

    for (let i = 0; i < 110; i++) {
      let x = rand(140, WORLD_SIZE - 140);
      let y = rand(140, WORLD_SIZE - 140);
      if (dist(x, y, CENTER, CENTER) < 290) continue;
      bushes.push({
        x, y,
        radius: rand(34, 48)
      });
    }
  }

  function spawnLoot(x, y, itemId = null, tier = 'rare') {
    if (!itemId) {
      const pools = {
        legendary: ['explosive_bow', 'assault_rifle', 'crossbow', 'mine', 'medkit', 'adrenaline'],
        epic: ['explosive_bow', 'hunting_bow', 'crossbow', 'shotgun', 'mine', 'molotov', 'shield_vest', 'medkit'],
        rare: ['hunting_bow', 'shotgun', 'machete', 'grenade', 'molotov', 'shield_vest', 'berries', 'adrenaline']
      };
      const pool = pools[tier] || pools.rare;
      itemId = pool[Math.floor(Math.random() * pool.length)];
    }
    const item = cloneItem(itemId);
    if (!item) return;
    groundLoot.push({
      x: clamp(x, 80, WORLD_SIZE - 80),
      y: clamp(y, 80, WORLD_SIZE - 80),
      item,
      radius: 18,
      bobOffset: Math.random() * Math.PI * 2
    });
  }

  // ==================== CREACIÓN DE TRIBUTOS (JUGADOR + 23 BOTS) ====================
  function createTribute({ id, name, district, isPlayer, x, y, angle }) {
    const dInfo = DISTRICTS[district] || DISTRICTS[12];
    const maxHp = 100 + (dInfo.bonusHp || 0);
    const maxStamina = 100 * (dInfo.staminaMult || 1);

    const inventory = [null, null, null, null, null];
    if (dInfo.startItems) {
      dInfo.startItems.forEach((itemId, idx) => {
        if (idx < 5) inventory[idx] = cloneItem(itemId);
      });
    }

    return {
      id,
      name,
      district,
      isPlayer,
      x,
      y,
      vx: 0,
      vy: 0,
      angle: angle || 0,
      radius: 18,
      hp: maxHp,
      maxHp,
      shield: dInfo.startShield || 0,
      maxShield: 100,
      stamina: maxStamina,
      maxStamina,
      speed: 235 * (dInfo.speedMult || 1),
      dmgMult: dInfo.dmgMult || 1,
      bowMult: dInfo.bowMult || 1,
      waterImmune: !!dInfo.waterImmune,
      inventory,
      activeSlot: 0,
      alive: true,
      kills: 0,
      damageDealt: 0,
      // Combate y habilidades
      fireCooldown: 0,
      bowCharging: false,
      bowCharge: 0,
      dodgeTimer: 0,
      dodgeCooldown: 0,
      dodgeDirX: 0,
      dodgeDirY: 0,
      speedBuffTimer: 0,
      inBush: false,
      meleeAnim: 0,
      // IA para bots
      aiState: 'LOOT',
      aiTargetX: x,
      aiTargetY: y,
      aiChangeTimer: 0,
      isCareer: [1, 2, 4].includes(Number(district))
    };
  }

  // ==================== INICIAR PARTIDA ====================
  function startNewMatch() {
    sfx.init();
    generateArena();

    const chosenName = (inputName.value || 'Katniss').trim().slice(0, 16);
    const chosenDistrict = Number(selectDistrict.value) || 12;

    tributes = [];

    // Jugador en el pedestal 0
    const p0 = pedestals[0];
    player = createTribute({
      id: 0,
      name: chosenName,
      district: chosenDistrict,
      isPlayer: true,
      x: p0.x,
      y: p0.y,
      angle: p0.angle
    });
    tributes.push(player);

    // 23 Tributos con IA en los demás pedestales
    for (let i = 1; i < TOTAL_TRIBUTES; i++) {
      const ped = pedestals[i];
      const botMeta = BOT_NAMES[(i - 1) % BOT_NAMES.length];
      const bot = createTribute({
        id: i,
        name: botMeta.name,
        district: botMeta.district,
        isPlayer: false,
        x: ped.x,
        y: ped.y,
        angle: ped.angle
      });
      tributes.push(bot);
    }

    // Reiniciar Tormenta / Anillo de Fuego
    storm.currentRadius = 2150;
    storm.targetRadius = 1450;
    storm.phase = 1;
    storm.phaseTimer = 35;
    storm.shrinking = false;

    matchTime = 0;
    countdownTimer = 5.0;
    airdropTimer = 22;
    gameState = 'COUNTDOWN';

    // Actualizar HUD inicial
    const dInfo = DISTRICTS[chosenDistrict] || DISTRICTS[12];
    hudDistrict.textContent = `D${chosenDistrict}`;
    hudName.textContent = player.name;
    hudPerk.textContent = dInfo.perk;
    killFeed.innerHTML = '';

    startScreen.classList.remove('active');
    endScreen.classList.remove('active');
    hud.classList.remove('hidden');
    countdownBanner.classList.remove('hidden');

    updateInventoryUI();
    updateHUD();
  }

  // ==================== SISTEMA DE INVENTARIO ====================
  function getActiveItem(t) {
    return t.inventory[t.activeSlot] || null;
  }

  function giveItemToTribute(t, newItem) {
    // 1. Si ya tiene un ítem igual con munición/acumulable, sumar munición
    for (let i = 0; i < 5; i++) {
      const slotItem = t.inventory[i];
      if (slotItem && slotItem.id === newItem.id && slotItem.ammo !== undefined) {
        slotItem.ammo = Math.min(slotItem.maxAmmo || 99, slotItem.ammo + newItem.ammo);
        if (t.isPlayer) {
          sfx.pickup();
          addFloatingText(t.x, t.y - 28, `+${newItem.name}`, '#fbbf24');
          updateInventoryUI();
        }
        return true;
      }
    }

    // 2. Buscar ranura vacía
    for (let i = 0; i < 5; i++) {
      if (!t.inventory[i]) {
        t.inventory[i] = newItem;
        if (t.isPlayer) {
          // Si estaba con las manos vacías, seleccionar automáticamente la nueva arma
          if (!getActiveItem(t)) t.activeSlot = i;
          sfx.pickup();
          addFloatingText(t.x, t.y - 28, `${newItem.icon} ${newItem.name}`, '#fbbf24');
          updateInventoryUI();
        }
        return true;
      }
    }

    // 3. Si es el jugador y el inventario está lleno, reemplazar la ranura activa y tirar el anterior
    if (t.isPlayer) {
      const old = t.inventory[t.activeSlot];
      if (old) {
        groundLoot.push({
          x: t.x + rand(-20, 20),
          y: t.y + rand(-20, 20),
          item: old,
          radius: 18,
          bobOffset: 0
        });
      }
      t.inventory[t.activeSlot] = newItem;
      sfx.pickup();
      addFloatingText(t.x, t.y - 28, `${newItem.icon} ${newItem.name}`, '#fbbf24');
      updateInventoryUI();
      return true;
    }

    return false;
  }

  function updateInventoryUI() {
    if (!player) return;
    const slots = inventoryBar.querySelectorAll('.inv-slot');
    slots.forEach((slotEl, idx) => {
      const item = player.inventory[idx];
      slotEl.className = 'inv-slot';
      if (idx === player.activeSlot) slotEl.classList.add('active');
      if (item) {
        slotEl.classList.add(`rarity-${item.rarity}`);
        const ammoHtml = item.ammo !== undefined ? `<span class="slot-ammo">${item.ammo}</span>` : '';
        slotEl.innerHTML = `
          <span class="slot-key">${idx + 1}</span>
          <span class="slot-icon">${item.shortIcon || item.icon}</span>
          <span class="slot-name">${item.name}</span>
          ${ammoHtml}
        `;
      } else {
        slotEl.innerHTML = `<span class="slot-key">${idx + 1}</span>`;
      }
    });

    const current = getActiveItem(player);
    if (current) {
      weaponHint.innerHTML = `<strong>${current.icon} ${current.name}:</strong> ${current.desc}`;
    } else {
      weaponHint.innerHTML = `Puños desnudos — Acercate a un cofre o arma y presioná <kbd>E</kbd>`;
    }
  }

  // ==================== COMBATE, ARCOS Y EXPLOSIVOS ====================
  function performAttack(t, chargeFactor = 1.0) {
    const item = getActiveItem(t);

    // Sin arma: Golpe cuerpo a cuerpo básico
    if (!item) {
      if (t.fireCooldown > 0) return;
      t.fireCooldown = 0.42;
      t.meleeAnim = 0.18;
      if (t.isPlayer) sfx.meleeSwing();
      meleeStrike(t, 22 * t.dmgMult, 62);
      return;
    }

    // 1. Consumibles (Botiquines, Escudos, Bayas, Adrenalina)
    if (item.type === 'consumable') {
      if (t.fireCooldown > 0) return;
      let used = false;
      if (item.healHp && t.hp < t.maxHp) {
        t.hp = Math.min(t.maxHp, t.hp + item.healHp);
        addFloatingText(t.x, t.y - 25, `+${item.healHp} ❤️`, '#4ade80');
        used = true;
      }
      if (item.healShield && t.shield < t.maxShield) {
        t.shield = Math.min(t.maxShield, t.shield + item.healShield);
        addFloatingText(t.x, t.y - 25, `+${item.healShield} 🛡️`, '#38bdf8');
        used = true;
      }
      if (item.healStamina) {
        t.stamina = Math.min(t.maxStamina, t.stamina + item.healStamina);
        used = true;
      }
      if (item.speedBuff) {
        t.speedBuffTimer = item.speedBuff;
        addFloatingText(t.x, t.y - 35, `⚡ ADRENALINA!`, '#fbbf24');
        used = true;
      }
      if (used) {
        t.fireCooldown = 0.45;
        if (t.isPlayer) sfx.heal();
        consumeItemAmmo(t, t.activeSlot);
      }
      return;
    }

    // 2. Arma Cuerpo a Cuerpo (Katana / Machete)
    if (item.type === 'melee') {
      if (t.fireCooldown > 0) return;
      t.fireCooldown = item.fireRate;
      t.meleeAnim = 0.22;
      if (t.isPlayer) sfx.meleeSwing();
      meleeStrike(t, item.damage * t.dmgMult, item.range);
      return;
    }

    // 3. Lanzables (Granadas, Molotovs, Minas)
    if (item.type === 'throwable') {
      if (t.fireCooldown > 0) return;
      t.fireCooldown = 0.55;
      useThrowableItem(t, item, t.activeSlot);
      return;
    }

    // 4. Arcos (Arco de Caza y Arco Explosivo)
    if (item.type === 'bow') {
      const power = clamp(chargeFactor, 0.35, 1.0);
      const speed = item.projSpeed * (0.55 + 0.45 * power);
      const dmg = item.damage * power * t.bowMult;

      projectiles.push({
        x: t.x + Math.cos(t.angle) * 24,
        y: t.y + Math.sin(t.angle) * 24,
        vx: Math.cos(t.angle) * speed,
        vy: Math.sin(t.angle) * speed,
        angle: t.angle,
        ownerId: t.id,
        damage: dmg,
        traveled: 0,
        maxRange: item.range * (0.6 + 0.4 * power),
        radius: item.explosive ? 6 : 4.5,
        isArrow: true,
        explosive: !!item.explosive,
        explosionDamage: (item.explosionDamage || 0) * t.bowMult,
        explosionRadius: item.explosionRadius || 110,
        pierce: power > 0.92 && !item.explosive
      });

      if (t.isPlayer || dist(t.x, t.y, player.x, player.y) < 750) {
        sfx.bowRelease(item.explosive);
      }
      consumeItemAmmo(t, t.activeSlot);
      t.fireCooldown = 0.25;
      return;
    }

    // 5. Armas de Fuego / Ballesta
    if (item.type === 'gun') {
      if (t.fireCooldown > 0) return;
      t.fireCooldown = item.fireRate;
      const pellets = item.pellets || 1;
      for (let i = 0; i < pellets; i++) {
        const spreadAngle = t.angle + rand(-item.spread, item.spread);
        projectiles.push({
          x: t.x + Math.cos(t.angle) * 24,
          y: t.y + Math.sin(t.angle) * 24,
          vx: Math.cos(spreadAngle) * item.projSpeed,
          vy: Math.sin(spreadAngle) * item.projSpeed,
          angle: spreadAngle,
          ownerId: t.id,
          damage: item.damage * t.dmgMult,
          traveled: 0,
          maxRange: item.range,
          radius: item.pierce ? 4.5 : 3.5,
          isArrow: !!item.pierce,
          explosive: false,
          pierce: !!item.pierce
        });
      }
      if (t.isPlayer || dist(t.x, t.y, player.x, player.y) < 800) {
        sfx.gunShot(pellets > 1);
      }
      consumeItemAmmo(t, t.activeSlot);
    }
  }

  function useThrowableItem(t, item, slotIndex) {
    if (item.throwType === 'mine') {
      mines.push({
        x: t.x + Math.cos(t.angle) * 28,
        y: t.y + Math.sin(t.angle) * 28,
        ownerId: t.id,
        damage: item.damage * t.bowMult,
        radius: item.explosionRadius,
        armTimer: 1.0,
        pulse: 0
      });
      if (t.isPlayer) addFloatingText(t.x, t.y - 24, '🚨 Mina activada', '#f87171');
    } else {
      const targetDist = t.isPlayer
        ? Math.min(430, dist(t.x, t.y, mouse.worldX, mouse.worldY))
        : 340;
      throwables.push({
        x: t.x,
        y: t.y,
        vx: Math.cos(t.angle) * (targetDist * 1.45),
        vy: Math.sin(t.angle) * (targetDist * 1.45),
        ownerId: t.id,
        throwType: item.throwType,
        damage: item.damage * t.bowMult,
        radius: item.explosionRadius,
        timer: item.throwType === 'molotov' ? 0.85 : 1.45,
        rotation: 0
      });
    }
    consumeItemAmmo(t, slotIndex);
  }

  // Lanzamiento rápido con tecla G o Clic Derecho
  function quickThrowExplosive(t) {
    for (let i = 0; i < 5; i++) {
      const it = t.inventory[i];
      if (it && it.type === 'throwable') {
        useThrowableItem(t, it, i);
        return;
      }
    }
  }

  function consumeItemAmmo(t, slotIdx) {
    const it = t.inventory[slotIdx];
    if (!it || it.ammo === undefined) return;
    it.ammo -= 1;
    if (it.ammo <= 0) {
      t.inventory[slotIdx] = null;
    }
    if (t.isPlayer) updateInventoryUI();
  }

  function meleeStrike(attacker, damage, range) {
    // Dañar cajas cercanas
    for (let i = crates.length - 1; i >= 0; i--) {
      const c = crates[i];
      if (dist(attacker.x, attacker.y, c.x, c.y) <= range + c.radius) {
        damageCrate(i, damage * 1.35);
      }
    }
    // Dañar tributos en el cono frontal
    tributes.forEach(target => {
      if (!target.alive || target.id === attacker.id) return;
      const d = dist(attacker.x, attacker.y, target.x, target.y);
      if (d <= range + target.radius) {
        const angleToTarget = Math.atan2(target.y - attacker.y, target.x - attacker.x);
        const angleDiff = Math.abs( Math.atan2(Math.sin(angleToTarget - attacker.angle), Math.cos(angleToTarget - attacker.angle)) );
        if (angleDiff < 1.15) {
          applyDamage(target, damage, attacker, 'Katana/Cuerpo a Cuerpo');
        }
      }
    });
  }

  function triggerExplosion(x, y, radius, damage, ownerId, label = 'Explosión') {
    const owner = tributes.find(t => t.id === ownerId) || null;

    if (dist(x, y, player.x, player.y) < 1100) {
      sfx.explosion();
      const proximity = 1 - clamp(dist(x, y, player.x, player.y) / 900, 0, 1);
      camera.shake = Math.max(camera.shake, 18 * proximity);
    }

    // Partículas de onda expansiva, fuego y humo
    for (let i = 0; i < 36; i++) {
      const a = Math.random() * Math.PI * 2;
      const spd = rand(40, 320);
      particles.push({
        x, y,
        vx: Math.cos(a) * spd,
        vy: Math.sin(a) * spd,
        size: rand(5, 14),
        life: rand(0.28, 0.72),
        maxLife: 0.72,
        color: i % 3 === 0 ? '#fde047' : (i % 2 === 0 ? '#ff4500' : '#475569')
      });
    }

    // Dañar cajas destructibles
    for (let i = crates.length - 1; i >= 0; i--) {
      const c = crates[i];
      if (dist(x, y, c.x, c.y) <= radius + c.radius) {
        damageCrate(i, damage * 1.5);
      }
    }

    // Dañar tributos en el radio
    tributes.forEach(t => {
      if (!t.alive) return;
      const d = dist(x, y, t.x, t.y);
      if (d <= radius + t.radius) {
        const falloff = 1 - (d / (radius + t.radius)) * 0.45;
        // Reducir autodaño al 35% para no frustrar al jugador
        const selfMult = t.id === ownerId ? 0.35 : 1.0;
        const finalDmg = Math.round(damage * falloff * selfMult);
        applyDamage(t, finalDmg, owner, label);

        // Empujón por onda expansiva
        const pushAngle = Math.atan2(t.y - y, t.x - x);
        t.x = clamp(t.x + Math.cos(pushAngle) * 28 * falloff, 40, WORLD_SIZE - 40);
        t.y = clamp(t.y + Math.sin(pushAngle) * 28 * falloff, 40, WORLD_SIZE - 40);
      }
    });
  }

  function damageCrate(index, dmg) {
    const c = crates[index];
    if (!c) return;
    c.hp -= dmg;
    for (let i = 0; i < 5; i++) {
      particles.push({
        x: c.x, y: c.y,
        vx: rand(-90, 90), vy: rand(-90, 90),
        size: rand(3, 6), life: 0.25, maxLife: 0.25, color: '#b45309'
      });
    }
    if (c.hp <= 0) {
      spawnLoot(c.x, c.y, null, Math.random() < 0.35 ? 'epic' : 'rare');
      crates.splice(index, 1);
    }
  }

  function applyDamage(victim, amount, attacker, weaponName = 'Combate') {
    if (!victim.alive || victim.dodgeTimer > 0) return;

    let dmg = Math.max(1, Math.round(amount));
    if (attacker && attacker.id !== victim.id) {
      attacker.damageDealt += dmg;
      if (attacker.isPlayer) sfx.hitMarker();
    }

    // Absorber con Escudo primero
    if (victim.shield > 0) {
      const absorbed = Math.min(victim.shield, dmg);
      victim.shield -= absorbed;
      dmg -= absorbed;
    }

    if (dmg > 0) {
      victim.hp -= dmg;
    }

    addFloatingText(
      victim.x + rand(-12, 12),
      victim.y - 22,
      `-${Math.round(amount)}`,
      victim.isPlayer ? '#ef4444' : '#fbbf24'
    );

    if (victim.hp <= 0) {
      victim.hp = 0;
      victim.alive = false;
      handleTributeDeath(victim, attacker, weaponName);
    }
  }

  function handleTributeDeath(victim, killer, weaponName) {
    // Cañonazo del Capitolio
    sfx.cannonBoom();

    // Soltar su mejor objeto al morir + botiquín/bayas
    victim.inventory.forEach(it => {
      if (it) {
        groundLoot.push({
          x: victim.x + rand(-28, 28),
          y: victim.y + rand(-28, 28),
          item: it,
          radius: 18,
          bobOffset: Math.random() * 3
        });
      }
    });
    spawnLoot(victim.x, victim.y, 'berries');

    if (killer && killer.id !== victim.id) {
      killer.kills += 1;
    }

    const killerText = killer
      ? (killer.id === victim.id ? 'Explosión propia' : `${killer.name} (D${killer.district})`)
      : weaponName;

    // Aviso de Cañonazo en pantalla
    showCannonBanner(`${victim.name} (Distrito ${victim.district}) cayó ante ${killerText}`);
    addKillFeedItem(`💥 <strong>${victim.name} (D${victim.district})</strong> eliminado por ${killerText}`);

    const aliveCount = tributes.filter(t => t.alive).length;

    if (victim.isPlayer) {
      endMatch(false, aliveCount + 1);
    } else if (aliveCount === 1 && player.alive) {
      endMatch(true, 1);
    }
  }

  function showCannonBanner(text) {
    cannonDetail.textContent = text;
    cannonBanner.classList.remove('hidden');
    if (cannonTimeout) clearTimeout(cannonTimeout);
    cannonTimeout = setTimeout(() => {
      cannonBanner.classList.add('hidden');
    }, 3400);
  }

  function addKillFeedItem(html) {
    const div = document.createElement('div');
    div.className = 'kill-item';
    div.innerHTML = html;
    killFeed.prepend(div);
    while (killFeed.children.length > 5) {
      killFeed.removeChild(killFeed.lastChild);
    }
  }

  function addFloatingText(x, y, text, color = '#ffffff') {
    floatingTexts.push({ x, y, text, color, life: 0.9, maxLife: 0.9 });
  }

  // ==================== INTERACCIÓN (ABRIR COFRES Y AGARRAR ARMAS) ====================
  function tryInteract(t) {
    // 1. Abrir cofre cercano
    for (let i = 0; i < chests.length; i++) {
      const ch = chests[i];
      if (!ch.opened && dist(t.x, t.y, ch.x, ch.y) < t.radius + ch.radius + 32) {
        ch.opened = true;
        if (t.isPlayer) sfx.pickup();
        // Soltar 2 objetos del nivel del cofre
        spawnLoot(ch.x - 16, ch.y + 10, null, ch.tier);
        spawnLoot(ch.x + 16, ch.y + 10, null, ch.tier === 'legendary' ? 'epic' : 'rare');
        return true;
      }
    }

    // 2. Recoger arma o suministro del suelo
    let closestIdx = -1;
    let closestDist = 62;
    for (let i = 0; i < groundLoot.length; i++) {
      const g = groundLoot[i];
      const d = dist(t.x, t.y, g.x, g.y);
      if (d < closestDist) {
        closestDist = d;
        closestIdx = i;
      }
    }

    if (closestIdx !== -1) {
      const loot = groundLoot[closestIdx];
      if (giveItemToTribute(t, loot.item)) {
        groundLoot.splice(closestIdx, 1);
        return true;
      }
    }
    return false;
  }

  // ==================== INTELIGENCIA ARTIFICIAL DE LOS 23 BOTS ====================
  function updateBotAI(bot, dt) {
    if (!bot.alive) return;

    bot.aiChangeTimer -= dt;

    // 1. Si tiene poca vida y posee curación, usarla
    if (bot.hp < 58) {
      const healSlot = bot.inventory.findIndex(it => it && it.type === 'consumable' && (it.healHp || it.healShield));
      if (healSlot !== -1) {
        bot.activeSlot = healSlot;
        performAttack(bot);
      }
    }

    // 2. Si está fuera del Anillo de Fuego, correr hacia el centro
    const distFromCenter = dist(bot.x, bot.y, storm.x, storm.y);
    if (distFromCenter > storm.currentRadius - 120) {
      bot.angle = Math.atan2(storm.y - bot.y, storm.x - bot.x);
      moveEntity(bot, Math.cos(bot.angle), Math.sin(bot.angle), dt, true);
      return;
    }

    // 3. Abrir cofres o agarrar mejores armas cercanas automáticamente
    tryInteract(bot);

    // Seleccionar la mejor arma ofensiva que tenga en el inventario
    const bestWeaponSlot = bot.inventory.findIndex(it => it && (it.type === 'bow' || it.type === 'gun' || it.type === 'melee'));
    if (bestWeaponSlot !== -1) bot.activeSlot = bestWeaponSlot;

    // 4. Buscar enemigo visible cercano
    let nearestEnemy = null;
    let nearestDist = 520;
    for (let i = 0; i < tributes.length; i++) {
      const other = tributes[i];
      if (!other.alive || other.id === bot.id) continue;
      // Si el otro está oculto en un arbusto, solo lo ve si está muy cerca
      const maxDetect = other.inBush ? 135 : 520;
      const d = dist(bot.x, bot.y, other.x, other.y);
      if (d < maxDetect && d < nearestDist) {
        nearestDist = d;
        nearestEnemy = other;
      }
    }

    // 5. Buscar cofre o loot cercano si no está armado o no hay enemigo inmediato
    let nearestLoot = null;
    let lootDist = 360;
    for (let i = 0; i < groundLoot.length; i++) {
      const g = groundLoot[i];
      const d = dist(bot.x, bot.y, g.x, g.y);
      if (d < lootDist) {
        lootDist = d;
        nearestLoot = g;
      }
    }
    if (!nearestLoot) {
      for (let i = 0; i < chests.length; i++) {
        const ch = chests[i];
        if (!ch.opened) {
          const d = dist(bot.x, bot.y, ch.x, ch.y);
          if (d < lootDist) {
            lootDist = d;
            nearestLoot = ch;
          }
        }
      }
    }

    const activeWeapon = getActiveItem(bot);

    if (nearestEnemy && (activeWeapon || nearestDist < 140)) {
      // Apuntar al enemigo
      bot.angle = Math.atan2(nearestEnemy.y - bot.y, nearestEnemy.x - bot.x);

      // Lanzar explosivo si tiene y el enemigo está a media distancia
      if (nearestDist > 140 && nearestDist < 340 && Math.random() < 0.015) {
        quickThrowExplosive(bot);
      }

      const idealRange = (!activeWeapon || activeWeapon.type === 'melee') ? 52 : 280;
      if (nearestDist > idealRange) {
        moveEntity(bot, Math.cos(bot.angle), Math.sin(bot.angle), dt, false);
      } else if (nearestDist < idealRange * 0.65 && activeWeapon && activeWeapon.type !== 'melee') {
        moveEntity(bot, -Math.cos(bot.angle), -Math.sin(bot.angle), dt, false);
      } else {
        // Movimiento lateral táctico (strafe)
        const strafe = bot.id % 2 === 0 ? 1 : -1;
        moveEntity(bot, -Math.sin(bot.angle) * strafe * 0.6, Math.cos(bot.angle) * strafe * 0.6, dt, false);
      }

      if (activeWeapon && activeWeapon.type === 'bow') {
        bot.bowCharging = true;
        bot.bowCharge += dt / activeWeapon.chargeTime;
        if (bot.bowCharge >= 0.85) {
          performAttack(bot, bot.bowCharge);
          bot.bowCharging = false;
          bot.bowCharge = 0;
        }
      } else {
        performAttack(bot, 1.0);
      }
    } else if (nearestLoot && bot.inventory.some(s => s === null)) {
      const a = Math.atan2(nearestLoot.y - bot.y, nearestLoot.x - bot.x);
      bot.angle = a;
      moveEntity(bot, Math.cos(a), Math.sin(a), dt, false);
    } else {
      // Patrullar por el mapa o ir hacia la Cornucopia si es Tributo Profesional
      if (bot.aiChangeTimer <= 0 || dist(bot.x, bot.y, bot.aiTargetX, bot.aiTargetY) < 60) {
        bot.aiChangeTimer = rand(3.0, 6.0);
        if (bot.isCareer && matchTime < 25) {
          bot.aiTargetX = CENTER + rand(-220, 220);
          bot.aiTargetY = CENTER + rand(-220, 220);
        } else {
          const r = rand(120, storm.currentRadius * 0.78);
          const a = rand(0, Math.PI * 2);
          bot.aiTargetX = clamp(CENTER + Math.cos(a) * r, 150, WORLD_SIZE - 150);
          bot.aiTargetY = clamp(CENTER + Math.sin(a) * r, 150, WORLD_SIZE - 150);
        }
      }
      const a = Math.atan2(bot.aiTargetY - bot.y, bot.aiTargetX - bot.x);
      bot.angle = a;
      moveEntity(bot, Math.cos(a), Math.sin(a), dt, false);
    }
  }

  // ==================== FÍSICA Y MOVIMIENTO ====================
  function isInRiver(x, y) {
    // Río horizontal que cruza la arena con 3 puentes de piedra y la isla central de la Cornucopia
    if (dist(x, y, CENTER, CENTER) < 430) return false;
    const inRiverBand = Math.abs(y - CENTER) < 75;
    if (!inRiverBand) return false;
    const onBridgeLeft = Math.abs(x - 750) < 70;
    const onBridgeRight = Math.abs(x - 2450) < 70;
    return !(onBridgeLeft || onBridgeRight);
  }

  function moveEntity(t, dirX, dirY, dt, sprinting) {
    const len = Math.hypot(dirX, dirY);
    if (len === 0 && t.dodgeTimer <= 0) return;

    let speed = t.speed;

    // Buff de Adrenalina
    if (t.speedBuffTimer > 0) {
      speed *= 1.35;
      t.stamina = t.maxStamina;
    }

    // Penalización de agua salvo Distrito 4
    if (isInRiver(t.x, t.y) && !t.waterImmune) {
      speed *= 0.65;
    }

    // Esquivar / Rodar (Espacio)
    if (t.dodgeTimer > 0) {
      t.x += t.dodgeDirX * speed * 2.15 * dt;
      t.y += t.dodgeDirY * speed * 2.15 * dt;
    } else {
      const nx = dirX / (len || 1);
      const ny = dirY / (len || 1);

      if (sprinting && t.stamina > 8) {
        speed *= 1.36;
        if (t.speedBuffTimer <= 0) t.stamina = Math.max(0, t.stamina - 28 * dt);
      } else {
        t.stamina = Math.min(t.maxStamina, t.stamina + 18 * dt);
      }

      // Al tensar el arco se camina ligeramente más despacio
      if (t.bowCharging) speed *= 0.74;

      t.x += nx * speed * dt;
      t.y += ny * speed * dt;
    }

    // Colisión con árboles
    for (let i = 0; i < trees.length; i++) {
      const tr = trees[i];
      const d = dist(t.x, t.y, tr.x, tr.y);
      const minDist = t.radius + tr.radius * 0.68;
      if (d < minDist && d > 0.001) {
        const push = minDist - d;
        t.x += ((t.x - tr.x) / d) * push;
        t.y += ((t.y - tr.y) / d) * push;
      }
    }

    // Colisión con la estructura central de la Cornucopia
    const dCorn = dist(t.x, t.y, CENTER, CENTER);
    if (dCorn < t.radius + 68) {
      const push = (t.radius + 68) - dCorn;
      t.x += ((t.x - CENTER) / (dCorn || 1)) * push;
      t.y += ((t.y - CENTER) / (dCorn || 1)) * push;
    }

    t.x = clamp(t.x, 35, WORLD_SIZE - 35);
    t.y = clamp(t.y, 35, WORLD_SIZE - 35);
  }

  // ==================== BUCLE PRINCIPAL DE ACTUALIZACIÓN ====================
  function update(dt) {
    if (gameState === 'MENU' || gameState === 'ENDED') return;

    // 1. Fase de Cuenta Regresiva de 5 segundos en los Pedestales
    if (gameState === 'COUNTDOWN') {
      countdownTimer -= dt;
      const sec = Math.ceil(countdownTimer);
      countdownNumber.textContent = sec > 0 ? sec : '¡YA!';
      player.angle = Math.atan2(mouse.worldY - player.y, mouse.worldX - player.x);

      if (countdownTimer <= 0) {
        gameState = 'PLAYING';
        countdownBanner.classList.add('hidden');
        sfx.gongStart();
        showCannonBanner('¡EL GONG HA SONADO! Que comiencen los 75º Juegos del Hambre.');
      }
      camera.x = player.x;
      camera.y = player.y;
      return;
    }

    matchTime += dt;

    // 2. Paracaídas de Patrocinadores (Airdrops)
    airdropTimer -= dt;
    if (airdropTimer <= 0) {
      airdropTimer = rand(26, 38);
      const r = rand(180, Math.max(260, storm.currentRadius * 0.65));
      const a = rand(0, Math.PI * 2);
      const ax = CENTER + Math.cos(a) * r;
      const ay = CENTER + Math.sin(a) * r;
      airdrops.push({ x: ax, y: ay, altitude: 1.0 });
      addKillFeedItem(`🪂 <strong>Paracaídas del Capitolio</strong> cayendo en la Arena`);
    }

    for (let i = airdrops.length - 1; i >= 0; i--) {
      const ad = airdrops[i];
      ad.altitude -= dt * 0.35;
      if (ad.altitude <= 0) {
        chests.push({ x: ad.x, y: ad.y, tier: 'legendary', opened: false, radius: 24 });
        spawnLoot(ad.x + 24, ad.y, 'explosive_bow');
        airdrops.splice(i, 1);
      }
    }

    // 3. Actualizar Jugador
    if (player.alive) {
      player.angle = Math.atan2(mouse.worldY - player.y, mouse.worldX - player.x);

      let dx = 0, dy = 0;
      if (keys['KeyW'] || keys['ArrowUp']) dy -= 1;
      if (keys['KeyS'] || keys['ArrowDown']) dy += 1;
      if (keys['KeyA'] || keys['ArrowLeft']) dx -= 1;
      if (keys['KeyD'] || keys['ArrowRight']) dx += 1;

      const sprinting = !!(keys['ShiftLeft'] || keys['ShiftRight']);
      moveEntity(player, dx, dy, dt, sprinting);

      if (dx === 0 && dy === 0) {
        player.stamina = Math.min(player.maxStamina, player.stamina + 22 * dt);
      }

      // Recolección automática de munición o si pasa muy cerca de bayas/botiquines con espacio libre
      for (let i = groundLoot.length - 1; i >= 0; i--) {
        const g = groundLoot[i];
        if (dist(player.x, player.y, g.x, g.y) < player.radius + g.radius) {
          const hasEmpty = player.inventory.some(s => s === null);
          const hasStack = player.inventory.some(s => s && s.id === g.item.id && s.ammo !== undefined);
          if (hasEmpty || hasStack) {
            if (giveItemToTribute(player, g.item)) {
              groundLoot.splice(i, 1);
            }
          }
        }
      }

      // Manejo de Tensión del Arco o Fuego Automático
      const activeItem = getActiveItem(player);
      if (activeItem && activeItem.type === 'bow') {
        if (mouse.leftDown && player.fireCooldown <= 0) {
          player.bowCharging = true;
          player.bowCharge = Math.min(1.0, player.bowCharge + dt / activeItem.chargeTime);
          chargeBarContainer.classList.remove('hidden');
          chargeLabel.textContent = activeItem.explosive ? '🔥 TENSIÓN ARCO EXPLOSIVO' : '🏹 TENSIÓN DEL ARCO';
          chargeFill.style.width = `${Math.round(player.bowCharge * 100)}%`;
        } else if (player.bowCharging) {
          performAttack(player, player.bowCharge);
          player.bowCharging = false;
          player.bowCharge = 0;
          chargeBarContainer.classList.add('hidden');
        }
      } else {
        player.bowCharging = false;
        player.bowCharge = 0;
        chargeBarContainer.classList.add('hidden');
        if (mouse.leftDown) {
          performAttack(player, 1.0);
        }
      }

      // Mostrar indicador de interacción cercano
      updateInteractPrompt();
    }

    // 4. Actualizar todos los Tributos (Cooldowns, Sigilo en arbustos, Daño de Tormenta)
    tributes.forEach(t => {
      if (!t.alive) return;
      if (t.fireCooldown > 0) t.fireCooldown -= dt;
      if (t.dodgeTimer > 0) t.dodgeTimer -= dt;
      if (t.dodgeCooldown > 0) t.dodgeCooldown -= dt;
      if (t.speedBuffTimer > 0) t.speedBuffTimer -= dt;
      if (t.meleeAnim > 0) t.meleeAnim -= dt;

      // Comprobar si está dentro de un arbusto
      t.inBush = bushes.some(b => dist(t.x, t.y, b.x, b.y) < b.radius * 0.85);

      // IA para bots
      if (!t.isPlayer) {
        updateBotAI(t, dt);
      }

      // Daño del Anillo de Fuego si está fuera de la zona segura
      if (dist(t.x, t.y, storm.x, storm.y) > storm.currentRadius) {
        if (Math.floor((matchTime - dt) * 2) !== Math.floor(matchTime * 2)) {
          applyDamage(t, storm.damagePerSec * 0.5, null, 'Anillo de Fuego');
        }
      }
    });

    // 5. Actualizar Proyectiles (Flechas, Flechas Explosivas, Balas)
    for (let i = projectiles.length - 1; i >= 0; i--) {
      const p = projectiles[i];
      const stepX = p.vx * dt;
      const stepY = p.vy * dt;
      p.x += stepX;
      p.y += stepY;
      p.traveled += Math.hypot(stepX, stepY);

      // Estela de fuego para el Arco Explosivo
      if (p.explosive && Math.random() < 0.75) {
        particles.push({
          x: p.x, y: p.y,
          vx: rand(-35, 35), vy: rand(-35, 35),
          size: rand(3, 6), life: 0.22, maxLife: 0.22,
          color: Math.random() < 0.5 ? '#fbbf24' : '#ff4500'
        });
      }

      let removeProj = false;

      // Colisión con árboles o Cornucopia
      if (dist(p.x, p.y, CENTER, CENTER) < 64 || trees.some(tr => dist(p.x, p.y, tr.x, tr.y) < tr.radius * 0.65)) {
        removeProj = true;
      }

      // Colisión con cajas
      if (!removeProj) {
        for (let cIdx = crates.length - 1; cIdx >= 0; cIdx--) {
          const c = crates[cIdx];
          if (dist(p.x, p.y, c.x, c.y) < c.radius + p.radius) {
            damageCrate(cIdx, p.damage);
            removeProj = true;
            break;
          }
        }
      }

      // Colisión con tributos
      if (!removeProj) {
        for (let tIdx = 0; tIdx < tributes.length; tIdx++) {
          const t = tributes[tIdx];
          if (!t.alive || t.id === p.ownerId || t.dodgeTimer > 0) continue;
          if (dist(p.x, p.y, t.x, t.y) < t.radius + p.radius) {
            const owner = tributes.find(o => o.id === p.ownerId) || null;
            applyDamage(t, p.damage, owner, p.explosive ? 'Arco Explosivo' : (p.isArrow ? 'Arco de Caza' : 'Arma de Fuego'));
            if (!p.pierce) {
              removeProj = true;
              break;
            }
          }
        }
      }

      if (p.traveled >= p.maxRange || p.x < 0 || p.x > WORLD_SIZE || p.y < 0 || p.y > WORLD_SIZE) {
        removeProj = true;
      }

      if (removeProj) {
        if (p.explosive) {
          triggerExplosion(p.x, p.y, p.explosionRadius, p.explosionDamage, p.ownerId, 'Arco Explosivo');
        }
        projectiles.splice(i, 1);
      }
    }

    // 6. Actualizar Granadas y Molotovs en el aire
    for (let i = throwables.length - 1; i >= 0; i--) {
      const th = throwables[i];
      th.x += th.vx * dt;
      th.y += th.vy * dt;
      th.vx *= Math.pow(0.18, dt);
      th.vy *= Math.pow(0.18, dt);
      th.rotation += 8 * dt;
      th.timer -= dt;

      if (th.timer <= 0) {
        if (th.throwType === 'molotov') {
          triggerExplosion(th.x, th.y, 75, th.damage, th.ownerId, 'Bomba Molotov');
          fireZones.push({
            x: th.x,
            y: th.y,
            radius: th.radius,
            ownerId: th.ownerId,
            duration: 6.0,
            tickTimer: 0
          });
        } else {
          triggerExplosion(th.x, th.y, th.radius, th.damage, th.ownerId, 'Granada Frag');
        }
        throwables.splice(i, 1);
      }
    }

    // 7. Actualizar Minas de Proximidad
    for (let i = mines.length - 1; i >= 0; i--) {
      const m = mines[i];
      if (m.armTimer > 0) m.armTimer -= dt;
      m.pulse += dt * 5;

      if (m.armTimer <= 0) {
        const triggered = tributes.some(t => t.alive && t.id !== m.ownerId && dist(t.x, t.y, m.x, m.y) < 44);
        if (triggered) {
          triggerExplosion(m.x, m.y, m.radius, m.damage, m.ownerId, 'Mina de Proximidad');
          mines.splice(i, 1);
        }
      }
    }

    // 8. Actualizar Zonas de Fuego (Molotov)
    for (let i = fireZones.length - 1; i >= 0; i--) {
      const fz = fireZones[i];
      fz.duration -= dt;
      fz.tickTimer -= dt;

      if (Math.random() < 0.5) {
        const a = Math.random() * Math.PI * 2;
        const r = Math.random() * fz.radius;
        particles.push({
          x: fz.x + Math.cos(a) * r,
          y: fz.y + Math.sin(a) * r,
          vx: rand(-15, 15),
          vy: rand(-45, -10),
          size: rand(4, 9),
          life: 0.35,
          maxLife: 0.35,
          color: Math.random() < 0.5 ? '#ff4500' : '#fbbf24'
        });
      }

      if (fz.tickTimer <= 0) {
        fz.tickTimer = 0.45;
        const owner = tributes.find(o => o.id === fz.ownerId) || null;
        tributes.forEach(t => {
          if (t.alive && dist(t.x, t.y, fz.x, fz.y) < fz.radius) {
            applyDamage(t, 12, owner, 'Fuego Molotov');
          }
        });
      }

      if (fz.duration <= 0) fireZones.splice(i, 1);
    }

    // 9. Actualizar Anillo de Fuego (Tormenta)
    storm.phaseTimer -= dt;
    if (storm.phaseTimer <= 0) {
      storm.shrinking = !storm.shrinking;
      if (storm.shrinking) {
        storm.phaseTimer = 25;
        addKillFeedItem(`🔥 <strong>¡El Anillo de Fuego se está cerrando!</strong>`);
      } else {
        storm.phase += 1;
        storm.phaseTimer = 30;
        storm.targetRadius = Math.max(240, storm.currentRadius - 380);
        storm.damagePerSec += 4;
      }
    }
    if (storm.shrinking && storm.currentRadius > storm.targetRadius) {
      storm.currentRadius = Math.max(storm.targetRadius, storm.currentRadius - 26 * dt);
    }

    // 10. Partículas y Textos Flotantes
    for (let i = particles.length - 1; i >= 0; i--) {
      const pt = particles[i];
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      pt.life -= dt;
      if (pt.life <= 0) particles.splice(i, 1);
    }

    for (let i = floatingTexts.length - 1; i >= 0; i--) {
      const ft = floatingTexts[i];
      ft.y -= 32 * dt;
      ft.life -= dt;
      if (ft.life <= 0) floatingTexts.splice(i, 1);
    }

    // 11. Cámara con seguimiento suave y Screen Shake
    if (player) {
      camera.x += (player.x - camera.x) * Math.min(1, 10 * dt);
      camera.y += (player.y - camera.y) * Math.min(1, 10 * dt);
    }
    if (camera.shake > 0) {
      camera.shake = Math.max(0, camera.shake - 38 * dt);
    }

    updateHUD();
  }

  function updateInteractPrompt() {
    let label = null;
    for (let i = 0; i < chests.length; i++) {
      const ch = chests[i];
      if (!ch.opened && dist(player.x, player.y, ch.x, ch.y) < 58) {
        label = `Abrir Cofre ${ch.tier === 'legendary' ? 'Legendario 🌟' : 'de Suministros'}`;
        break;
      }
    }
    if (!label) {
      for (let i = 0; i < groundLoot.length; i++) {
        const g = groundLoot[i];
        if (dist(player.x, player.y, g.x, g.y) < 56) {
          label = `${g.item.icon} ${g.item.name}`;
          break;
        }
      }
    }
    if (label) {
      interactItemName.textContent = label;
      interactPrompt.classList.remove('hidden');
    } else {
      interactPrompt.classList.add('hidden');
    }
  }

  function updateHUD() {
    if (!player) return;
    const aliveCount = tributes.filter(t => t.alive).length;
    hudAlive.textContent = `${aliveCount} / ${TOTAL_TRIBUTES}`;
    hudKills.textContent = player.kills;

    const secs = Math.max(0, Math.ceil(storm.phaseTimer));
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    hudStormTimer.textContent = `${m}:${s}`;

    barShield.style.width = `${(player.shield / player.maxShield) * 100}%`;
    textShield.textContent = Math.round(player.shield);

    barHp.style.width = `${(player.hp / player.maxHp) * 100}%`;
    textHp.textContent = `${Math.ceil(player.hp)} / ${player.maxHp}`;

    barStamina.style.width = `${(player.stamina / player.maxStamina) * 100}%`;
  }

  // ==================== FIN DE PARTIDA ====================
  function endMatch(isVictory, rank) {
    gameState = 'ENDED';
    chargeBarContainer.classList.add('hidden');
    interactPrompt.classList.add('hidden');

    const badge = document.getElementById('end-badge');
    const title = document.getElementById('end-title');
    const subtitle = document.getElementById('end-subtitle');

    badge.textContent = `PUESTO #${rank} / ${TOTAL_TRIBUTES}`;
    if (isVictory) {
      title.textContent = '¡VENCEDOR DE LOS JUEGOS DEL HAMBRE!';
      title.style.color = '#fbbf24';
      subtitle.textContent = `${player.name} del Distrito ${player.district} ha sobrevivido a la Arena en Llamas.`;
    } else {
      title.textContent = 'HAS CAÍDO EN LA ARENA';
      title.style.color = '#f87171';
      subtitle.textContent = `Sonó el cañonazo por el Distrito ${player.district}.`;
    }

    document.getElementById('stat-rank').textContent = `#${rank}`;
    document.getElementById('stat-kills').textContent = player.kills;
    document.getElementById('stat-damage').textContent = Math.round(player.damageDealt);

    const mins = String(Math.floor(matchTime / 60)).padStart(2, '0');
    const secs = String(Math.floor(matchTime % 60)).padStart(2, '0');
    document.getElementById('stat-time').textContent = `${mins}:${secs}`;

    endScreen.classList.add('active');
  }

  // ==================== RENDERIZADO GRÁFICO (CANVAS 2D) ====================
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const shakeX = camera.shake > 0 ? rand(-camera.shake, camera.shake) : 0;
    const shakeY = camera.shake > 0 ? rand(-camera.shake, camera.shake) : 0;

    const camLeft = camera.x - canvas.width / 2 + shakeX;
    const camTop = camera.y - canvas.height / 2 + shakeY;

    ctx.save();
    ctx.translate(-camLeft, -camTop);

    // 1. Suelo del Bosque y la Arena
    ctx.fillStyle = '#132217';
    ctx.fillRect(0, 0, WORLD_SIZE, WORLD_SIZE);

    // Cuadrícula táctica sutil
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    const startGridX = Math.floor(camLeft / 100) * 100;
    const startGridY = Math.floor(camTop / 100) * 100;
    for (let gx = startGridX; gx < camLeft + canvas.width + 100; gx += 100) {
      ctx.beginPath();
      ctx.moveTo(gx, camTop);
      ctx.lineTo(gx, camTop + canvas.height);
      ctx.stroke();
    }
    for (let gy = startGridY; gy < camTop + canvas.height + 100; gy += 100) {
      ctx.beginPath();
      ctx.moveTo(camLeft, gy);
      ctx.lineTo(camLeft + canvas.width, gy);
      ctx.stroke();
    }

    // 2. Río y Puentes
    ctx.fillStyle = '#0c4a6e';
    ctx.fillRect(0, CENTER - 75, WORLD_SIZE, 150);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(0, CENTER - 55, WORLD_SIZE, 110);

    // Puentes de madera/piedra
    [750, 2450].forEach(bx => {
      ctx.fillStyle = '#475569';
      ctx.fillRect(bx - 70, CENTER - 84, 140, 168);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.strokeRect(bx - 70, CENTER - 84, 140, 168);
    });

    // 3. Explanada de Piedra de la Cornucopia Central
    const gradPlaza = ctx.createRadialGradient(CENTER, CENTER, 40, CENTER, CENTER, 430);
    gradPlaza.addColorStop(0, '#334155');
    gradPlaza.addColorStop(0.75, '#1e293b');
    gradPlaza.addColorStop(1, '#132217');
    ctx.fillStyle = gradPlaza;
    ctx.beginPath();
    ctx.arc(CENTER, CENTER, 430, 0, Math.PI * 2);
    ctx.fill();

    // Anillos grabados en la piedra del Capitolio
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.22)';
    ctx.lineWidth = 2;
    [160, 280, 370, 425].forEach(r => {
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, r, 0, Math.PI * 2);
      ctx.stroke();
    });

    // 4. Pedestales de los 24 Tributos
    pedestals.forEach((ped, idx) => {
      ctx.fillStyle = idx === 0 ? '#b45309' : '#334155';
      ctx.strokeStyle = idx === 0 ? '#fbbf24' : '#64748b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(ped.x, ped.y, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    // 5. Estructura Dorada de la Cornucopia en el centro
    ctx.save();
    ctx.translate(CENTER, CENTER);
    const cornGrad = ctx.createLinearGradient(-65, -65, 65, 65);
    cornGrad.addColorStop(0, '#fbbf24');
    cornGrad.addColorStop(0.5, '#d97706');
    cornGrad.addColorStop(1, '#78350f');
    ctx.fillStyle = cornGrad;
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(64, 0);
    ctx.quadraticCurveTo(20, -68, -66, -24);
    ctx.quadraticCurveTo(-84, 0, -54, 48);
    ctx.quadraticCurveTo(15, 64, 64, 0);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fef3c7';
    ctx.font = 'bold 12px Cinzel, serif';
    ctx.textAlign = 'center';
    ctx.fillText('CORNUCOPIA', 0, 4);
    ctx.restore();

    // 6. Zonas de Fuego (Molotov)
    fireZones.forEach(fz => {
      const fGrad = ctx.createRadialGradient(fz.x, fz.y, 10, fz.x, fz.y, fz.radius);
      fGrad.addColorStop(0, 'rgba(255, 69, 0, 0.58)');
      fGrad.addColorStop(0.7, 'rgba(245, 158, 11, 0.35)');
      fGrad.addColorStop(1, 'rgba(255, 69, 0, 0)');
      ctx.fillStyle = fGrad;
      ctx.beginPath();
      ctx.arc(fz.x, fz.y, fz.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // 7. Minas de Proximidad
    mines.forEach(m => {
      // Si es del jugador o aún se está armando se ve clara; si es enemiga apenas titila
      const isFriendly = player && m.ownerId === player.id;
      const alpha = isFriendly || m.armTimer > 0 ? 0.9 : (Math.sin(m.pulse) > 0.7 ? 0.45 : 0.12);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(m.x, m.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(m.x, m.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 8. Cofres y Cajas Destructibles
    chests.forEach(ch => {
      if (ch.opened) return;
      ctx.save();
      ctx.translate(ch.x, ch.y);
      ctx.fillStyle = ch.tier === 'legendary' ? '#d97706' : (ch.tier === 'epic' ? '#7e22ce' : '#0284c7');
      ctx.strokeStyle = ch.tier === 'legendary' ? '#fef08a' : '#e2e8f0';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(-18, -14, 36, 28, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fef08a';
      ctx.fillRect(-5, -3, 10, 6);
      ctx.restore();
    });

    crates.forEach(c => {
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.fillStyle = '#78350f';
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 2;
      ctx.fillRect(-18, -18, 36, 36);
      ctx.strokeRect(-18, -18, 36, 36);
      ctx.beginPath();
      ctx.moveTo(-18, -18);
      ctx.lineTo(18, 18);
      ctx.moveTo(18, -18);
      ctx.lineTo(-18, 18);
      ctx.stroke();
      ctx.restore();
    });

    // 9. Armas y Objetos en el Suelo (Con aura de rareza)
    const rarityColors = {
      common: '#94a3b8',
      rare: '#38bdf8',
      epic: '#c084fc',
      legendary: '#f59e0b'
    };

    groundLoot.forEach(g => {
      const bob = Math.sin(matchTime * 4 + g.bobOffset) * 3;
      const col = rarityColors[g.item.rarity] || '#38bdf8';

      ctx.save();
      ctx.translate(g.x, g.y + bob);

      // Resplandor según rareza
      ctx.fillStyle = col + '33';
      ctx.strokeStyle = col;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 17, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.font = '18px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(g.item.shortIcon || g.item.icon, 0, 1);
      ctx.restore();
    });

    // 10. Línea de Puntería / Tensión del Arco del Jugador
    if (player && player.alive && player.bowCharging) {
      const activeBow = getActiveItem(player);
      if (activeBow) {
        const power = clamp(player.bowCharge, 0.35, 1.0);
        const aimDist = activeBow.range * (0.6 + 0.4 * power);
        const endX = player.x + Math.cos(player.angle) * aimDist;
        const endY = player.y + Math.sin(player.angle) * aimDist;

        ctx.save();
        ctx.strokeStyle = activeBow.explosive ? 'rgba(255, 69, 0, 0.65)' : 'rgba(251, 191, 36, 0.55)';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.moveTo(player.x, player.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        if (activeBow.explosive) {
          ctx.fillStyle = 'rgba(255, 69, 0, 0.16)';
          ctx.beginPath();
          ctx.arc(endX, endY, activeBow.explosionRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
        ctx.restore();
      }
    }

    // 11. Tributos (Jugador y Bots)
    tributes.forEach(t => {
      if (!t.alive) return;

      // Si un bot está en un arbusto y lejos del jugador, ocultarlo
      if (!t.isPlayer && t.inBush && player && dist(t.x, t.y, player.x, player.y) > 140) {
        return;
      }

      ctx.save();
      ctx.translate(t.x, t.y);
      if (t.inBush) ctx.globalAlpha = 0.5;

      // Animación de tajo cuerpo a cuerpo
      if (t.meleeAnim > 0) {
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, 48, t.angle - 0.9, t.angle + 0.9);
        ctx.stroke();
      }

      // Rotar cuerpo hacia donde apunta
      ctx.rotate(t.angle);

      // Manos y Arma equipada
      const held = getActiveItem(t);
      if (held && held.type === 'bow') {
        // Dibujar Arco y flecha tensada
        ctx.strokeStyle = held.explosive ? '#ff4500' : '#d97706';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(12, 0, 16, -1.1, 1.1);
        ctx.stroke();
        // Flecha
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(4, 0);
        ctx.lineTo(28, 0);
        ctx.stroke();
      } else if (held && held.type === 'gun') {
        ctx.fillStyle = '#334155';
        ctx.fillRect(10, -4, 20, 8);
      } else if (held && held.type === 'melee') {
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(12, -2, 24, 4);
      }

      // Cuerpo circular del Tributo
      ctx.fillStyle = t.isPlayer ? '#f59e0b' : (t.isCareer ? '#dc2626' : '#3b82f6');
      ctx.strokeStyle = t.isPlayer ? '#fef08a' : '#0f172a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, t.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Aura de Escudo si tiene escudo activo
      if (t.shield > 0) {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, t.radius + 4, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();

      // Nombre, Distrito y Barra de Vida sobre el Tributo
      ctx.save();
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = t.isPlayer ? '#fef08a' : '#f8fafc';
      ctx.fillText(`${t.name} [D${t.district}]`, t.x, t.y - 31);

      const barW = 38;
      ctx.fillStyle = 'rgba(0,0,0,0.65)';
      ctx.fillRect(t.x - barW / 2, t.y - 26, barW, 5);
      ctx.fillStyle = t.isPlayer ? '#4ade80' : '#ef4444';
      ctx.fillRect(t.x - barW / 2, t.y - 26, barW * (t.hp / t.maxHp), 5);
      ctx.restore();
    });

    // 12. Proyectiles (Flechas y Balas) y Lanzables en el aire
    projectiles.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      if (p.isArrow) {
        ctx.strokeStyle = p.explosive ? '#ff4500' : '#fef08a';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-12, 0);
        ctx.lineTo(10, 0);
        ctx.stroke();
        // Punta de flecha
        ctx.fillStyle = p.explosive ? '#fde047' : '#ffffff';
        ctx.beginPath();
        ctx.arc(10, 0, p.explosive ? 4.5 : 3, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    throwables.forEach(th => {
      ctx.save();
      ctx.translate(th.x, th.y);
      ctx.rotate(th.rotation);
      ctx.font = '18px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(th.throwType === 'molotov' ? '🍾' : '💣', 0, 0);
      ctx.restore();
    });

    // 13. Arbustos de Sigilo y Árboles (dibujados por encima para dar cobertura visual)
    bushes.forEach(b => {
      ctx.fillStyle = 'rgba(22, 101, 52, 0.82)';
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    trees.forEach(tr => {
      // Tronco
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.arc(tr.x, tr.y, tr.radius * 0.35, 0, Math.PI * 2);
      ctx.fill();
      // Copa del árbol
      ctx.fillStyle = '#064e3b';
      ctx.strokeStyle = '#047857';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(tr.x, tr.y, tr.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    // 14. Paracaídas de Patrocinadores descendiendo
    airdrops.forEach(ad => {
      ctx.save();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(ad.x, ad.y, 26, 0, Math.PI * 2);
      ctx.stroke();
      ctx.font = '26px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🪂', ad.x, ad.y - ad.altitude * 110);
      ctx.restore();
    });

    // 15. Partículas y Textos de Daño
    particles.forEach(pt => {
      ctx.save();
      ctx.globalAlpha = clamp(pt.life / pt.maxLife, 0, 1);
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    floatingTexts.forEach(ft => {
      ctx.save();
      ctx.globalAlpha = clamp(ft.life / ft.maxLife, 0, 1);
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = ft.color;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    });

    // 16. El Anillo de Fuego (Tormenta)
    ctx.save();
    ctx.beginPath();
    ctx.rect(-1000, -1000, WORLD_SIZE + 2000, WORLD_SIZE + 2000);
    ctx.arc(storm.x, storm.y, storm.currentRadius, 0, Math.PI * 2, true);
    ctx.fillStyle = 'rgba(234, 88, 12, 0.34)';
    ctx.fill();

    ctx.strokeStyle = '#ff4500';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(storm.x, storm.y, storm.currentRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    ctx.restore();

    // Renderizar Minimapa en vivo
    renderMinimap();
  }

  function renderMinimap() {
    const mw = minimapCanvas.width;
    const mh = minimapCanvas.height;
    const scale = mw / WORLD_SIZE;

    minimapCtx.clearRect(0, 0, mw, mh);

    // Fondo
    minimapCtx.fillStyle = '#0d1912';
    minimapCtx.fillRect(0, 0, mw, mh);

    // Río
    minimapCtx.fillStyle = '#0284c7';
    minimapCtx.fillRect(0, (CENTER - 70) * scale, mw, 140 * scale);

    // Cornucopia
    minimapCtx.fillStyle = '#fbbf24';
    minimapCtx.beginPath();
    minimapCtx.arc(CENTER * scale, CENTER * scale, 6, 0, Math.PI * 2);
    minimapCtx.fill();

    // Cofres cerrados
    minimapCtx.fillStyle = 'rgba(251, 191, 36, 0.65)';
    chests.forEach(ch => {
      if (!ch.opened) {
        minimapCtx.fillRect(ch.x * scale - 1.5, ch.y * scale - 1.5, 3, 3);
      }
    });

    // Anillo de Fuego
    minimapCtx.strokeStyle = '#ff4500';
    minimapCtx.lineWidth = 2;
    minimapCtx.beginPath();
    minimapCtx.arc(storm.x * scale, storm.y * scale, storm.currentRadius * scale, 0, Math.PI * 2);
    minimapCtx.stroke();

    // Jugador en el minimapa
    if (player && player.alive) {
      minimapCtx.fillStyle = '#4ade80';
      minimapCtx.strokeStyle = '#ffffff';
      minimapCtx.lineWidth = 1.5;
      minimapCtx.beginPath();
      minimapCtx.arc(player.x * scale, player.y * scale, 4, 0, Math.PI * 2);
      minimapCtx.fill();
      minimapCtx.stroke();
    }
  }

  // ==================== CONTROLES DE TECLADO Y RATÓN ====================
  window.addEventListener('keydown', e => {
    keys[e.code] = true;

    if (gameState !== 'PLAYING' || !player || !player.alive) return;

    // Seleccionar ranuras 1 a 5
    if (['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5'].includes(e.code)) {
      const idx = Number(e.code.replace('Digit', '')) - 1;
      player.activeSlot = idx;
      player.bowCharging = false;
      player.bowCharge = 0;
      chargeBarContainer.classList.add('hidden');
      updateInventoryUI();
    }

    // E o F: Interactuar / Abrir cofre / Agarrar
    if (e.code === 'KeyE' || e.code === 'KeyF') {
      tryInteract(player);
    }

    // G: Lanzar explosivo rápido
    if (e.code === 'KeyG') {
      quickThrowExplosive(player);
    }

    // Q: Soltar ítem actual
    if (e.code === 'KeyQ') {
      const cur = player.inventory[player.activeSlot];
      if (cur) {
        groundLoot.push({
          x: player.x + Math.cos(player.angle) * 32,
          y: player.y + Math.sin(player.angle) * 32,
          item: cur,
          radius: 18,
          bobOffset: 0
        });
        player.inventory[player.activeSlot] = null;
        updateInventoryUI();
      }
    }

    // Espacio: Esquivar / Rodar (Dodge Roll)
    if (e.code === 'Space') {
      e.preventDefault();
      if (player.dodgeCooldown <= 0 && player.stamina >= 22) {
        player.stamina -= 22;
        player.dodgeTimer = 0.24;
        player.dodgeCooldown = 0.85;
        let dx = 0, dy = 0;
        if (keys['KeyW'] || keys['ArrowUp']) dy -= 1;
        if (keys['KeyS'] || keys['ArrowDown']) dy += 1;
        if (keys['KeyA'] || keys['ArrowLeft']) dx -= 1;
        if (keys['KeyD'] || keys['ArrowRight']) dx += 1;
        if (dx === 0 && dy === 0) {
          player.dodgeDirX = Math.cos(player.angle);
          player.dodgeDirY = Math.sin(player.angle);
        } else {
          const len = Math.hypot(dx, dy);
          player.dodgeDirX = dx / len;
          player.dodgeDirY = dy / len;
        }
      }
    }
  });

  window.addEventListener('keyup', e => {
    keys[e.code] = false;
  });

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.worldX = camera.x - canvas.width / 2 + mouse.x;
    mouse.worldY = camera.y - canvas.height / 2 + mouse.y;
  });

  canvas.addEventListener('mousedown', e => {
    sfx.init();
    if (e.button === 0) {
      mouse.leftDown = true;
    } else if (e.button === 2 && gameState === 'PLAYING' && player && player.alive) {
      quickThrowExplosive(player);
    }
  });

  window.addEventListener('mouseup', e => {
    if (e.button === 0) {
      mouse.leftDown = false;
    }
  });

  window.addEventListener('contextmenu', e => e.preventDefault());

  // Rueda del ratón para cambiar de arma
  window.addEventListener('wheel', e => {
    if (gameState !== 'PLAYING' || !player) return;
    const dir = e.deltaY > 0 ? 1 : -1;
    player.activeSlot = (player.activeSlot + dir + 5) % 5;
    player.bowCharging = false;
    player.bowCharge = 0;
    chargeBarContainer.classList.add('hidden');
    updateInventoryUI();
  });

  // Clic directo en las ranuras del inventario
  inventoryBar.querySelectorAll('.inv-slot').forEach(slotEl => {
    slotEl.addEventListener('click', () => {
      if (!player) return;
      player.activeSlot = Number(slotEl.dataset.slot);
      updateInventoryUI();
    });
  });

  // Botones del Menú y Sonido
  btnStart.addEventListener('click', startNewMatch);
  btnRestart.addEventListener('click', startNewMatch);
  btnMenu.addEventListener('click', () => {
    gameState = 'MENU';
    endScreen.classList.remove('active');
    hud.classList.add('hidden');
    startScreen.classList.add('active');
  });

  btnSound.addEventListener('click', () => {
    const on = sfx.toggle();
    btnSound.textContent = on ? '🔊 Audio' : '🔇 Silencio';
  });

  // ==================== BUCLE DE ANIMACIÓN 60 FPS ====================
  function loop(now) {
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;

    // Actualizar coordenadas del ratón en el mundo
    mouse.worldX = camera.x - canvas.width / 2 + mouse.x;
    mouse.worldY = camera.y - canvas.height / 2 + mouse.y;

    update(dt);
    render();
    requestAnimationFrame(loop);
  }

  generateArena();
  requestAnimationFrame(loop);
})();

const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");

const heartsDisplay = document.querySelector("#hearts-display");
const phaseDisplay = document.querySelector("#phase-display");
const objectiveDisplay = document.querySelector("#objective-display");
const controlsDisplay = document.querySelector("#controls-display");
const bossPanel = document.querySelector("#boss-panel");
const bossBarFill = document.querySelector("#boss-bar-fill");
const bossHealthLabel = document.querySelector("#boss-health-label");
const overlay = document.querySelector("#overlay");
const overlayTitle = document.querySelector("#overlay-title");
const overlayCopy = document.querySelector("#overlay-copy");
const overlayButton = document.querySelector("#overlay-button");

const DIVE_LANES_X = [-230, -115, 0, 115, 230];
const DIVE_LANES_Y = [-120, -35, 50, 135];

const WORLD = {
  hallwayStart: 0,
  hallwayEnd: 1980,
  parkourStart: 2120,
  parkourEnd: 3940,
  bossDoor: 4160,
  bossStart: 4360,
};

const input = {
  left: false,
  right: false,
  up: false,
  down: false,
  jump: false,
  fire: false,
};

const PHASE_LABELS = {
  intro: "Stand By",
  dive: "Space Drop",
  hallway: "Alien Hallway",
  parkour: "Parkour Run",
  boss: "Boss Arena",
  win: "Extraction",
  gameover: "Game Over",
};

const OBJECTIVES = {
  dive: "Stay inside the large cyan safe lane for 10 seconds and shoot any rock that slips through.",
  hallway: "Push through the neon kill-corridor and wipe the laser squad ahead.",
  parkour: "Clear the broken platform run while dodging barriers and blasting the flyers.",
  boss: "Circle the chamber, drain the tarantula's health bar, and trigger extraction.",
  win: 'Mission complete. You are beamed back to the ship. "The End."',
  gameover: 'All 10 hearts are gone. "Game Over."',
};

const CONTROL_TEXT = {
  dive: "Move with W A S D or arrow keys. Click or press Enter to shoot incoming asteroids.",
  hallway: "W sprints forward, S brakes, A and D strafe, Space jumps, click or Enter fires.",
  parkour: "Use W and S to pace the run, A and D to dodge, Space to clear barriers.",
  boss: "Move with W A S D inside the arena, jump lasers, and keep firing.",
  win: "Extraction in progress.",
  gameover: "Press Retry Mission to drop back in.",
  intro: "Start the mission when you are ready.",
};

let state = createInitialState();
let lastTime = 0;

function createInitialState() {
  return {
    running: false,
    phase: "intro",
    hearts: 10,
    worldTime: 0,
    phaseTime: 0,
    shake: 0,
    flash: 0,
    winTimer: 0,
    player: {
      x: 0,
      y: 0,
      z: 0,
      vy: 0,
      radius: 32,
      fireCooldown: 0,
      invuln: 0,
      bob: 0,
      forwardVelocity: 0,
    },
    dive: {
      elapsed: 0,
      spawnTimer: 0.35,
      safeCell: { xIndex: 2, yIndex: 1 },
      guideX: 0,
      guideY: -35,
      asteroids: [],
    },
    stars: createStars(320),
    nebulae: createNebulae(),
    enemies: createHallwayEnemies(),
    flyers: createFlyingAliens(),
    barriers: createBarriers(),
    shots: [],
    enemyShots: [],
    particles: [],
    boss: createBoss(),
    hallwayCleared: false,
    parkourCleared: false,
  };
}

function createStars(count) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 2 - 1,
    y: Math.random() * 2 - 1,
    depth: Math.random() * 0.95 + 0.05,
    speed: Math.random() * 0.55 + 0.15,
    hue: Math.random() < 0.15 ? 45 : Math.random() < 0.5 ? 190 : 0,
  }));
}

function createNebulae() {
  return [
    { x: 0.18, y: 0.22, radius: 0.28, color: "rgba(77, 158, 255, 0.18)" },
    { x: 0.82, y: 0.18, radius: 0.22, color: "rgba(140, 83, 255, 0.18)" },
    { x: 0.55, y: 0.78, radius: 0.32, color: "rgba(255, 106, 61, 0.14)" },
  ];
}

function createHallwayEnemies() {
  return [
    enemy(-155, 0, 340, 3),
    enemy(145, 0, 500, 3),
    enemy(-40, 10, 680, 4),
    enemy(175, 0, 860, 4),
    enemy(-175, 0, 1040, 4),
    enemy(0, 0, 1240, 5),
    enemy(-160, 0, 1450, 5),
    enemy(160, 0, 1640, 5),
    enemy(0, 20, 1830, 6),
  ];
}

function createFlyingAliens() {
  return [
    enemy(-180, 90, 2240, 3, true),
    enemy(165, 140, 2420, 3, true),
    enemy(0, 120, 2610, 4, true),
    enemy(-150, 100, 2840, 4, true),
    enemy(175, 150, 3050, 4, true),
    enemy(-140, 115, 3270, 5, true),
    enemy(125, 90, 3470, 5, true),
    enemy(0, 160, 3680, 5, true),
  ];
}

function createBarriers() {
  return [
    { kind: "jump", x: 0, z: 2180, width: 250, height: 78, passed: false },
    { kind: "sidestep", x: -170, z: 2380, width: 170, height: 165, passed: false },
    { kind: "sidestep", x: 175, z: 2580, width: 170, height: 165, passed: false },
    { kind: "jump", x: 0, z: 2810, width: 275, height: 86, passed: false },
    { kind: "sidestep", x: 0, z: 3020, width: 190, height: 185, passed: false },
    { kind: "jump", x: 0, z: 3260, width: 275, height: 94, passed: false },
    { kind: "sidestep", x: -170, z: 3470, width: 170, height: 180, passed: false },
    { kind: "jump", x: 0, z: 3720, width: 285, height: 102, passed: false },
  ];
}

function createBoss() {
  return {
    active: false,
    alive: true,
    x: 0,
    y: 42,
    z: WORLD.bossStart,
    health: 140,
    maxHealth: 140,
    fireCooldown: 1.2,
    pulse: 0,
  };
}

function enemy(x, y, z, health, flying = false) {
  return {
    x,
    y,
    z,
    baseY: y,
    radius: flying ? 36 : 42,
    depth: flying ? 48 : 56,
    health,
    maxHealth: health,
    fireCooldown: Math.random() * 1.2 + 0.8,
    alive: true,
    flying,
    drift: Math.random() * Math.PI * 2,
  };
}

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function startGame() {
  state = createInitialState();
  state.running = true;
  state.phase = "dive";
  overlay.classList.add("hidden");
  updateHud();
  if (!lastTime) {
    lastTime = performance.now();
    requestAnimationFrame(loop);
  }
}

function endRun(phase) {
  state.running = false;
  state.phase = phase;
  overlay.classList.remove("hidden");
  overlayButton.textContent = phase === "win" ? "Play Again" : "Retry Mission";
  overlayTitle.textContent = phase === "win" ? "Beamed Home" : "Mission Failed";
  overlayCopy.textContent =
    phase === "win"
      ? 'The tarantula erupts in violet fire and a beam pulls you back to the ship. "The End."'
      : 'The swarm tore through all 10 hearts. Drop again and carve a cleaner path through the level.';
  updateHud();
}

function updateHud() {
  heartsDisplay.textContent = String(Math.max(0, state.hearts));
  phaseDisplay.textContent = PHASE_LABELS[state.phase];
  objectiveDisplay.textContent = OBJECTIVES[state.phase] ?? "";
  controlsDisplay.textContent = CONTROL_TEXT[state.phase] ?? "";

  const bossActive = state.phase === "boss" && state.boss.active && state.boss.alive;
  bossPanel.classList.toggle("hidden", !bossActive);

  const bossRatio = clamp(state.boss.health / state.boss.maxHealth, 0, 1);
  bossBarFill.style.transform = `scaleX(${bossRatio})`;
  bossHealthLabel.textContent = `${Math.round(bossRatio * 100)}%`;
}

function loop(now) {
  const dt = Math.min((now - lastTime) / 1000 || 0, 0.033);
  lastTime = now;

  if (state.running) {
    update(dt);
  }

  render();
  requestAnimationFrame(loop);
}

function update(dt) {
  state.worldTime += dt;
  state.phaseTime += dt;
  state.shake = Math.max(0, state.shake - dt * 1.8);
  state.flash = Math.max(0, state.flash - dt * 1.4);

  if (state.player.invuln > 0) {
    state.player.invuln -= dt;
  }

  state.player.fireCooldown = Math.max(0, state.player.fireCooldown - dt);

  if (state.phase === "dive") {
    updateDive(dt);
  } else if (state.phase === "hallway") {
    updateGroundMovement(dt, {
      baseSpeed: 165,
      controlSpeed: 145,
      strafeSpeed: 280,
      minForward: 70,
      maxForward: 355,
    });
    updateHallway(dt);
  } else if (state.phase === "parkour") {
    updateGroundMovement(dt, {
      baseSpeed: 190,
      controlSpeed: 160,
      strafeSpeed: 310,
      minForward: 90,
      maxForward: 385,
    });
    updateParkour(dt);
  } else if (state.phase === "boss") {
    updateArenaMovement(dt);
    updateBoss(dt);
  } else if (state.phase === "win") {
    state.winTimer += dt;
    state.player.z += dt * 40;
    if (state.winTimer > 2.5) {
      endRun("win");
    }
  }

  maybeFire();
  updateShots(dt);
  updateParticles(dt);
  maybeLose();
  updateHud();
}

function updateDive(dt) {
  const player = state.player;
  const dive = state.dive;

  dive.elapsed += dt;
  dive.spawnTimer -= dt;

  player.x += axis(input.left, input.right) * 315 * dt;
  player.y += axis(input.up, input.down) * 315 * dt;
  player.x = clamp(player.x, -255, 255);
  player.y = clamp(player.y, -145, 155);

  if (dive.spawnTimer <= 0) {
    spawnAsteroidWave();
    dive.spawnTimer = 0.88;
  }

  dive.guideX = approach(dive.guideX, DIVE_LANES_X[dive.safeCell.xIndex], dt * 145);
  dive.guideY = approach(dive.guideY, DIVE_LANES_Y[dive.safeCell.yIndex], dt * 145);

  for (const asteroid of dive.asteroids) {
    asteroid.z -= asteroid.speed * dt;
    asteroid.rot += asteroid.spin * dt;
    asteroid.x += asteroid.driftX * dt;
    asteroid.y += asteroid.driftY * dt;

    const relZ = asteroid.z - player.z;
    const dx = asteroid.x - player.x;
    const dy = asteroid.y - player.y;

    if (relZ < 120 && Math.hypot(dx, dy) < asteroid.radius + player.radius * 0.9) {
      asteroid.dead = true;
      damagePlayer(2);
      burst(asteroid.x, asteroid.y, asteroid.z, "#ffb36b", 18);
    }
  }

  dive.asteroids = dive.asteroids.filter((asteroid) => !asteroid.dead && asteroid.z > -80);

  if (dive.elapsed >= 10) {
    state.phase = "hallway";
    state.phaseTime = 0;
    player.x = 0;
    player.y = 0;
    player.z = WORLD.hallwayStart;
    player.vy = 0;
    player.forwardVelocity = 165;
    state.flash = 0.9;
    state.shake = 0.65;
    burst(0, 0, player.z + 80, "#64f4ff", 22);
  }
}

function spawnAsteroidWave() {
  const safe = state.dive.safeCell;
  let nextSafeX = safe.xIndex;
  let nextSafeY = safe.yIndex;

  if (Math.random() < 0.38) {
    if (Math.random() < 0.5) {
      nextSafeX = clamp(safe.xIndex + randomInt(-1, 1), 0, DIVE_LANES_X.length - 1);
    } else {
      nextSafeY = clamp(safe.yIndex + randomInt(-1, 1), 0, DIVE_LANES_Y.length - 1);
    }
  }

  safe.xIndex = nextSafeX;
  safe.yIndex = nextSafeY;

  const candidates = [];
  const z = 1300 + Math.random() * 160;
  for (let xIndex = 0; xIndex < DIVE_LANES_X.length; xIndex += 1) {
    for (let yIndex = 0; yIndex < DIVE_LANES_Y.length; yIndex += 1) {
      const insideOpenCorridor = Math.abs(xIndex - nextSafeX) <= 1 && Math.abs(yIndex - nextSafeY) <= 1;
      if (insideOpenCorridor) {
        continue;
      }

      candidates.push({ xIndex, yIndex });
    }
  }

  const asteroidCount = Math.min(candidates.length, randomInt(3, 4));
  for (let count = 0; count < asteroidCount; count += 1) {
    const pickIndex = randomInt(0, candidates.length - 1);
    const { xIndex, yIndex } = candidates.splice(pickIndex, 1)[0];

    state.dive.asteroids.push({
      x: DIVE_LANES_X[xIndex] + Math.random() * 34 - 17,
      y: DIVE_LANES_Y[yIndex] + Math.random() * 28 - 14,
      z: z + Math.random() * 90 - 45,
      radius: Math.random() * 14 + 20,
      speed: Math.random() * 110 + 560,
      rot: Math.random() * Math.PI * 2,
      spin: Math.random() * 1.4 - 0.7,
      driftX: Math.random() * 14 - 7,
      driftY: Math.random() * 12 - 6,
      health: Math.random() < 0.2 ? 2 : 1,
      dead: false,
    });
  }
}

function updateGroundMovement(dt, options) {
  const player = state.player;
  const forwardInput = axis(input.down, input.up);
  const targetForward = clamp(
    options.baseSpeed + forwardInput * options.controlSpeed,
    options.minForward,
    options.maxForward
  );

  player.forwardVelocity = approach(player.forwardVelocity, targetForward, dt * 420);
  player.z += player.forwardVelocity * dt;
  player.x += axis(input.left, input.right) * options.strafeSpeed * dt;
  player.x = clamp(player.x, -235, 235);

  if (input.jump && player.y <= 0.001) {
    player.vy = 385;
  }

  player.vy -= 900 * dt;
  player.y += player.vy * dt;
  if (player.y < 0) {
    player.y = 0;
    player.vy = 0;
  }

  player.bob += dt * (7.5 + player.forwardVelocity / 80);
}

function updateArenaMovement(dt) {
  const player = state.player;
  player.x += axis(input.left, input.right) * 275 * dt;
  player.z += axis(input.down, input.up) * 220 * dt;
  player.x = clamp(player.x, -245, 245);
  player.z = clamp(player.z, WORLD.bossDoor - 110, WORLD.bossStart - 35);

  if (input.jump && player.y <= 0.001) {
    player.vy = 395;
  }

  player.vy -= 900 * dt;
  player.y += player.vy * dt;
  if (player.y < 0) {
    player.y = 0;
    player.vy = 0;
  }

  player.bob += dt * 7.2;
}

function updateHallway(dt) {
  const aliveHallway = state.enemies.filter((alien) => alien.alive);

  for (const alien of aliveHallway) {
    alien.fireCooldown -= dt;
    alien.drift += dt * 1.4;
    alien.x += Math.sin(alien.drift) * dt * 18;

    if (alien.fireCooldown <= 0 && alien.z - state.player.z < 1250) {
      alien.fireCooldown = Math.random() * 1.15 + 0.75;
      fireEnemyShot(alien.x, alien.y + 55, alien.z - 25, "#ff4e88", 430);
    }
  }

  if (aliveHallway.length === 0) {
    state.hallwayCleared = true;
  }

  if (!state.hallwayCleared && state.player.z > WORLD.hallwayEnd - 120) {
    state.player.z = WORLD.hallwayEnd - 120;
  }

  if (state.hallwayCleared && state.player.z >= WORLD.hallwayEnd - 90) {
    state.phase = "parkour";
    state.phaseTime = 0;
    state.player.z = WORLD.parkourStart - 60;
    state.player.forwardVelocity = 200;
    state.flash = 0.65;
    burst(0, 0, state.player.z + 150, "#78ff9f", 18);
  }
}

function updateParkour(dt) {
  for (const alien of state.flyers) {
    if (!alien.alive) {
      continue;
    }

    alien.fireCooldown -= dt;
    alien.drift += dt * 1.9;
    alien.y = alien.baseY + Math.sin(alien.drift) * 28;
    alien.x += Math.sin(alien.drift * 0.8) * dt * 26;
    alien.x = clamp(alien.x, -220, 220);

    if (alien.fireCooldown <= 0 && alien.z - state.player.z < 1350) {
      alien.fireCooldown = Math.random() * 1.05 + 0.65;
      fireEnemyShot(alien.x, alien.y + 18, alien.z, "#7df9ff", 470);
    }
  }

  for (const barrier of state.barriers) {
    if (barrier.passed) {
      continue;
    }

    const dz = barrier.z - state.player.z;
    if (Math.abs(dz) < 42) {
      const overlapX = Math.abs(state.player.x - barrier.x) < barrier.width / 2 + 28;
      if (!overlapX) {
        barrier.passed = true;
        continue;
      }

      if (barrier.kind === "jump" && state.player.y < barrier.height) {
        barrier.passed = true;
        damagePlayer(1);
        state.player.vy = 260;
        burst(barrier.x, barrier.height * 0.4, barrier.z, "#ffd166", 12);
      } else if (barrier.kind === "sidestep") {
        barrier.passed = true;
        damagePlayer(1);
        state.player.x += state.player.x < barrier.x ? -84 : 84;
        burst(barrier.x, barrier.height * 0.45, barrier.z, "#64f4ff", 12);
      }
    } else if (dz < -42) {
      barrier.passed = true;
    }
  }

  const aliveFlyers = state.flyers.filter((alien) => alien.alive).length;
  const unresolvedBarriers = state.barriers.filter((barrier) => !barrier.passed).length;
  if (aliveFlyers === 0 && unresolvedBarriers === 0) {
    state.parkourCleared = true;
  }

  if (!state.parkourCleared && state.player.z > WORLD.parkourEnd - 100) {
    state.player.z = WORLD.parkourEnd - 100;
  }

  if (state.parkourCleared && state.player.z >= WORLD.parkourEnd - 85) {
    state.phase = "boss";
    state.phaseTime = 0;
    state.player.z = WORLD.bossDoor - 60;
    state.player.x = 0;
    state.player.forwardVelocity = 0;
    state.flash = 0.9;
    state.boss.active = true;
    burst(0, 40, WORLD.bossDoor + 120, "#d06cff", 24);
  }
}

function updateBoss(dt) {
  const boss = state.boss;
  if (!boss.active || !boss.alive) {
    return;
  }

  boss.pulse += dt;
  boss.x = Math.sin(boss.pulse * 0.82) * 150;
  boss.y = 42 + Math.sin(boss.pulse * 1.5) * 14;
  boss.fireCooldown -= dt;

  if (boss.fireCooldown <= 0) {
    boss.fireCooldown = 0.62;
    for (const offset of [-90, -35, 35, 90]) {
      fireEnemyShot(boss.x + offset, boss.y + 92, boss.z - 28, "#a66bff", 530);
    }
  }

  if (boss.health <= 0 && boss.alive) {
    boss.alive = false;
    state.phase = "win";
    state.phaseTime = 0;
    state.winTimer = 0;
    state.flash = 1;
    state.shake = 0.85;
    burst(boss.x, boss.y + 70, boss.z, "#ff6a3d", 46);
    burst(boss.x, boss.y + 70, boss.z, "#d06cff", 46);
  }
}

function maybeFire() {
  if (!state.running || !input.fire || state.player.fireCooldown > 0) {
    return;
  }

  state.player.fireCooldown = 0.13;
  state.shots.push({
    x: state.player.x,
    y: state.phase === "dive" ? state.player.y : state.player.y + 56,
    z: state.player.z + 30,
    speed: 1360,
    dead: false,
  });
  state.flash = Math.max(state.flash, 0.12);
}

function updateShots(dt) {
  for (const shot of state.shots) {
    shot.z += shot.speed * dt;
  }

  for (const shot of state.enemyShots) {
    shot.z -= shot.speed * dt;
    shot.x += shot.dx * dt;
    shot.y += shot.dy * dt;

    if (
      shot.z < state.player.z + 45 &&
      shot.z > state.player.z - 60 &&
      Math.abs(shot.x - state.player.x) < 34 &&
      Math.abs(shot.y - (state.player.y + 44)) < 54
    ) {
      shot.dead = true;
      damagePlayer(1);
      burst(shot.x, shot.y, shot.z, shot.color, 8);
    }
  }

  handleDiveShotHits();
  handleShotHits(state.enemies);
  handleShotHits(state.flyers);
  handleBossHits();

  state.shots = state.shots.filter((shot) => !shot.dead && shot.z < state.player.z + 5200);
  state.enemyShots = state.enemyShots.filter((shot) => !shot.dead && shot.z > state.player.z - 120);
}

function handleDiveShotHits() {
  if (state.phase !== "dive") {
    return;
  }

  for (const asteroid of state.dive.asteroids) {
    if (asteroid.dead) {
      continue;
    }

    for (const shot of state.shots) {
      if (shot.dead) {
        continue;
      }

      if (Math.abs(shot.z - asteroid.z) > asteroid.radius + 28) {
        continue;
      }

      if (Math.abs(shot.x - asteroid.x) > asteroid.radius + 14) {
        continue;
      }

      if (Math.abs(shot.y - asteroid.y) > asteroid.radius + 14) {
        continue;
      }

      shot.dead = true;
      asteroid.health -= 1;
      burst(asteroid.x, asteroid.y, asteroid.z, "#ffd166", 7);

      if (asteroid.health <= 0) {
        asteroid.dead = true;
        burst(asteroid.x, asteroid.y, asteroid.z, "#ff8f5f", 14);
      }
    }
  }
}

function handleShotHits(group) {
  for (const alien of group) {
    if (!alien.alive) {
      continue;
    }

    for (const shot of state.shots) {
      if (shot.dead) {
        continue;
      }

      if (Math.abs(shot.z - alien.z) > alien.depth) {
        continue;
      }

      if (Math.abs(shot.x - alien.x) > alien.radius) {
        continue;
      }

      if (Math.abs(shot.y - (alien.y + 42)) > alien.radius + 24) {
        continue;
      }

      shot.dead = true;
      alien.health -= 1;
      state.shake = 0.16;
      burst(alien.x, alien.y + 30, alien.z, alien.flying ? "#7df9ff" : "#ff7b54", 9);

      if (alien.health <= 0) {
        alien.alive = false;
        burst(alien.x, alien.y + 40, alien.z, "#ffd166", 18);
      }
    }
  }
}

function handleBossHits() {
  const boss = state.boss;
  if (!boss.active || !boss.alive) {
    return;
  }

  for (const shot of state.shots) {
    if (shot.dead) {
      continue;
    }

    if (Math.abs(shot.z - boss.z) > 95) {
      continue;
    }

    if (Math.abs(shot.x - boss.x) > 176) {
      continue;
    }

    if (Math.abs(shot.y - (boss.y + 82)) > 138) {
      continue;
    }

    shot.dead = true;
    boss.health -= 1;
    state.shake = 0.22;
    burst(boss.x + (Math.random() * 100 - 50), boss.y + 70, boss.z, "#d06cff", 10);
  }
}

function fireEnemyShot(x, y, z, color, speed) {
  const dx = state.player.x - x;
  const dy = state.player.y + 44 - y;
  const dz = Math.max(1, z - state.player.z);
  const dist = Math.hypot(dx, dy, dz);

  state.enemyShots.push({
    x,
    y,
    z,
    dx: (dx / dist) * speed,
    dy: (dy / dist) * speed,
    speed,
    color,
    dead: false,
  });
}

function damagePlayer(amount) {
  if (state.player.invuln > 0 || state.phase === "win") {
    return;
  }

  state.hearts -= amount;
  state.player.invuln = 0.65;
  state.flash = 0.55;
  state.shake = 0.45;
}

function maybeLose() {
  if (state.hearts > 0 || state.phase === "gameover") {
    return;
  }

  state.phase = "gameover";
  endRun("gameover");
}

function updateParticles(dt) {
  for (const particle of state.particles) {
    particle.life -= dt;
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.z += particle.vz * dt;
    particle.vy -= 135 * dt;
  }

  state.particles = state.particles.filter((particle) => particle.life > 0);
}

function burst(x, y, z, color, count) {
  for (let index = 0; index < count; index += 1) {
    state.particles.push({
      x,
      y,
      z,
      vx: Math.random() * 200 - 100,
      vy: Math.random() * 210 - 40,
      vz: Math.random() * 220 - 110,
      life: Math.random() * 0.5 + 0.2,
      color,
    });
  }
}

function render() {
  const width = canvas.clientWidth || window.innerWidth;
  const height = canvas.clientHeight || window.innerHeight;
  ctx.clearRect(0, 0, width, height);

  if (state.phase === "dive" || state.phase === "intro") {
    drawSpace(width, height);
  } else {
    drawStage(width, height);
  }

  drawParticles(width, height);
  drawWeapon(width, height);
  drawCrosshair(width, height);
  drawHearts(width, height);
  drawPostFX(width, height);
}

function drawSpace(width, height) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "#020713");
  gradient.addColorStop(0.5, "#081634");
  gradient.addColorStop(1, "#1f0d0b");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  drawNebulaBackdrop(width, height);
  drawStars(width, height, true);
  drawPlanet(width, height);
  drawDiveGuide(width, height);

  for (const asteroid of state.dive.asteroids) {
    const scale = clamp(1 - asteroid.z / 1700, 0.08, 1.6);
    const x = width / 2 + (asteroid.x - state.player.x) * scale * 1.42;
    const y = height / 2 + (asteroid.y - state.player.y) * scale * 1.42;
    const radius = asteroid.radius * (0.4 + scale * 1.9);

    const glow = ctx.createRadialGradient(x, y, radius * 0.2, x, y, radius * 2.8);
    glow.addColorStop(0, "rgba(255, 206, 131, 0.2)");
    glow.addColorStop(1, "rgba(255, 206, 131, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, radius * 2.2, 0, Math.PI * 2);
    ctx.fill();

    const rock = ctx.createRadialGradient(x - radius * 0.3, y - radius * 0.4, radius * 0.15, x, y, radius);
    rock.addColorStop(0, "#f2ddb0");
    rock.addColorStop(0.45, "#8a634e");
    rock.addColorStop(1, "#2d1a18");
    ctx.fillStyle = rock;
    ctx.beginPath();
    ctx.ellipse(x, y, radius * 1.12, radius * 0.82, asteroid.rot, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255, 215, 143, 0.22)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  drawDropShip(width, height);
}

function drawNebulaBackdrop(width, height) {
  for (const nebula of state.nebulae) {
    const radius = width * nebula.radius;
    const gradient = ctx.createRadialGradient(
      width * nebula.x,
      height * nebula.y,
      radius * 0.08,
      width * nebula.x,
      height * nebula.y,
      radius
    );
    gradient.addColorStop(0, nebula.color);
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
}

function drawStars(width, height, warp) {
  for (const star of state.stars) {
    const twinkle = 0.45 + Math.sin(state.worldTime * (star.speed * 6) + star.depth * 10) * 0.35;
    const x = ((star.x + state.worldTime * star.speed * 0.02 + 2) % 2) * width * 0.5;
    const y = ((star.y + state.worldTime * star.speed * 0.014 + 2) % 2) * height * 0.5;
    const size = warp ? (1 - star.depth) * 4.2 + 0.4 : (1 - star.depth) * 1.7 + 0.3;
    const alpha = 0.24 + twinkle * 0.72;
    const color =
      star.hue === 45
        ? `rgba(255, 222, 140, ${alpha})`
        : star.hue === 190
          ? `rgba(116, 244, 255, ${alpha})`
          : `rgba(255, 255, 255, ${alpha})`;

    ctx.fillStyle = color;
    ctx.fillRect(x, y, size * (warp ? 0.8 : 1), size * (warp ? 6 : 1));
  }
}

function drawPlanet(width, height) {
  ctx.save();
  ctx.translate(width / 2, height * 0.92);
  const planet = ctx.createRadialGradient(0, 0, width * 0.05, 0, 0, width * 0.46);
  planet.addColorStop(0, "rgba(255, 160, 111, 0.38)");
  planet.addColorStop(0.45, "rgba(85, 120, 255, 0.18)");
  planet.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = planet;
  ctx.beginPath();
  ctx.arc(0, 0, width * 0.48, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawDiveGuide(width, height) {
  const guideX = width / 2 + (state.dive.guideX - state.player.x) * 1.38;
  const guideY = height / 2 + (state.dive.guideY - state.player.y) * 1.38;

  const ring = ctx.createRadialGradient(guideX, guideY, 12, guideX, guideY, 96);
  ring.addColorStop(0, "rgba(255,255,255,0.16)");
  ring.addColorStop(0.45, "rgba(100,244,255,0.3)");
  ring.addColorStop(1, "rgba(100,244,255,0)");
  ctx.fillStyle = ring;
  ctx.beginPath();
  ctx.arc(guideX, guideY, 94, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(100, 244, 255, 0.55)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(guideX, guideY, 42, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "rgba(100, 244, 255, 0.2)";
  ctx.beginPath();
  ctx.arc(guideX, guideY, 12, 0, Math.PI * 2);
  ctx.fill();
}

function drawDropShip(width, height) {
  const shipX = width * 0.5;
  const shipY = 92;
  ctx.save();
  ctx.translate(shipX, shipY);

  const hull = ctx.createLinearGradient(-130, 0, 130, 0);
  hull.addColorStop(0, "#2de6ff");
  hull.addColorStop(0.5, "#e5fbff");
  hull.addColorStop(1, "#2de6ff");
  ctx.fillStyle = hull;
  ctx.beginPath();
  ctx.moveTo(0, -28);
  ctx.lineTo(138, 14);
  ctx.lineTo(0, 38);
  ctx.lineTo(-138, 14);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(4, 16, 34, 0.92)";
  ctx.beginPath();
  ctx.moveTo(0, -10);
  ctx.lineTo(82, 10);
  ctx.lineTo(0, 27);
  ctx.lineTo(-82, 10);
  ctx.closePath();
  ctx.fill();

  const thruster = ctx.createLinearGradient(0, 28, 0, 72);
  thruster.addColorStop(0, "rgba(255, 228, 150, 0.95)");
  thruster.addColorStop(1, "rgba(255, 106, 61, 0)");
  ctx.fillStyle = thruster;
  ctx.fillRect(-48, 30, 22, 72);
  ctx.fillRect(26, 30, 22, 72);

  ctx.restore();
}

function drawStage(width, height) {
  const camera = getCamera(width, height);
  const shakeX = (Math.random() - 0.5) * 12 * state.shake;
  const shakeY = (Math.random() - 0.5) * 10 * state.shake;

  ctx.save();
  ctx.translate(shakeX, shakeY);

  drawGroundSky(width, height);
  drawStars(width, height, false);
  drawEnvironment(width, height, camera);

  const objects = [];
  for (const alien of state.enemies) {
    if (alien.alive) {
      objects.push({ type: "alien", entity: alien });
    }
  }
  for (const alien of state.flyers) {
    if (alien.alive) {
      objects.push({ type: "flyer", entity: alien });
    }
  }
  for (const barrier of state.barriers) {
    if (!barrier.passed) {
      objects.push({ type: "barrier", entity: barrier });
    }
  }
  for (const shot of state.shots) {
    objects.push({ type: "shot", entity: shot });
  }
  for (const shot of state.enemyShots) {
    objects.push({ type: "enemyShot", entity: shot });
  }
  if (state.boss.active && state.boss.alive) {
    objects.push({ type: "boss", entity: state.boss });
  }

  objects.sort((left, right) => getRelZ(right.entity, camera) - getRelZ(left.entity, camera));
  for (const object of objects) {
    drawProjected(object.type, object.entity, camera, width, height);
  }

  if (state.phase === "win") {
    drawBeam(width, height, camera);
  }

  ctx.restore();
}

function drawGroundSky(width, height) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "#030914");
  gradient.addColorStop(0.48, "#0b1730");
  gradient.addColorStop(1, "#09070d");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const haze = ctx.createRadialGradient(width * 0.5, height * 0.72, 20, width * 0.5, height * 0.72, width * 0.7);
  haze.addColorStop(0, "rgba(255, 106, 61, 0.16)");
  haze.addColorStop(0.6, "rgba(118, 67, 255, 0.12)");
  haze.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = haze;
  ctx.fillRect(0, 0, width, height);
}

function drawEnvironment(width, height, camera) {
  if (state.phase === "hallway") {
    drawHallway(width, height, camera);
    return;
  }

  if (state.phase === "parkour") {
    drawParkourWorld(width, height, camera);
    return;
  }

  drawBossArena(width, height, camera);
}

function drawHallway(width, height, camera) {
  const near = Math.max(camera.z + 80, WORLD.hallwayStart + 20);
  const far = Math.max(near + 500, WORLD.hallwayEnd + 140);

  fillProjectedQuad(
    projectPoint(-350, 210, near, camera, width, height),
    projectPoint(-440, 250, far, camera, width, height),
    projectPoint(-440, 0, far, camera, width, height),
    projectPoint(-320, 0, near, camera, width, height),
    "rgba(26, 38, 60, 0.92)"
  );
  fillProjectedQuad(
    projectPoint(320, 0, near, camera, width, height),
    projectPoint(440, 0, far, camera, width, height),
    projectPoint(440, 250, far, camera, width, height),
    projectPoint(350, 210, near, camera, width, height),
    "rgba(26, 38, 60, 0.92)"
  );
  fillProjectedQuad(
    projectPoint(-320, 0, near, camera, width, height),
    projectPoint(320, 0, near, camera, width, height),
    projectPoint(440, 0, far, camera, width, height),
    projectPoint(-440, 0, far, camera, width, height),
    "rgba(13, 16, 23, 0.96)"
  );
  fillProjectedQuad(
    projectPoint(-350, 210, near, camera, width, height),
    projectPoint(350, 210, near, camera, width, height),
    projectPoint(440, 250, far, camera, width, height),
    projectPoint(-440, 250, far, camera, width, height),
    "rgba(8, 13, 23, 0.94)"
  );

  ctx.strokeStyle = "rgba(86, 215, 255, 0.34)";
  ctx.lineWidth = 2;
  for (let z = roundUp(near, 160); z < far; z += 160) {
    drawLineProjected(
      projectPoint(-295, 12, z, camera, width, height),
      projectPoint(295, 12, z, camera, width, height)
    );
    drawLineProjected(
      projectPoint(-295, 188, z, camera, width, height),
      projectPoint(295, 188, z, camera, width, height)
    );
  }

  ctx.strokeStyle = "rgba(255, 106, 61, 0.36)";
  ctx.lineWidth = 3;
  for (let z = roundUp(near + 70, 240); z < far; z += 240) {
    drawLineProjected(
      projectPoint(-228, 26, z, camera, width, height),
      projectPoint(-136, 26, z, camera, width, height)
    );
    drawLineProjected(
      projectPoint(136, 26, z, camera, width, height),
      projectPoint(228, 26, z, camera, width, height)
    );
  }

  for (let z = roundUp(near + 120, 260); z < far - 80; z += 260) {
    drawHallPillar(-275, z, camera, width, height);
    drawHallPillar(275, z, camera, width, height);
  }

  drawDoorFrame(WORLD.hallwayEnd + 30, camera, width, height, "#64f4ff");
}

function drawHallPillar(x, z, camera, width, height) {
  const left = x < 0 ? x - 24 : x;
  const right = x < 0 ? x : x + 24;
  fillProjectedQuad(
    projectPoint(left, 0, z - 24, camera, width, height),
    projectPoint(right, 0, z - 24, camera, width, height),
    projectPoint(right, 170, z - 24, camera, width, height),
    projectPoint(left, 170, z - 24, camera, width, height),
    "rgba(52, 86, 122, 0.34)"
  );
}

function drawParkourWorld(width, height, camera) {
  const near = Math.max(camera.z + 75, WORLD.parkourStart - 80);
  const far = Math.max(near + 700, WORLD.parkourEnd + 180);

  drawFloatingRunway(width, height, camera, near, far);
  drawSideArchitecture(width, height, camera, near, far);

  ctx.strokeStyle = "rgba(120, 255, 159, 0.45)";
  ctx.lineWidth = 2;
  for (let z = roundUp(near, 160); z < far; z += 160) {
    drawLineProjected(
      projectPoint(-230, 0, z, camera, width, height),
      projectPoint(230, 0, z, camera, width, height)
    );
  }

  drawDoorFrame(WORLD.parkourEnd + 50, camera, width, height, "#78ff9f");
}

function drawFloatingRunway(width, height, camera, near, far) {
  fillProjectedQuad(
    projectPoint(-250, 0, near, camera, width, height),
    projectPoint(250, 0, near, camera, width, height),
    projectPoint(335, -18, far, camera, width, height),
    projectPoint(-335, -18, far, camera, width, height),
    "rgba(17, 22, 28, 0.98)"
  );

  fillProjectedQuad(
    projectPoint(-275, -18, near, camera, width, height),
    projectPoint(-250, 0, near, camera, width, height),
    projectPoint(-335, -18, far, camera, width, height),
    projectPoint(-360, -40, far, camera, width, height),
    "rgba(46, 66, 92, 0.55)"
  );
  fillProjectedQuad(
    projectPoint(250, 0, near, camera, width, height),
    projectPoint(275, -18, near, camera, width, height),
    projectPoint(360, -40, far, camera, width, height),
    projectPoint(335, -18, far, camera, width, height),
    "rgba(46, 66, 92, 0.55)"
  );

  ctx.strokeStyle = "rgba(100, 244, 255, 0.38)";
  ctx.lineWidth = 3;
  for (const railX of [-215, 215]) {
    drawPathLine(railX, 26, near, far, camera, width, height);
  }

  ctx.strokeStyle = "rgba(255, 106, 61, 0.28)";
  ctx.lineWidth = 2;
  for (let z = roundUp(near + 90, 220); z < far; z += 220) {
    drawLineProjected(
      projectPoint(-185, 3, z, camera, width, height),
      projectPoint(185, 3, z, camera, width, height)
    );
  }
}

function drawSideArchitecture(width, height, camera, near, far) {
  for (let z = roundUp(near + 60, 240); z < far + 180; z += 240) {
    drawMonolith(-500, z, camera, width, height, "rgba(94, 144, 255, 0.18)");
    drawMonolith(500, z + 80, camera, width, height, "rgba(255, 106, 61, 0.16)");
  }
}

function drawMonolith(x, z, camera, width, height, glowColor) {
  const a = projectPoint(x - 40, 0, z, camera, width, height);
  const b = projectPoint(x + 40, 0, z, camera, width, height);
  const c = projectPoint(x + 30, 260, z, camera, width, height);
  const d = projectPoint(x - 30, 260, z, camera, width, height);

  fillProjectedQuad(a, b, c, d, "rgba(18, 24, 32, 0.66)");
  if (!a || !b || !c || !d) {
    return;
  }

  const glow = ctx.createLinearGradient((a.x + b.x) / 2, c.y, (a.x + b.x) / 2, a.y);
  glow.addColorStop(0, glowColor);
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.lineTo(c.x, c.y);
  ctx.lineTo(d.x, d.y);
  ctx.closePath();
  ctx.fill();
}

function drawBossArena(width, height, camera) {
  const arena = ctx.createRadialGradient(width * 0.5, height * 0.78, 20, width * 0.5, height * 0.78, width * 0.76);
  arena.addColorStop(0, "rgba(255, 76, 88, 0.24)");
  arena.addColorStop(0.4, "rgba(123, 70, 255, 0.16)");
  arena.addColorStop(1, "rgba(5, 5, 10, 0.98)");
  ctx.fillStyle = arena;
  ctx.fillRect(0, 0, width, height);

  const floorCenter = projectPoint(0, 0, WORLD.bossStart + 40, camera, width, height);
  if (floorCenter) {
    for (let ring = 0; ring < 8; ring += 1) {
      const ratio = 1 - ring * 0.08;
      ctx.strokeStyle = ring % 2 === 0 ? "rgba(166, 107, 255, 0.26)" : "rgba(255, 106, 61, 0.18)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(floorCenter.x, floorCenter.y + 76, 300 * floorCenter.scale * ratio, 80 * floorCenter.scale * ratio, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  for (let z = WORLD.bossDoor + 90; z <= WORLD.bossStart + 260; z += 70) {
    drawRingArc(z, camera, width, height);
  }
}

function drawRingArc(z, camera, width, height) {
  const left = projectPoint(-320, 0, z, camera, width, height);
  const right = projectPoint(320, 0, z, camera, width, height);
  if (!left || !right) {
    return;
  }

  ctx.strokeStyle = "rgba(166, 107, 255, 0.22)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(
    (left.x + right.x) / 2,
    (left.y + right.y) / 2,
    Math.abs(right.x - left.x) * 0.52,
    Math.max(28, Math.abs(right.y - left.y) * 0.18 + 26),
    0,
    0,
    Math.PI * 2
  );
  ctx.stroke();
}

function drawDoorFrame(z, camera, width, height, color) {
  const leftBase = projectPoint(-190, 0, z, camera, width, height);
  const rightBase = projectPoint(190, 0, z, camera, width, height);
  const leftTop = projectPoint(-190, 190, z, camera, width, height);
  const rightTop = projectPoint(190, 190, z, camera, width, height);

  if (!leftBase || !rightBase || !leftTop || !rightTop) {
    return;
  }

  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(leftBase.x, leftBase.y);
  ctx.lineTo(leftTop.x, leftTop.y);
  ctx.lineTo(rightTop.x, rightTop.y);
  ctx.lineTo(rightBase.x, rightBase.y);
  ctx.stroke();
}

function drawPathLine(x, y, near, far, camera, width, height) {
  drawLineProjected(
    projectPoint(x, y, near, camera, width, height),
    projectPoint(x, y + 14, far, camera, width, height)
  );
}

function drawProjected(type, entity, camera, width, height) {
  if (type === "barrier") {
    drawBarrier(entity, camera, width, height);
    return;
  }
  if (type === "boss") {
    drawBoss(entity, camera, width, height);
    return;
  }
  if (type === "shot") {
    drawEnergyBolt(entity, camera, width, height, "#ffd166");
    return;
  }
  if (type === "enemyShot") {
    drawEnergyBolt(entity, camera, width, height, entity.color);
    return;
  }
  if (type === "alien" || type === "flyer") {
    drawAlien(entity, camera, width, height);
  }
}

function drawAlien(alien, camera, width, height) {
  const base = projectPoint(alien.x, alien.y, alien.z, camera, width, height);
  if (!base || base.scale <= 0) {
    return;
  }

  const size = alien.radius * base.scale * 2.5;
  const glow = alien.flying ? "#7df9ff" : "#ff784f";
  ctx.save();
  ctx.translate(base.x, base.y);

  const aura = ctx.createRadialGradient(0, 0, size * 0.1, 0, 0, size * 1.6);
  aura.addColorStop(0, `${glow}55`);
  aura.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(0, 0, size * 1.55, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
  ctx.beginPath();
  ctx.ellipse(0, size * 1.38, size * 0.72, size * 0.24, 0, 0, Math.PI * 2);
  ctx.fill();

  const body = ctx.createRadialGradient(-size * 0.18, -size * 0.22, size * 0.18, 0, 0, size * 1.1);
  body.addColorStop(0, alien.flying ? "#e5ffff" : "#ffe3b9");
  body.addColorStop(0.52, glow);
  body.addColorStop(1, "#120b14");
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.ellipse(0, 0, size * 0.72, size, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#04131c";
  ctx.beginPath();
  ctx.arc(-size * 0.23, -size * 0.15, size * 0.12, 0, Math.PI * 2);
  ctx.arc(size * 0.23, -size * 0.15, size * 0.12, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = glow;
  ctx.lineWidth = Math.max(1.5, size * 0.08);
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(side * size * 0.33, size * 0.08);
    ctx.lineTo(side * size * 0.72, size * 0.52);
    ctx.lineTo(side * size * 0.9, size * 0.98);
    ctx.stroke();
  }

  const healthRatio = alien.health / alien.maxHealth;
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fillRect(-size * 0.72, -size * 1.4, size * 1.44, size * 0.12);
  ctx.fillStyle = alien.flying ? "#7df9ff" : "#ff9d4d";
  ctx.fillRect(-size * 0.72, -size * 1.4, size * 1.44 * healthRatio, size * 0.12);
  ctx.restore();
}

function drawBarrier(barrier, camera, width, height) {
  const nearZ = barrier.z - 18;
  const farZ = barrier.z + 18;
  const left = barrier.x - barrier.width / 2;
  const right = barrier.x + barrier.width / 2;
  const top = barrier.height;

  const a = projectPoint(left, 0, nearZ, camera, width, height);
  const b = projectPoint(right, 0, nearZ, camera, width, height);
  const c = projectPoint(right, top, nearZ, camera, width, height);
  const d = projectPoint(left, top, nearZ, camera, width, height);
  const e = projectPoint(left, 0, farZ, camera, width, height);
  const f = projectPoint(right, 0, farZ, camera, width, height);
  const g = projectPoint(right, top, farZ, camera, width, height);
  const h = projectPoint(left, top, farZ, camera, width, height);

  fillProjectedQuad(a, b, c, d, barrier.kind === "jump" ? "rgba(255, 126, 74, 0.95)" : "rgba(100, 244, 255, 0.92)");
  fillProjectedQuad(e, f, g, h, "rgba(10, 18, 29, 0.95)");
  fillProjectedQuad(a, d, h, e, "rgba(255,255,255,0.08)");
  fillProjectedQuad(b, c, g, f, "rgba(255,255,255,0.12)");

  ctx.strokeStyle = barrier.kind === "jump" ? "#ffd166" : "#64f4ff";
  ctx.lineWidth = 2;
  strokeProjectedQuad(a, b, c, d);
  strokeProjectedQuad(a, d, h, e);
  strokeProjectedQuad(b, c, g, f);
}

function drawBoss(boss, camera, width, height) {
  const center = projectPoint(boss.x, boss.y + 42, boss.z, camera, width, height);
  if (!center) {
    return;
  }

  const size = center.scale * 245;
  ctx.save();
  ctx.translate(center.x, center.y);

  const aura = ctx.createRadialGradient(0, 0, size * 0.18, 0, 0, size * 1.7);
  aura.addColorStop(0, "rgba(208, 108, 255, 0.38)");
  aura.addColorStop(1, "rgba(208, 108, 255, 0)");
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(0, 0, size * 1.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(0, 0, 0, 0.38)";
  ctx.beginPath();
  ctx.ellipse(0, size * 0.98, size * 0.96, size * 0.28, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#d06cff";
  ctx.lineWidth = Math.max(2, size * 0.035);
  for (const side of [-1, 1]) {
    for (let leg = 0; leg < 4; leg += 1) {
      const spread = 0.26 + leg * 0.18;
      ctx.beginPath();
      ctx.moveTo(side * size * 0.2, size * (0.04 + leg * 0.03));
      ctx.lineTo(side * size * (0.46 + spread * 0.3), size * (0.25 + leg * 0.13));
      ctx.lineTo(side * size * (0.8 + spread * 0.2), size * (0.52 + leg * 0.16));
      ctx.stroke();
    }
  }

  const abdomen = ctx.createRadialGradient(-size * 0.24, -size * 0.18, size * 0.18, 0, 0, size);
  abdomen.addColorStop(0, "#f8ddff");
  abdomen.addColorStop(0.38, "#b269ff");
  abdomen.addColorStop(1, "#140519");
  ctx.fillStyle = abdomen;
  ctx.beginPath();
  ctx.ellipse(0, 0, size * 0.48, size * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#050a14";
  ctx.beginPath();
  ctx.arc(-size * 0.17, -size * 0.11, size * 0.07, 0, Math.PI * 2);
  ctx.arc(size * 0.17, -size * 0.11, size * 0.07, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ff496a";
  ctx.beginPath();
  ctx.arc(0, size * 0.08, size * 0.085, 0, Math.PI);
  ctx.fill();
  ctx.restore();
}

function drawEnergyBolt(shot, camera, width, height, color) {
  const point = projectPoint(shot.x, shot.y, shot.z, camera, width, height);
  if (!point) {
    return;
  }

  const radius = Math.max(2, point.scale * 16);
  const glow = ctx.createRadialGradient(point.x, point.y, radius * 0.2, point.x, point.y, radius * 2.8);
  glow.addColorStop(0, "#ffffff");
  glow.addColorStop(0.34, color);
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(point.x, point.y, radius * 2.7, 0, Math.PI * 2);
  ctx.fill();
}

function drawParticles(width, height) {
  const camera = getCamera(width, height);
  for (const particle of state.particles) {
    const point = projectPoint(particle.x, particle.y, particle.z, camera, width, height);
    if (!point) {
      continue;
    }

    ctx.fillStyle = particle.color;
    const size = Math.max(1, point.scale * 8 * particle.life);
    ctx.fillRect(point.x, point.y, size, size);
  }
}

function drawWeapon(width, height) {
  if (state.phase === "intro") {
    return;
  }

  ctx.save();
  ctx.translate(width * 0.5, height);

  const lift = state.phase === "dive" ? 112 : 84 + Math.sin(state.player.bob) * 7;
  const shell = ctx.createLinearGradient(-120, -lift, 120, 0);
  shell.addColorStop(0, "rgba(7, 17, 30, 0.98)");
  shell.addColorStop(1, "rgba(18, 38, 61, 0.98)");
  ctx.fillStyle = shell;
  ctx.beginPath();
  ctx.moveTo(-126, -18);
  ctx.lineTo(-42, -lift);
  ctx.lineTo(42, -lift);
  ctx.lineTo(126, -18);
  ctx.lineTo(52, 0);
  ctx.lineTo(-52, 0);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(100, 244, 255, 0.86)";
  ctx.fillRect(-20, -lift - 12, 40, 24);
  ctx.fillStyle = "rgba(255, 106, 61, 0.82)";
  ctx.fillRect(-10, -lift - 36, 20, 24);
  ctx.restore();
}

function drawCrosshair(width, height) {
  const x = width / 2;
  const y = height / 2;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - 20, y);
  ctx.lineTo(x - 7, y);
  ctx.moveTo(x + 7, y);
  ctx.lineTo(x + 20, y);
  ctx.moveTo(x, y - 20);
  ctx.lineTo(x, y - 7);
  ctx.moveTo(x, y + 7);
  ctx.lineTo(x, y + 20);
  ctx.stroke();

  ctx.strokeStyle = "rgba(100, 244, 255, 0.4)";
  ctx.beginPath();
  ctx.arc(x, y, 24, 0, Math.PI * 2);
  ctx.stroke();
}

function drawHearts(width, height) {
  const baseY = height - 42;
  for (let index = 0; index < 10; index += 1) {
    const x = 24 + index * 26;
    drawHeart(x, baseY, index < Math.max(0, state.hearts) ? "#ff5b7f" : "rgba(255,255,255,0.12)");
  }
}

function drawHeart(x, y, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, 6);
  ctx.bezierCurveTo(0, -2, -12, -2, -12, 8);
  ctx.bezierCurveTo(-12, 16, -2, 22, 0, 24);
  ctx.bezierCurveTo(2, 22, 12, 16, 12, 8);
  ctx.bezierCurveTo(12, -2, 0, -2, 0, 6);
  ctx.fill();
  ctx.restore();
}

function drawBeam(width, height, camera) {
  const point = projectPoint(0, 0, state.player.z + 260, camera, width, height);
  if (!point) {
    return;
  }

  const beam = ctx.createLinearGradient(point.x, 0, point.x, height);
  beam.addColorStop(0, "rgba(255,255,255,0)");
  beam.addColorStop(0.18, "rgba(100, 244, 255, 0.9)");
  beam.addColorStop(1, "rgba(100, 244, 255, 0.06)");
  ctx.fillStyle = beam;
  ctx.fillRect(point.x - 76, 0, 152, height);
}

function drawPostFX(width, height) {
  if (state.flash > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${state.flash * 0.24})`;
    ctx.fillRect(0, 0, width, height);
  }

  const vignette = ctx.createRadialGradient(width * 0.5, height * 0.48, width * 0.12, width * 0.5, height * 0.5, width * 0.82);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, state.player.invuln > 0 ? "rgba(80, 0, 12, 0.48)" : "rgba(0,0,0,0.42)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(255,255,255,0.028)";
  for (let y = 0; y < height; y += 4) {
    ctx.fillRect(0, y, width, 1);
  }
}

function getCamera(width, height) {
  return {
    x: state.player.x * 0.42,
    y: 88 - state.player.y * 0.16 + Math.sin(state.player.bob) * 3,
    z: state.player.z - 45,
    focal: Math.min(width, height) * 0.94,
    horizon: height * 0.35,
  };
}

function projectPoint(x, y, z, camera, width, height) {
  const relZ = z - camera.z;
  if (relZ <= 1) {
    return null;
  }

  const scale = camera.focal / relZ;
  return {
    x: width / 2 + (x - camera.x) * scale,
    y: camera.horizon + (camera.y - y) * scale,
    scale,
  };
}

function getRelZ(entity, camera) {
  return entity.z - camera.z;
}

function fillProjectedQuad(a, b, c, d, color) {
  if (!a || !b || !c || !d) {
    return;
  }

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.lineTo(c.x, c.y);
  ctx.lineTo(d.x, d.y);
  ctx.closePath();
  ctx.fill();
}

function strokeProjectedQuad(a, b, c, d) {
  if (!a || !b || !c || !d) {
    return;
  }

  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.lineTo(c.x, c.y);
  ctx.lineTo(d.x, d.y);
  ctx.closePath();
  ctx.stroke();
}

function drawLineProjected(a, b) {
  if (!a || !b) {
    return;
  }

  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
}

function axis(negative, positive) {
  return (positive ? 1 : 0) - (negative ? 1 : 0);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function approach(current, target, delta) {
  if (current < target) {
    return Math.min(target, current + delta);
  }
  return Math.max(target, current - delta);
}

function roundUp(value, step) {
  return Math.ceil(value / step) * step;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

window.addEventListener("resize", resizeCanvas);

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if (key === "a" || key === "arrowleft") input.left = true;
  if (key === "d" || key === "arrowright") input.right = true;
  if (key === "w" || key === "arrowup") input.up = true;
  if (key === "s" || key === "arrowdown") input.down = true;
  if (key === " ") {
    input.jump = true;
    event.preventDefault();
  }
  if (key === "enter") input.fire = true;
});

window.addEventListener("keyup", (event) => {
  const key = event.key.toLowerCase();
  if (key === "a" || key === "arrowleft") input.left = false;
  if (key === "d" || key === "arrowright") input.right = false;
  if (key === "w" || key === "arrowup") input.up = false;
  if (key === "s" || key === "arrowdown") input.down = false;
  if (key === " ") input.jump = false;
  if (key === "enter") input.fire = false;
});

window.addEventListener("mousedown", () => {
  input.fire = true;
});

window.addEventListener("mouseup", () => {
  input.fire = false;
});

window.addEventListener("blur", () => {
  input.left = false;
  input.right = false;
  input.up = false;
  input.down = false;
  input.jump = false;
  input.fire = false;
});

overlayButton.addEventListener("click", startGame);

resizeCanvas();
updateHud();
render();

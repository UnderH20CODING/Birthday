/* spawn.html logic — Green-Hill-Zone-style runner.
   Intro: a big man carries her off to the end of the course. Then you
   run the course chasing them, jumping obstacles, before time runs out.
   Space/click/tap to jump. */

const $ = (id) => document.getElementById(id);

const canvas = $("runner-canvas");
const ctx = canvas.getContext("2d");
const W = canvas.width;
const H = canvas.height;
const GROUND_Y = 150;

const DURATION_MS = 20000;
const MAX_HP = 3;
const IFRAME_MS = 900;

const PLAYER_X = 46;
const PLAYER_W = 14;
const PLAYER_H = 18;
const GRAVITY = 0.6;
const JUMP_VELOCITY = -8.6;

let state = "intro"; // intro -> game -> won/lost
let introStart = null;

let playerY = GROUND_Y - PLAYER_H;
let vy = 0;
let onGround = true;
let legFrame = 0;

let obstacles = [];
let hp = MAX_HP;
let elapsed = 0;
let lastSpawn = 0;
let lastFrameTime = 0;
let invulnUntil = 0;
let running = true;
let rafId = null;
let groundScroll = 0;

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function difficultyProgress() {
  return clamp(elapsed / DURATION_MS, 0, 1);
}

function scrollSpeed() {
  const p = difficultyProgress();
  return 90 + p * 90; // 90px/s -> 180px/s
}

function spawnInterval() {
  const p = difficultyProgress();
  return 1100 - p * 500; // 1100ms -> 600ms
}

function doJump() {
  if (state !== "game") return;
  if (onGround) {
    vy = JUMP_VELOCITY;
    onGround = false;
  }
}

window.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    e.preventDefault();
    doJump();
  }
});
canvas.addEventListener("mousedown", doJump);
canvas.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
    doJump();
  },
  { passive: false }
);

function spawnObstacle() {
  const h = 14 + Math.random() * 10;
  obstacles.push({ x: W + 10, y: GROUND_Y - h, w: 12, h });
}

function updateHearts() {
  const heartEls = $("hearts").querySelectorAll(".heart");
  heartEls.forEach((el, i) => {
    el.classList.toggle("lost", i >= hp);
  });
}

function takeHit(now) {
  if (now < invulnUntil) return;
  hp--;
  invulnUntil = now + IFRAME_MS;
  updateHearts();
  if (hp <= 0) loseRun();
}

function drawSky() {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, "#7ec8f0");
  grad.addColorStop(1, "#cdeeff");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
}

function drawGround(now) {
  const tile = 12;
  ctx.fillStyle = "#5d9c3f";
  ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);
  const offset = Math.floor(groundScroll) % (tile * 2);
  ctx.fillStyle = "#3a7d1f";
  for (let x = -offset; x < W + tile * 2; x += tile * 2) {
    ctx.fillRect(x, GROUND_Y, tile, tile);
    ctx.fillRect(x + tile, GROUND_Y + tile, tile, tile);
  }
}

function drawBush(x, y) {
  ctx.fillStyle = "#2f6e18";
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.arc(x + 10, y + 2, 8, 0, Math.PI * 2);
  ctx.arc(x - 10, y + 2, 8, 0, Math.PI * 2);
  ctx.fill();
}

function drawPlayer(now) {
  const flashOff = now < invulnUntil && Math.floor(now / 100) % 2 === 0;
  if (flashOff) return;
  const x = PLAYER_X;
  const y = playerY;

  ctx.fillStyle = "#1f7fd6";
  ctx.beginPath();
  ctx.ellipse(x + PLAYER_W / 2, y + PLAYER_H / 2, PLAYER_W / 2, PLAYER_H / 2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#0f4d8a";
  ctx.fillRect(x - 4, y + 2, 5, 3);
  ctx.fillRect(x - 3, y + 8, 4, 3);

  if (onGround) {
    ctx.fillStyle = "#0f4d8a";
    const frontLegDrop = legFrame > 0.5 ? 4 : 1;
    const backLegDrop = legFrame > 0.5 ? 1 : 4;
    ctx.fillRect(x + 2, y + PLAYER_H - 2, 3, frontLegDrop);
    ctx.fillRect(x + PLAYER_W - 5, y + PLAYER_H - 2, 3, backLegDrop);
  }
}

function drawObstacle(o) {
  ctx.fillStyle = "#7a5230";
  ctx.fillRect(o.x, o.y, o.w, o.h);
}

function drawIntro(now) {
  drawSky();
  drawGround(now);

  if (introStart === null) introStart = now;
  const t = now - introStart;

  const girlStartX = 90;
  const manStartX = W + 30;
  const meetX = 150;

  let girlX = girlStartX;
  let manX;
  let bothX = null;

  if (t < 700) {
    const p = t / 700;
    manX = manStartX + (meetX + 16 - manStartX) * p;
  } else if (t < 1600) {
    const p = (t - 700) / 900;
    bothX = meetX + p * (W + 40 - meetX);
    manX = bothX + 16;
    girlX = bothX;
  } else {
    state = "game";
    $("game-sub").textContent = "Jump the obstacles. Don't get caught.";
    return;
  }

  if (bothX !== null) girlX = bothX;

  // girl
  ctx.fillStyle = "#e8536a";
  ctx.beginPath();
  ctx.moveTo(girlX, GROUND_Y);
  ctx.lineTo(girlX - 8, GROUND_Y - 16);
  ctx.lineTo(girlX + 8, GROUND_Y - 16);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#e8b98a";
  ctx.beginPath();
  ctx.arc(girlX, GROUND_Y - 20, 5, 0, Math.PI * 2);
  ctx.fill();

  if (t < 700) {
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    ctx.fillRect(girlX - 26, GROUND_Y - 40, 40, 14);
    ctx.strokeRect(girlX - 26, GROUND_Y - 40, 40, 14);
    ctx.fillStyle = "#000";
    ctx.font = "7px monospace";
    ctx.fillText("SAVE ME!", girlX - 23, GROUND_Y - 31);
  }

  // big man
  ctx.fillStyle = "#2b2b2b";
  ctx.fillRect(manX - 9, GROUND_Y - 30, 18, 22);
  ctx.fillStyle = "#c9a27a";
  ctx.beginPath();
  ctx.arc(manX, GROUND_Y - 34, 6, 0, Math.PI * 2);
  ctx.fill();
}

function draw(now) {
  drawSky();
  drawGround(now);
  drawBush(70, GROUND_Y - 4);
  drawBush(230, GROUND_Y - 6);
  obstacles.forEach(drawObstacle);
  drawPlayer(now);
}

function loseRun() {
  running = false;
  $("battle-status").textContent = "Caught by an obstacle.";
  $("death-box").classList.remove("hidden");
}

function winRun() {
  running = false;
  $("battle-status").textContent = "Course clear.";
  $("unlock-box").classList.remove("hidden");
}

function loop(now) {
  if (!running) return;
  if (!lastFrameTime) lastFrameTime = now;
  const dt = (now - lastFrameTime) / 1000;
  lastFrameTime = now;

  if (state === "intro") {
    groundScroll += scrollSpeed() * dt * 0.4;
    drawIntro(now);
    rafId = requestAnimationFrame(loop);
    return;
  }

  elapsed += dt * 1000;
  groundScroll += scrollSpeed() * dt;
  legFrame = (legFrame + dt * 6) % 1;

  vy += GRAVITY;
  playerY += vy;
  if (playerY >= GROUND_Y - PLAYER_H) {
    playerY = GROUND_Y - PLAYER_H;
    vy = 0;
    onGround = true;
  }

  if (now - lastSpawn > spawnInterval()) {
    lastSpawn = now;
    spawnObstacle();
  }
  const speed = scrollSpeed();
  obstacles.forEach((o) => {
    o.x -= speed * dt;
  });
  obstacles = obstacles.filter((o) => o.x + o.w > -10);

  obstacles.forEach((o) => {
    const px1 = PLAYER_X, px2 = PLAYER_X + PLAYER_W;
    const py1 = playerY, py2 = playerY + PLAYER_H;
    const ox1 = o.x, ox2 = o.x + o.w;
    const oy1 = o.y, oy2 = o.y + o.h;
    if (px1 < ox2 && px2 > ox1 && py1 < oy2 && py2 > oy1) {
      takeHit(now);
    }
  });

  draw(now);

  if (elapsed >= DURATION_MS && hp > 0) {
    winRun();
    return;
  }

  rafId = requestAnimationFrame(loop);
}

function resetGame() {
  state = "intro";
  introStart = null;
  playerY = GROUND_Y - PLAYER_H;
  vy = 0;
  onGround = true;
  obstacles = [];
  hp = MAX_HP;
  elapsed = 0;
  lastSpawn = 0;
  lastFrameTime = 0;
  invulnUntil = 0;
  running = true;
  updateHearts();
  $("death-box").classList.add("hidden");
  $("unlock-box").classList.add("hidden");
  $("battle-status").textContent = "Press SPACE, click, or tap to jump.";
  $("game-sub").textContent = "Someone needs saving. Run the course before it's too late.";
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(loop);
}

$("retry-btn").addEventListener("click", resetGame);

updateHearts();
rafId = requestAnimationFrame(loop);

/* boss.html logic — Undertale-style dodge fight.
   Mouse always moves the heart; on touch devices it only moves while
   pressed and dragged (there's no hover on mobile). */

const $ = (id) => document.getElementById(id);

const canvas = $("battle-canvas");
const ctx = canvas.getContext("2d");
const W = canvas.width;
const H = canvas.height;
const MARGIN = 10;

const DURATION_MS = 25000;
const MAX_HP = 3;
const HEART_R = 6;
const IFRAME_MS = 1000;

let heart = { x: W / 2, y: H - 30 };
let bullets = [];
let hp = MAX_HP;
let elapsed = 0;
let lastSpawn = 0;
let lastFrameTime = 0;
let invulnUntil = 0;
let kickFlashUntil = 0;
let running = true;
let rafId = null;

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function setHeartFromClientPos(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const x = ((clientX - rect.left) / rect.width) * W;
  const y = ((clientY - rect.top) / rect.height) * H;
  heart.x = clamp(x, MARGIN, W - MARGIN);
  heart.y = clamp(y, MARGIN, H - MARGIN);
}

canvas.addEventListener("mousemove", (e) => {
  setHeartFromClientPos(e.clientX, e.clientY);
});

canvas.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
    const t = e.touches[0];
    if (t) setHeartFromClientPos(t.clientX, t.clientY);
  },
  { passive: false }
);

canvas.addEventListener(
  "touchmove",
  (e) => {
    e.preventDefault();
    const t = e.touches[0];
    if (t) setHeartFromClientPos(t.clientX, t.clientY);
  },
  { passive: false }
);

function difficultyProgress() {
  return clamp(elapsed / DURATION_MS, 0, 1);
}

function spawnInterval() {
  const p = difficultyProgress();
  return 900 - p * 600; // 900ms -> 300ms
}

function bulletSpeed() {
  const p = difficultyProgress();
  return 55 + p * 110; // 55px/s -> 165px/s
}

function spawnBullet() {
  const speed = bulletSpeed();
  const pattern = Math.floor(Math.random() * 3);

  if (pattern === 0) {
    // falls from the top
    const x = MARGIN + Math.random() * (W - MARGIN * 2);
    bullets.push({ x, y: -8, vx: 0, vy: speed, r: 6 });
  } else if (pattern === 1) {
    // sweeps in from a side
    const fromLeft = Math.random() < 0.5;
    const y = MARGIN + Math.random() * (H - MARGIN * 2);
    bullets.push({ x: fromLeft ? -8 : W + 8, y, vx: fromLeft ? speed : -speed, vy: 0, r: 6 });
  } else {
    // launches from the boss toward a random point below
    const targetX = MARGIN + Math.random() * (W - MARGIN * 2);
    const targetY = H - MARGIN;
    const startX = W / 2;
    const startY = 40;
    const dx = targetX - startX;
    const dy = targetY - startY;
    const dist = Math.hypot(dx, dy) || 1;
    bullets.push({ x: startX, y: startY, vx: (dx / dist) * speed, vy: (dy / dist) * speed, r: 6 });
    kickFlashUntil = performance.now() + 150;
  }
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
  if (hp <= 0) {
    loseFight();
  }
}

function drawBoss(now) {
  const cx = W / 2;
  const topY = 8;
  const kicking = now < kickFlashUntil;

  ctx.fillStyle = "#141414";
  ctx.fillRect(cx - 6, topY, 12, 4);

  ctx.fillStyle = "#e8b98a";
  ctx.fillRect(cx - 5, topY + 4, 10, 8);
  ctx.fillStyle = "#000";
  ctx.fillRect(cx - 3, topY + 7, 1, 1);
  ctx.fillRect(cx + 2, topY + 7, 1, 1);

  ctx.fillStyle = "#1fa3b5";
  ctx.fillRect(cx - 7, topY + 12, 14, 10);

  ctx.fillStyle = "#141414";
  ctx.fillRect(cx - 5, topY + 22, 4, 6);
  if (kicking) {
    ctx.fillRect(cx + 1, topY + 20, 8, 4);
  } else {
    ctx.fillRect(cx + 1, topY + 22, 4, 6);
  }
}

function drawHeart(x, y, flashOff) {
  if (flashOff) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#ff2d2d";
  ctx.beginPath();
  ctx.moveTo(0, 3);
  ctx.bezierCurveTo(-6, -4, -12, 4, 0, 10);
  ctx.bezierCurveTo(12, 4, 6, -4, 0, 3);
  ctx.fill();
  ctx.restore();
}

function drawBullet(b) {
  ctx.fillStyle = "#c98a3b";
  ctx.beginPath();
  ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
  ctx.fill();
}

function draw(now) {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 3;
  ctx.strokeRect(1.5, 1.5, W - 3, H - 3);

  drawBoss(now);
  bullets.forEach(drawBullet);

  const flashOff = now < invulnUntil && Math.floor(now / 100) % 2 === 0;
  drawHeart(heart.x, heart.y, flashOff);
}

function loseFight() {
  running = false;
  $("battle-status").textContent = "SETH landed one too many.";
  $("death-box").classList.remove("hidden");
}

function winFight() {
  running = false;
  $("battle-status").textContent = "You made it.";
  $("unlock-box").classList.remove("hidden");
}

function loop(now) {
  if (!running) return;
  if (!lastFrameTime) lastFrameTime = now;
  const dt = (now - lastFrameTime) / 1000;
  lastFrameTime = now;
  elapsed += dt * 1000;

  if (now - lastSpawn > spawnInterval()) {
    lastSpawn = now;
    spawnBullet();
  }

  bullets.forEach((b) => {
    b.x += b.vx * dt;
    b.y += b.vy * dt;
  });
  bullets = bullets.filter((b) => b.x > -20 && b.x < W + 20 && b.y > -20 && b.y < H + 20);

  bullets.forEach((b) => {
    const dist = Math.hypot(b.x - heart.x, b.y - heart.y);
    if (dist < b.r + HEART_R) {
      takeHit(now);
    }
  });

  draw(now);

  if (elapsed >= DURATION_MS && hp > 0) {
    winFight();
    return;
  }

  rafId = requestAnimationFrame(loop);
}

function resetGame() {
  heart = { x: W / 2, y: H - 30 };
  bullets = [];
  hp = MAX_HP;
  elapsed = 0;
  lastSpawn = 0;
  lastFrameTime = 0;
  invulnUntil = 0;
  kickFlashUntil = 0;
  running = true;
  updateHearts();
  $("death-box").classList.add("hidden");
  $("unlock-box").classList.add("hidden");
  $("battle-status").textContent = "Move your mouse (or press and hold on mobile) to dodge.";
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(loop);
}

$("retry-btn").addEventListener("click", resetGame);

updateHearts();
rafId = requestAnimationFrame(loop);

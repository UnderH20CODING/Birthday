/* channel.html logic — balance 3 stones on top of each other.
   The moving stone slides left/right; drop it so it overlaps enough
   with the stone below or it topples. A little spring-damped tilt
   fakes the "physics" of an imperfect landing. */

const $ = (id) => document.getElementById(id);

const canvas = $("stack-canvas");
const ctx = canvas.getContext("2d");
const W = canvas.width;
const H = canvas.height;
const GROUND_Y = 210;
const STONE_H = 26;
const MIN_OVERLAP = 16;
const STONES_TO_WIN = 3;
const GROUND_MIN_X = 20;
const GROUND_MAX_X = W - 20;
const GRAVITY = 420;

let placed = [];
let stackTopY = GROUND_Y;
let current = null;
let toppling = null;
let running = true;
let lastFrameTime = 0;
let rafId = null;

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function spawnCurrent() {
  const round = placed.length;
  const width = Math.max(30, 90 * Math.pow(0.8, round));
  const speed = 70 + round * 20;
  current = {
    width,
    xCenter: W / 2,
    y: stackTopY - 60,
    vx: speed,
  };
}

function supportRange() {
  if (placed.length === 0) return { min: GROUND_MIN_X, max: GROUND_MAX_X };
  const top = placed[placed.length - 1];
  return { min: top.xMin, max: top.xMax };
}

function doDrop() {
  if (!running || !current || toppling) return;
  const curMin = current.xCenter - current.width / 2;
  const curMax = current.xCenter + current.width / 2;
  const support = supportRange();
  const overlapMin = Math.max(curMin, support.min);
  const overlapMax = Math.min(curMax, support.max);
  const overlapWidth = overlapMax - overlapMin;

  if (overlapWidth < MIN_OVERLAP) {
    toppling = {
      xMin: curMin,
      xMax: curMax,
      y: current.y,
      vx: current.vx * 0.6,
      vy: 0,
      rotation: 0,
      angularVel: (curMin < support.min ? -1 : 1) * 4,
    };
    current = null;
    return;
  }

  const supportCenter = (support.min + support.max) / 2;
  const offsetRatio = clamp((current.xCenter - supportCenter) / (current.width / 2), -1, 1);
  const stone = {
    xMin: overlapMin,
    xMax: overlapMax,
    y: stackTopY - STONE_H,
    rotation: offsetRatio * 0.22,
  };
  placed.push(stone);
  stackTopY = stone.y;
  $("stack-display").textContent = placed.length;

  if (placed.length >= STONES_TO_WIN) {
    winStack();
    return;
  }
  spawnCurrent();
}

$("drop-btn").addEventListener("click", doDrop);
window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    doDrop();
  }
});
canvas.addEventListener("mousedown", doDrop);
canvas.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
    doDrop();
  },
  { passive: false }
);

function drawGround() {
  ctx.fillStyle = "#3a2a1a";
  ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);
  ctx.fillStyle = "#5d9c3f";
  ctx.fillRect(0, GROUND_Y, W, 4);
}

function drawStone(centerX, centerY, width, rotation, color) {
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(rotation);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(-width / 2, -STONE_H / 2, width, STONE_H, 8);
  ctx.fill();
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}

function draw(dt) {
  ctx.fillStyle = "#101012";
  ctx.fillRect(0, 0, W, H);
  drawGround();

  placed.forEach((s, i) => {
    const centerX = (s.xMin + s.xMax) / 2;
    const width = s.xMax - s.xMin;
    const centerY = s.y + STONE_H / 2;
    s.rotation *= Math.pow(0.02, dt);
    drawStone(centerX, centerY, width, s.rotation, "#8a8a8a");
  });

  if (current) {
    current.xCenter += current.vx * dt;
    if (current.xCenter - current.width / 2 < GROUND_MIN_X) {
      current.xCenter = GROUND_MIN_X + current.width / 2;
      current.vx *= -1;
    } else if (current.xCenter + current.width / 2 > GROUND_MAX_X) {
      current.xCenter = GROUND_MAX_X - current.width / 2;
      current.vx *= -1;
    }
    drawStone(current.xCenter, current.y + STONE_H / 2, current.width, 0, "#a3a3a3");
  }

  if (toppling) {
    toppling.vy += GRAVITY * dt;
    toppling.y += toppling.vy * dt;
    const midX = (toppling.xMin + toppling.xMax) / 2 + toppling.vx * dt;
    toppling.xMin += toppling.vx * dt;
    toppling.xMax += toppling.vx * dt;
    toppling.rotation += toppling.angularVel * dt;
    drawStone(midX, toppling.y + STONE_H / 2, toppling.xMax - toppling.xMin, toppling.rotation, "#a3a3a3");
    if (toppling.y > H + 60) {
      toppling = null;
      loseStack();
    }
  }
}

function loseStack() {
  running = false;
  $("battle-status").textContent = "It fell.";
  $("death-box").classList.remove("hidden");
}

function winStack() {
  running = false;
  current = null;
  $("battle-status").textContent = "Perfectly balanced.";
  $("unlock-box").classList.remove("hidden");
}

function loop(now) {
  if (!lastFrameTime) lastFrameTime = now;
  const dt = Math.min((now - lastFrameTime) / 1000, 0.05);
  lastFrameTime = now;

  draw(dt);

  if (running || toppling) {
    rafId = requestAnimationFrame(loop);
  }
}

function resetGame() {
  placed = [];
  stackTopY = GROUND_Y;
  toppling = null;
  running = true;
  lastFrameTime = 0;
  $("stack-display").textContent = "0";
  $("death-box").classList.add("hidden");
  $("unlock-box").classList.add("hidden");
  $("battle-status").textContent = "Tap DROP when the stone lines up.";
  spawnCurrent();
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(loop);
}

$("retry-btn").addEventListener("click", resetGame);

spawnCurrent();
rafId = requestAnimationFrame(loop);

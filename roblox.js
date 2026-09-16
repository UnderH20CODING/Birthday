/* roblox.html logic — Tetris, but every piece is stamped with a letter
   from S-M-E-G-M-A. Clear 3 lines to pass. */

const $ = (id) => document.getElementById(id);

const canvas = $("tetris-canvas");
const ctx = canvas.getContext("2d");
const COLS = 10;
const ROWS = 16;
const CELL = 18;

const WORD = "SMEGMA";
const LINES_TO_WIN = 3;
const DROP_INTERVAL_MS = 550;

const PIECES = {
  I: { color: "#4fd6e8", rotations: [[[0,1],[1,1],[2,1],[3,1]], [[2,0],[2,1],[2,2],[2,3]]] },
  O: { color: "#ffd23f", rotations: [[[1,0],[2,0],[1,1],[2,1]]] },
  T: { color: "#b06cd9", rotations: [[[1,0],[0,1],[1,1],[2,1]], [[1,0],[1,1],[2,1],[1,2]], [[0,1],[1,1],[2,1],[1,2]], [[1,0],[0,1],[1,1],[1,2]]] },
  S: { color: "#5d9c3f", rotations: [[[1,0],[2,0],[0,1],[1,1]], [[1,0],[1,1],[2,1],[2,2]]] },
  Z: { color: "#d63b3b", rotations: [[[0,0],[1,0],[1,1],[2,1]], [[2,0],[1,1],[2,1],[1,2]]] },
  J: { color: "#4d79c7", rotations: [[[0,0],[0,1],[1,1],[2,1]], [[1,0],[2,0],[1,1],[1,2]], [[0,1],[1,1],[2,1],[2,2]], [[1,0],[1,1],[0,2],[1,2]]] },
  L: { color: "#e08a2b", rotations: [[[2,0],[0,1],[1,1],[2,1]], [[1,0],[1,1],[1,2],[2,2]], [[0,1],[1,1],[2,1],[0,2]], [[0,0],[1,0],[1,1],[1,2]]] },
};
const TYPES = Object.keys(PIECES);

let grid = makeEmptyGrid();
let current = null;
let pieceCount = 0;
let linesCleared = 0;
let dropTimer = 0;
let lastFrameTime = 0;
let running = true;
let rafId = null;

function makeEmptyGrid() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function spawnPiece() {
  const type = TYPES[Math.floor(Math.random() * TYPES.length)];
  const letter = WORD[pieceCount % WORD.length];
  pieceCount++;
  const piece = { type, rot: 0, x: Math.floor(COLS / 2) - 1, y: 0, letter };
  if (collides(piece, 0, 0, 0)) {
    loseTetris();
    return null;
  }
  return piece;
}

function cellsOf(piece, rotOverride) {
  const rot = rotOverride === undefined ? piece.rot : rotOverride;
  const states = PIECES[piece.type].rotations;
  return states[rot % states.length];
}

function collides(piece, dx, dy, drot) {
  const cells = cellsOf(piece, (piece.rot + drot) % PIECES[piece.type].rotations.length);
  for (const [cx, cy] of cells) {
    const x = piece.x + cx + dx;
    const y = piece.y + cy + dy;
    if (x < 0 || x >= COLS || y >= ROWS) return true;
    if (y >= 0 && grid[y][x]) return true;
  }
  return false;
}

function lockPiece(piece) {
  const cells = cellsOf(piece);
  const color = PIECES[piece.type].color;
  for (const [cx, cy] of cells) {
    const x = piece.x + cx;
    const y = piece.y + cy;
    if (y >= 0) grid[y][x] = { color, letter: piece.letter };
  }
  clearLines();
  current = spawnPiece();
}

function clearLines() {
  let cleared = 0;
  for (let y = ROWS - 1; y >= 0; y--) {
    if (grid[y].every((c) => c)) {
      grid.splice(y, 1);
      grid.unshift(Array(COLS).fill(null));
      cleared++;
      y++;
    }
  }
  if (cleared > 0) {
    linesCleared += cleared;
    $("lines-display").textContent = Math.min(linesCleared, LINES_TO_WIN);
    if (linesCleared >= LINES_TO_WIN) winTetris();
  }
}

function move(dx) {
  if (!current || !running) return;
  if (!collides(current, dx, 0, 0)) current.x += dx;
}

function rotate() {
  if (!current || !running) return;
  if (!collides(current, 0, 0, 1)) {
    current.rot = (current.rot + 1) % PIECES[current.type].rotations.length;
  }
}

function softDrop() {
  if (!current || !running) return;
  if (!collides(current, 0, 1, 0)) {
    current.y += 1;
  } else {
    lockPiece(current);
  }
  dropTimer = 0;
}

function hardDrop() {
  if (!current || !running) return;
  while (!collides(current, 0, 1, 0)) current.y += 1;
  lockPiece(current);
  dropTimer = 0;
}

window.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft") { e.preventDefault(); move(-1); }
  else if (e.code === "ArrowRight") { e.preventDefault(); move(1); }
  else if (e.code === "ArrowUp") { e.preventDefault(); rotate(); }
  else if (e.code === "ArrowDown") { e.preventDefault(); softDrop(); }
  else if (e.code === "Space") { e.preventDefault(); hardDrop(); }
});

$("btn-left").addEventListener("click", () => move(-1));
$("btn-right").addEventListener("click", () => move(1));
$("btn-rotate").addEventListener("click", rotate);
$("btn-down").addEventListener("click", softDrop);

function drawCell(x, y, color, letter) {
  ctx.fillStyle = color;
  ctx.fillRect(x * CELL, y * CELL, CELL - 1, CELL - 1);
  ctx.fillStyle = "#000";
  ctx.font = "10px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(letter, x * CELL + CELL / 2, y * CELL + CELL / 2 + 1);
}

function draw() {
  ctx.fillStyle = "#101012";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const cell = grid[y][x];
      if (cell) drawCell(x, y, cell.color, cell.letter);
    }
  }

  if (current) {
    const color = PIECES[current.type].color;
    for (const [cx, cy] of cellsOf(current)) {
      drawCell(current.x + cx, current.y + cy, color, current.letter);
    }
  }
}

function loseTetris() {
  running = false;
  $("battle-status").textContent = "The stack topped out.";
  $("death-box").classList.remove("hidden");
}

function winTetris() {
  running = false;
  $("battle-status").textContent = "Cleared enough lines.";
  $("unlock-box").classList.remove("hidden");
}

function loop(now) {
  if (!running) {
    draw();
    return;
  }
  if (!lastFrameTime) lastFrameTime = now;
  const dt = now - lastFrameTime;
  lastFrameTime = now;

  dropTimer += dt;
  if (dropTimer > DROP_INTERVAL_MS) {
    softDrop();
  }

  draw();
  rafId = requestAnimationFrame(loop);
}

function resetGame() {
  grid = makeEmptyGrid();
  pieceCount = 0;
  linesCleared = 0;
  dropTimer = 0;
  lastFrameTime = 0;
  running = true;
  $("lines-display").textContent = "0";
  $("death-box").classList.add("hidden");
  $("unlock-box").classList.add("hidden");
  $("battle-status").textContent = "Arrow keys or the buttons above. Space to hard-drop.";
  current = spawnPiece();
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(loop);
}

$("retry-btn").addEventListener("click", resetGame);

current = spawnPiece();
rafId = requestAnimationFrame(loop);

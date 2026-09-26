/* channel.html logic — Wild-West quick-draw reaction game.
   A flag drops at a random time; shoot only after it's raised. Draw
   too early, or too slow once it's up, and the sheriff gets you.
   Click, tap, or Space to shoot. 3 rounds, each faster than the last. */

const $ = (id) => document.getElementById(id);

const canvas = $("duel-canvas");
const ctx = canvas.getContext("2d");
const W = canvas.width;
const H = canvas.height;
const GROUND_Y = 140;

const THRESHOLDS_MS = [650, 500, 380];
const ROUNDS_TO_WIN = THRESHOLDS_MS.length;
const AUTO_FAIL_PADDING_MS = 400;

const POLE_X = W / 2;
const FLAG_DOWN_Y = GROUND_Y - 20;
const FLAG_UP_Y = GROUND_Y - 70;

let round = 0;
let hits = 0;
let roundState = "idle"; // idle -> waiting -> go -> (result)
let flagRaiseTime = 0;
let flagY = FLAG_DOWN_Y;
let flagTargetY = FLAG_DOWN_Y;
let waitTimeoutId = null;
let autoFailTimeoutId = null;
let flashUntil = 0;
let flashColor = null;
let running = true;
let rafId = null;

function updateHitsDisplay() {
  $("hits-display").textContent = hits;
}

function startRound() {
  roundState = "waiting";
  flagTargetY = FLAG_DOWN_Y;
  $("battle-status").textContent = `Round ${round + 1}/${ROUNDS_TO_WIN} — wait for the flag...`;
  const wait = 1000 + Math.random() * 2200;
  waitTimeoutId = setTimeout(() => {
    roundState = "go";
    flagTargetY = FLAG_UP_Y;
    flagRaiseTime = performance.now();
    $("battle-status").textContent = "DRAW!";
    autoFailTimeoutId = setTimeout(() => {
      if (roundState === "go") {
        loseDuel("TOO SLOW", "The sheriff got you.");
      }
    }, THRESHOLDS_MS[round] + AUTO_FAIL_PADDING_MS);
  }, wait);
}

function attemptShoot() {
  if (!running) return;

  if (roundState === "waiting") {
    clearTimeout(waitTimeoutId);
    loseDuel("TOO EARLY", "You drew before the flag went up.");
    return;
  }

  if (roundState === "go") {
    clearTimeout(autoFailTimeoutId);
    const reaction = performance.now() - flagRaiseTime;
    if (reaction <= THRESHOLDS_MS[round]) {
      hits++;
      updateHitsDisplay();
      flashColor = "good";
      flashUntil = performance.now() + 200;
      round++;
      if (round >= ROUNDS_TO_WIN) {
        winDuel();
      } else {
        roundState = "idle";
        $("battle-status").textContent = `Hit! (${Math.round(reaction)}ms)`;
        setTimeout(startRound, 1000);
      }
    } else {
      loseDuel("TOO SLOW", `You drew in ${Math.round(reaction)}ms. Not fast enough.`);
    }
  }
}

canvas.addEventListener("mousedown", attemptShoot);
canvas.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
    attemptShoot();
  },
  { passive: false }
);
window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    attemptShoot();
  }
});

function drawScene(now) {
  ctx.fillStyle = "#e8c77e";
  ctx.fillRect(0, 0, W, GROUND_Y);
  ctx.fillStyle = "#c9915a";
  ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);

  ctx.fillStyle = "#7a5230";
  ctx.fillRect(POLE_X - 2, GROUND_Y - 90, 4, 90);
  flagY += (flagTargetY - flagY) * 0.25;
  ctx.fillStyle = "#d63b3b";
  ctx.fillRect(POLE_X + 2, flagY, 20, 12);

  drawPerson(70, "#1f7fd6", false);
  drawPerson(W - 70, "#2b2b2b", true);

  if (now < flashUntil) {
    ctx.fillStyle = flashColor === "good" ? "rgba(93,156,63,0.35)" : "rgba(214,59,59,0.35)";
    ctx.fillRect(0, 0, W, H);
  }
}

function drawPerson(x, shirtColor, isSheriff) {
  const y = GROUND_Y - 34;
  ctx.fillStyle = shirtColor;
  ctx.fillRect(x - 7, y + 12, 14, 20);
  ctx.fillStyle = "#e8b98a";
  ctx.beginPath();
  ctx.arc(x, y + 6, 6, 0, Math.PI * 2);
  ctx.fill();
  if (isSheriff) {
    ctx.fillStyle = "#3a2a1a";
    ctx.fillRect(x - 9, y - 1, 18, 3);
    ctx.fillRect(x - 5, y - 6, 10, 6);
  }
  ctx.fillStyle = shirtColor;
  ctx.fillRect(x - 3, y + 32, 3, 8);
  ctx.fillRect(x, y + 32, 3, 8);
}

function loseDuel(title, message) {
  running = false;
  $("death-text").textContent = title;
  $("battle-status").textContent = message;
  $("death-box").classList.remove("hidden");
}

function winDuel() {
  running = false;
  $("battle-status").textContent = "Sheriff's down. You win.";
  $("unlock-box").classList.remove("hidden");
}

function loop(now) {
  drawScene(now);
  if (running) rafId = requestAnimationFrame(loop);
}

function resetGame() {
  clearTimeout(waitTimeoutId);
  clearTimeout(autoFailTimeoutId);
  round = 0;
  hits = 0;
  roundState = "idle";
  flagY = FLAG_DOWN_Y;
  flagTargetY = FLAG_DOWN_Y;
  flashUntil = 0;
  running = true;
  updateHitsDisplay();
  $("death-box").classList.add("hidden");
  $("unlock-box").classList.add("hidden");
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(loop);
  startRound();
}

$("retry-btn").addEventListener("click", resetGame);

updateHitsDisplay();
rafId = requestAnimationFrame(loop);
startRound();

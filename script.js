/* =========================================================
   EDIT ME: party config
   Change these values, then commit + push. Nothing else in
   this file needs to change for basic edits.
   ========================================================= */
const CONFIG = {
  // The code you send your friends as clues. Not case sensitive.
  SHARED_CODE: "PVP18",

  // Answer to the on-site backup puzzle riddle. Not case sensitive.
  // TODO: waiting on real riddle content.
  PUZZLE_ANSWER: "TBD",

  // Shown once someone solves the backup puzzle, telling them the real code.
  puzzleHintText() {
    return `Correct! The code is: ${CONFIG.SHARED_CODE}`;
  },

  // RSVP button target: a mailto:, tel:, form link, or Google Form URL.
  RSVP_HREF: "mailto:flatterfight332@gmail.com?subject=I'm%20in%20for%20the%20PvP%20Birthday!",
};

/* ========================================================= */

const $ = (id) => document.getElementById(id);

const screens = {
  landing: $("screen-landing"),
  chest: $("screen-chest"),
  reveal: $("screen-reveal"),
};

function showScreen(name) {
  Object.values(screens).forEach((el) => el.classList.remove("active"));
  screens[name].classList.add("active");
}

function normalize(str) {
  return str.trim().toLowerCase();
}

/* ---------- lives / hearts on wrong code ---------- */
let livesLeft = 3;
const heartEls = () => Array.from($("hearts").querySelectorAll(".heart"));

function loseHeart() {
  const hearts = heartEls();
  const idx = hearts.length - livesLeft; // lose from the right
  if (hearts[idx]) hearts[idx].classList.add("lost");
  livesLeft = Math.max(0, livesLeft - 1);
  const box = $("hearts");
  box.classList.remove("shake");
  requestAnimationFrame(() => box.classList.add("shake"));
}

/* ---------- chest open -> reveal ---------- */
function playChestThenReveal() {
  showScreen("chest");
  setTimeout(() => {
    showScreen("reveal");
  }, 1500);
}

/* ---------- main code entry ---------- */
$("submit-btn").addEventListener("click", handleCodeSubmit);
$("code-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleCodeSubmit();
});

function handleCodeSubmit() {
  const val = $("code-input").value;
  const feedback = $("feedback");

  if (normalize(val) === normalize(CONFIG.SHARED_CODE)) {
    feedback.textContent = "Correct! Unlocking...";
    feedback.className = "feedback good";
    setTimeout(playChestThenReveal, 400);
  } else {
    feedback.textContent = "Nope. That's not it, PvP legend. Try again.";
    feedback.className = "feedback bad";
    loseHeart();
    $("code-input").value = "";
    $("code-input").focus();
  }
}

/* ---------- backup puzzle ---------- */
$("puzzle-toggle").addEventListener("click", () => {
  $("puzzle-box").classList.toggle("hidden");
});

$("puzzle-submit").addEventListener("click", handlePuzzleSubmit);
$("puzzle-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") handlePuzzleSubmit();
});

function handlePuzzleSubmit() {
  const val = $("puzzle-input").value;
  const feedback = $("puzzle-feedback");

  if (normalize(val) === normalize(CONFIG.PUZZLE_ANSWER)) {
    feedback.textContent = CONFIG.puzzleHintText();
    feedback.className = "feedback good";
    $("code-input").value = CONFIG.SHARED_CODE;
  } else {
    feedback.textContent = "Not quite. Look closer.";
    feedback.className = "feedback bad";
  }
}

/* ---------- skip straight to invite ---------- */
$("skip-link").addEventListener("click", (e) => {
  e.preventDefault();
  playChestThenReveal();
});

/* ---------- RSVP button target ---------- */
$("rsvp-btn").href = CONFIG.RSVP_HREF;

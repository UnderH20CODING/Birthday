/* index.html logic — code entry, skip link, chest reveal.
   Party/hunt values live in config.js (loaded before this file). */

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
    feedback.textContent = "Correct! One last trial...";
    feedback.className = "feedback good";
    setTimeout(() => { window.location.href = "quiz.html"; }, 500);
  } else {
    feedback.textContent = "Nope. That's not it, PvP legend. Try again.";
    feedback.className = "feedback bad";
    loseHeart();
    $("code-input").value = "";
    $("code-input").focus();
  }
}

/* ---------- arriving back here after passing the quiz ---------- */
(function checkQuizPassed() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("quizpassed") === "1") {
    playChestThenReveal();
  }
})();

/* ---------- skip straight to invite ---------- */
$("skip-link").addEventListener("click", (e) => {
  e.preventDefault();
  playChestThenReveal();
});

/* ---------- RSVP button target ---------- */
$("rsvp-btn").href = CONFIG.RSVP_HREF;

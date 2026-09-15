/* achievement.html logic — the "sync the spawnpoint" (birthday) challenge.
   Party/hunt values live in config.js (loaded before this file). */

const $ = (id) => document.getElementById(id);

function normalizeDate(str) {
  return str.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

function isCorrectDate(input) {
  const norm = normalizeDate(input);
  const accepted = ["october3", "oct3", "103", "3october", "3oct"];
  return accepted.includes(norm);
}

$("date-submit").addEventListener("click", handleSubmit);
$("date-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSubmit();
});

function handleSubmit() {
  const val = $("date-input").value;
  const feedback = $("feedback");

  if (isCorrectDate(val)) {
    feedback.textContent = "Synced! Fragment restored.";
    feedback.className = "feedback good";
    $("achievement-card").classList.remove("locked");
    $("achievement-card").querySelector(".achievement-icon").textContent = "★";
    $("achievement-card").querySelector(".achievement-title").textContent = "Achievement Unlocked";
    $("achievement-card").querySelector(".achievement-sub").textContent = "Spawnpoint Synced";
    $("code-reveal").textContent = CONFIG.SHARED_CODE;
    $("unlock-box").classList.remove("hidden");
  } else {
    feedback.textContent = "Not synced yet. Try again.";
    feedback.className = "feedback bad";
  }
}

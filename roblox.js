/* roblox.html logic — find the first game in Sethgamer357's Roblox favorites.
   Party/hunt values live in config.js (loaded before this file). */

const $ = (id) => document.getElementById(id);

function normalizeGame(str) {
  return str.trim().toLowerCase().replace(/[\s\-_]/g, "");
}

function isCorrectGame(input) {
  const norm = normalizeGame(input);
  const accepted = ["slapbattles", "slappbattles"];
  return accepted.includes(norm);
}

$("game-submit").addEventListener("click", handleSubmit);
$("game-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSubmit();
});

function handleSubmit() {
  const val = $("game-input").value;
  const feedback = $("feedback");

  if (isCorrectGame(val)) {
    feedback.textContent = "Correct.";
    feedback.className = "feedback good";
    $("unlock-box").classList.remove("hidden");
  } else {
    feedback.textContent = "Hint: go to roblox.com and search Sethgamer357";
    feedback.className = "feedback bad";
  }
}

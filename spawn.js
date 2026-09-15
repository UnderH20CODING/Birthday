/* spawn.html logic — the secret "sword PvP rank" challenge.
   Party/hunt values live in config.js (loaded before this file). */

const $ = (id) => document.getElementById(id);

function normalizeRank(str) {
  return str.trim().toLowerCase().replace(/[\s\-_]/g, "");
}

function isCorrectRank(input) {
  const norm = normalizeRank(input);
  const accepted = ["lt3", "lowtier3"];
  return accepted.includes(norm);
}

$("rank-submit").addEventListener("click", handleSubmit);
$("rank-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSubmit();
});

function handleSubmit() {
  const val = $("rank-input").value;
  const feedback = $("feedback");

  if (isCorrectRank(val)) {
    feedback.textContent = "Correct! You really do know him.";
    feedback.className = "feedback good";
    $("code-reveal").textContent = CONFIG.SHARED_CODE;
    $("return-link").href = "index.html?unlocked=1";
    $("unlock-box").classList.remove("hidden");
  } else {
    feedback.textContent = "Nope. Ask the boys.";
    feedback.className = "feedback bad";
  }
}

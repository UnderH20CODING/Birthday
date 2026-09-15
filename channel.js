/* channel.html logic — who Judelow is joke-shipped with (Sharpness).
   Party/hunt values live in config.js (loaded before this file). */

const $ = (id) => document.getElementById(id);

function normalizeShip(str) {
  return str.trim().toLowerCase().replace(/[\s\-_]/g, "");
}

function isCorrectShip(input) {
  const norm = normalizeShip(input);
  const accepted = ["sharpness", "sharplow"];
  return accepted.includes(norm);
}

$("ship-submit").addEventListener("click", handleSubmit);
$("ship-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSubmit();
});

function handleSubmit() {
  const val = $("ship-input").value;
  const feedback = $("feedback");

  if (isCorrectShip(val)) {
    feedback.textContent = "Correct.";
    feedback.className = "feedback good";
    $("unlock-box").classList.remove("hidden");
  } else {
    feedback.textContent = "Hint: search Judelow Minecraft";
    feedback.className = "feedback bad";
  }
}

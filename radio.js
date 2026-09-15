/* radio.html logic — the producer tag at the start of Industry Baby (Daytrip).
   Party/hunt values live in config.js (loaded before this file). */

const $ = (id) => document.getElementById(id);

function normalizeProducer(str) {
  return str.trim().toLowerCase().replace(/[\s\-_]/g, "");
}

function isCorrectProducer(input) {
  const norm = normalizeProducer(input);
  const accepted = ["daytrip"];
  return accepted.includes(norm);
}

$("producer-submit").addEventListener("click", handleSubmit);
$("producer-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSubmit();
});

function handleSubmit() {
  const val = $("producer-input").value;
  const feedback = $("feedback");

  if (isCorrectProducer(val)) {
    feedback.textContent = "Correct.";
    feedback.className = "feedback good";
    $("unlock-box").classList.remove("hidden");
  } else {
    feedback.textContent = "Hint: listen to the first 3 seconds again";
    feedback.className = "feedback bad";
  }
}

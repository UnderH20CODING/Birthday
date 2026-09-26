/* quiz.html logic — the final multiple choice trial.
   Party/hunt values live in config.js (loaded before this file). */

const $ = (id) => document.getElementById(id);

const ANSWER_KEY = {
  q1: "B",
  q2: "D",
  q3: "C",
  q4: "D",
  q5: "B",
  q6: "D",
  q7: "D",
};
const TOTAL_QUESTIONS = Object.keys(ANSWER_KEY).length;

const form = $("quiz-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  handleSubmit();
});

function handleSubmit() {
  const feedback = $("feedback");
  const data = new FormData(form);

  let score = 0;
  let allAnswered = true;
  const wrongQuestions = [];

  for (const [question, correct] of Object.entries(ANSWER_KEY)) {
    const given = data.get(question);
    if (!given) allAnswered = false;
    if (given === correct) {
      score++;
    } else {
      wrongQuestions.push(question.replace("q", ""));
    }
  }

  $("score-display").textContent = score;

  if (!allAnswered) {
    feedback.textContent = "Answer every question first.";
    feedback.className = "feedback bad";
    return;
  }

  if (score === TOTAL_QUESTIONS) {
    feedback.textContent = `${score}/${TOTAL_QUESTIONS}, perfect score! Unlocking...`;
    feedback.className = "feedback good";
    setTimeout(() => {
      window.location.href = "index.html?quizpassed=1";
    }, 800);
  } else {
    const missed = wrongQuestions.length === 1 ? "question" : "questions";
    feedback.textContent = `${score}/${TOTAL_QUESTIONS}. You got ${missed} ${wrongQuestions.join(", ")} wrong. Resetting the quiz...`;
    feedback.className = "feedback bad";
    setTimeout(() => {
      form.reset();
      $("score-display").textContent = "?";
      feedback.textContent = "";
    }, 2500);
  }
}

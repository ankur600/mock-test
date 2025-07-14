let currentQuestion = 0;
let score = 0;
let timer = 12600; // 3 hours
let interval = null;
let isPaused = false;
let questions = [];
let selectedAnswers = [];

fetch("questions.json")
  .then(res => res.json())
  .then(data => {
    questions = data;
    document.getElementById("start-btn").addEventListener("click", () => {
      document.getElementById("start-screen").style.display = "none";
      document.getElementById("quiz-box").style.display = "block";
      loadQuestion();
      startTimer();
    });
  });

function loadQuestion() {
  const q = questions[currentQuestion];

  // Set question counter
  document.getElementById("question-counter").textContent =
    `Question ${currentQuestion + 1} of ${questions.length}`;

  // Set question image
  const imgEl = document.getElementById("question-image");
  imgEl.src = q.image;
  imgEl.alt = `Question ${currentQuestion + 1}`;

  // Render options
  const optionsEl = document.getElementById("options");
  optionsEl.innerHTML = "";
  q.options.forEach((opt, idx) => {
    const li = document.createElement("li");
    li.innerHTML = `<label><input type="radio" name="opt" value="${idx}"> ${opt}</label>`;
    optionsEl.appendChild(li);
  });
}

document.getElementById("next-btn").addEventListener("click", () => {
  const selected = document.querySelector("input[name='opt']:checked");
  if (!selected) return alert("Please select an option.");
  const selectedVal = parseInt(selected.value);
  selectedAnswers[currentQuestion] = selectedVal;
  if (selectedVal === questions[currentQuestion].answer) score++;
  currentQuestion++;
  if (currentQuestion < questions.length) loadQuestion();
  else showResult();
});

function showResult() {
  clearInterval(interval);
  document.getElementById("quiz-box").style.display = "none";
  const resultBox = document.getElementById("result");
  resultBox.style.display = "block";

  let resultHTML = `<h2>Your score: ${score}/${questions.length}</h2><hr>`;

  questions.forEach((q, idx) => {
    const userAnswer = selectedAnswers[idx];
    const correctAnswer = q.answer;

    resultHTML += `<div class="question-block">
      <h3>Q${idx + 1}</h3>
      <img src="${q.image}" alt="Q${idx + 1}" style="max-width: 300px;"><br>
      <ul>`;

    q.options.forEach((opt, i) => {
      let className = "";
      if (i === correctAnswer) className = "correct";
      else if (i === userAnswer && userAnswer !== correctAnswer) className = "wrong";

      resultHTML += `<li class="${className}">
        ${opt}
        ${i === correctAnswer ? " ✅" : ""}
        ${i === userAnswer && userAnswer !== correctAnswer ? " ❌ (your answer)" : ""}
      </li>`;
    });

    resultHTML += `</ul></div><hr>`;
  });

  resultBox.innerHTML = resultHTML;
}

function startTimer() {
  interval = setInterval(() => {
    let hours = Math.floor(timer / 3600);
    let minutes = Math.floor((timer % 3600) / 60);
    let seconds = timer % 60;

    const formatted =
      String(hours).padStart(2, '0') + ':' +
      String(minutes).padStart(2, '0') + ':' +
      String(seconds).padStart(2, '0');

    document.getElementById("timer").textContent = `Time left: ${formatted}`;

    if (timer <= 0) {
      clearInterval(interval);
      showResult();
    }

    timer--;
  }, 1000);
}

document.getElementById("pause-btn").addEventListener("click", () => {
  if (isPaused) {
    startTimer();
    document.getElementById("pause-btn").textContent = "Pause";
  } else {
    clearInterval(interval);
    document.getElementById("pause-btn").textContent = "Resume";
  }
  isPaused = !isPaused;
});

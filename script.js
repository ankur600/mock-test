let currentQuestion = 0;
let score = 0;
let timer = 10800;
let questions = [];

fetch("questions.json")
  .then(res => res.json())
  .then(data => {
    questions = data;
    loadQuestion();
    startTimer();
  });

function loadQuestion() {
  const q = questions[currentQuestion];
  const imgEl = document.getElementById("question-image");
  const optionsEl = document.getElementById("options");

  // Set question image
  imgEl.src = q.image;
  imgEl.alt = `Question ${currentQuestion + 1}`;

  // Render options
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
  if (!window.selectedAnswers) selectedAnswers = [];
  selectedAnswers[currentQuestion] = parseInt(selected.value);
  if (parseInt(selected.value) === questions[currentQuestion].answer) score++;
  currentQuestion++;
  if (currentQuestion < questions.length) loadQuestion();
  else showResult();
});

function showResult() {
    document.getElementById("quiz-box").style.display = "none";
    const resultBox = document.getElementById("result");
    resultBox.style.display = "block";
  
    let resultHTML = `<h2>Your score: ${score}/${questions.length}</h2><hr>`;
  
    questions.forEach((q, idx) => {
      const userAnswer = selectedAnswers[idx];
      const correctAnswer = q.answer;
  
      resultHTML += `<div class="question-block">
        <h3>Q${idx + 1}: ${q.question}</h3>
        <ul>`;
  
      q.options.forEach((opt, i) => {
        let className = "";
  
        if (i === correctAnswer) {
          className = "correct";
        } 
        if (i === userAnswer && userAnswer !== correctAnswer) {
          className = "wrong";
        }
  
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
    const timerEl = document.getElementById("timer");
    const interval = setInterval(() => {
      let hours = Math.floor(timer / 3600);
      let minutes = Math.floor((timer % 3600) / 60);
      let seconds = timer % 60;
  
      // Pad single digits with a leading zero
      const formatted = 
        String(hours).padStart(2, '0') + ':' + 
        String(minutes).padStart(2, '0') + ':' + 
        String(seconds).padStart(2, '0');
  
      timerEl.textContent = `Time left: ${formatted}`;
  
      if (timer <= 0) {
        clearInterval(interval);
        showResult();
      }
  
      timer--;
    }, 1000);
  }

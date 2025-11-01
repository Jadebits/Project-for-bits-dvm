fetch("questions.json")
  .then(response => response.json())
  .then(questions => startQuiz(questions))
  .catch(error => alert("Error loading questions: " + error));

function startQuiz(questions) {
  let score = 0;
  let responses = [];

  alert("Welcome to the Quiz! You will be asked " + questions.length + " questions.");

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];

    // Build question text
    let message = `Q${i + 1}: ${q.question}\n`;
    for (let j = 0; j < q.options.length; j++) {
      message += `${j + 1}) ${q.options[j]}\n`;
    }

    // Get user answer
    let answer = prompt(message + "\nEnter your choice (1-" + q.options.length + "):");
    let userIndex = parseInt(answer) - 1;

    // Convert JSON "answer" (string, 1-based) to correct index
    let correctIndex = parseInt(q.answer) - 1;

    // Validate
    if (isNaN(userIndex) || userIndex < 0 || userIndex >= q.options.length) {
      alert("⚠️ Invalid input! Skipping question.");
      responses.push({
        question: q.question,
        userAnswer: "Invalid",
        correctAnswer: q.options[correctIndex],
        isCorrect: false
      });
      continue;
    }

    // Check correctness
    const isCorrect = userIndex === correctIndex;
    if (isCorrect) {
      alert("✅ Correct!");
      score++;
    } else {
      alert("❌ Wrong! Correct answer: " + q.options[correctIndex]);
    }

    // Record response
    responses.push({
      question: q.question,
      userAnswer: q.options[userIndex],
      correctAnswer: q.options[correctIndex],
      isCorrect: isCorrect
    });
  }

  alert(`Quiz completed!\nYour score: ${score}/${questions.length}`);

  const report = {
    score: score,
    totalQuestions: questions.length,
    responses: responses
  };

  downloadReport(report);
}

function downloadReport(report) {
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "report.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

const introEl = document.querySelector("#intro");
const questionsEl = document.querySelector("#questions");
let questionEl = document.querySelector("#question");
const finalEl = document.querySelector("#final");
const timeEl = document.querySelector("p.time");
const resultsTable = document.querySelector("#resultsBody");

const startBtn = document.querySelector("#start");
const ansBtn = document.querySelectorAll("button.ansBtn");

let questionCount = 0;
let questionSecondsLeft = 30;
let questions = [];
let questionTimer;
let answerClickable = false;
let userAnswers = [];

async function fetchQuestions() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();

    questions = data.slice(0, 10).map((item, index) => {
      const answers = item.body.split("\n").slice(0, 4);
      return {
        question: `${index + 1}. ${item.title}`,
        answers: [
          `A: ${answers[0]}`,
          `B: ${answers[1]}`,
          `C: ${answers[2]}`,
          `D: ${answers[3]}`,
        ],
        correctAnswer: "A",
      };
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
}

function setQuestionTime() {
  clearInterval(questionTimer);
  questionSecondsLeft = 30;
  timeEl.textContent = `Time: ${questionSecondsLeft}s`;
  questionTimer = setInterval(function () {
    questionSecondsLeft--;
    timeEl.textContent = `Time: ${questionSecondsLeft}s`;

    if (questionSecondsLeft === 0) {
      handleNoAnswer();
    }
  }, 1000);
}

function handleNoAnswer() {
  if (questionCount < questions.length - 1) {
    userAnswers.push({
      question: questions[questionCount].question,
      userAnswer: "",
      correctAnswer: questions[questionCount].correctAnswer,
      isCorrect: false,
    });
    questionCount++;
    setQuestion(questionCount);
  } else {
    userAnswers.push({
      question: questions[questionCount].question,
      userAnswer: "",
      correctAnswer: questions[questionCount].correctAnswer,
      isCorrect: false,
    });
    clearInterval(questionTimer);
    questionsEl.style.display = "none";
    finalEl.style.display = "block";
    displayResults();
  }
}

function startQuiz() {
  introEl.style.display = "none";
  questionsEl.style.display = "block";
  questionCount = 0;
  userAnswers = [];

  setQuestion(questionCount);
}

function setQuestion(id) {
  if (id < questions.length) {
    questionEl.textContent = questions[id].question;
    ansBtn[0].textContent = questions[id].answers[0];
    ansBtn[1].textContent = questions[id].answers[1];
    ansBtn[2].textContent = questions[id].answers[2];
    ansBtn[3].textContent = questions[id].answers[3];

    answerClickable = false;
    ansBtn.forEach((btn) => (btn.disabled = true));

    setTimeout(() => {
      answerClickable = true;
      ansBtn.forEach((btn) => (btn.disabled = false));
    }, 10000);

    setQuestionTime();
  }
}

function checkAnswer(event) {
  event.preventDefault();

  if (!answerClickable) return;

  const userAnswer = event.target.textContent[0];
  userAnswers.push({
    question: questions[questionCount].question,
    userAnswer: userAnswer,
    correctAnswer: questions[questionCount].correctAnswer,
    isCorrect: userAnswer === questions[questionCount].correctAnswer,
  });

  if (questionCount < questions.length - 1) {
    questionCount++;
  } else {
    clearInterval(questionTimer);
    questionsEl.style.display = "none";
    finalEl.style.display = "block";
    displayResults();
  }
  setQuestion(questionCount);
}

function displayResults() {
  userAnswers.forEach((answer) => {
    const row = document.createElement("tr");
    const questionCell = document.createElement("td");
    const userAnswerCell = document.createElement("td");
    const correctAnswerCell = document.createElement("td");

    questionCell.textContent = answer.question;
    userAnswerCell.textContent = answer.userAnswer || "Cevaplanmadı";
    correctAnswerCell.textContent = answer.correctAnswer;

    if (answer.isCorrect) {
      userAnswerCell.classList.add("correct");
    } else {
      userAnswerCell.classList.add("incorrect");
    }

    row.appendChild(questionCell);
    row.appendChild(userAnswerCell);
    row.appendChild(correctAnswerCell);
    resultsTable.appendChild(row);
  });
}

startBtn.addEventListener("click", async () => {
  await fetchQuestions();
  startQuiz();
});

ansBtn.forEach((item) => {
  item.addEventListener("click", checkAnswer);
});

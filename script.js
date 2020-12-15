var landingPageEl = document.getElementById("main-page");
var startBtnEl = document.getElementById("begin-quiz");
var quizEl = document.getElementById("quiz-section");
var scorePageEl = document.getElementById("high-score");
var leaderboardEl = document.getElementById("leaderboard");
var answersEl = document.getElementById("answer-container");
var questionEl = document.getElementById("question");
var scoreContainerEl = document.getElementById("score-container");
var scoreEl = document.getElementById("score");
var timerEl = document.getElementById("timer");
var finalScoreEl = document.getElementById("final-score");
var formEl = document.getElementById("form");
var initialsEl = document.getElementById("initials");
var highScoresEl = document.getElementById("high-scores");
var scoreBtnEl = document.getElementById("post-score");
var restartBtnEl = document.getElementById("restart-btn");0
var clearBtnEl = document.getElementById("clear-btn");
var index = 0;
var score = 0;
var totalQuestions = 5;
var seconds = 60;
var penalty = 10;
var interval;
var users = [];

// Questions/Answer Key
var quizData = [
  {
    question:
      "A giant Angora rabbit should have what percentage of hay in their diet?",
    answers: ["70", "none", "80", "40"],
    correctIndex: 0,
  },
  {
    question: "What are the different ways to gather their wool?",
    answers: ["pluck", "shear", "scissor", "any of the above"],
    correctIndex: 3,
  },
  {
    question: "How many times a year, on average, should you clip your Angora?",
    answers: ["1", "3", "4", "12"],
    correctIndex: 2,
  },
  {
    question: "Which type of tablet will help prevent wool block?",
    answers: ["mango", "papaya", "pineapple", "grape"],
    correctIndex: 1,
  },
  {
    question: "How many pounds does a giant angora rabbit weigh?",
    answers: ["5 - 7 ", "7-11.5", "20", "8-10.5"],
    correctIndex: 1,
  },
];
//End Q/A
function renderQuestion(quizData) {
  answersEl.innerHTML = "";
  var question = quizData[index].question;
  var answers = quizData[index].answers;
  questionEl.textContent = question;
  answers.forEach(function (answer, index) {
    var button = document.createElement("button");
    button.setAttribute("id", index);
    button.className = "btn btn-primary btn-block btn-lg answer";
    button.textContent = answer;
    answersEl.appendChild(button);
  });
}

function showAlert(classes, message, parent, before) {
  clearAlert();
  if (
    classes === undefined ||
    message === undefined ||
    parent === undefined ||
    before === undefined
  ) {
    return;
  }
  var alertDiv = document.createElement("div");
  alertDiv.className = classes;
  alertDiv.textContent = message;
  parent.insertBefore(alertDiv, before);
}

function clearAlert() {
  var currentAlert = document.querySelector(".alert");
  if (currentAlert) {
    currentAlert.remove();
  }
}

function renderScore() {
  scoreEl.textContent = score;
}
function renderLeaderboard(user, percentScore) {
  clearAlert();
  var initials = user;
  var percentScore = percentScore;
  var li = document.createElement("li");
  li.className =
    "list-group-item d-flex justify-content-between align-items-center";
  var badge = document.createElement("span");
  badge.className = "badge badge-primary badge-pill p-2";
  badge.textContent = percentScore + "%";
  li.insertAdjacentText("afterbegin", initials);
  li.appendChild(badge);
  highScoresEl.prepend(li);
}
//localstorage
function renderHighScores() {
  // Check for users already in local storage
  if (localStorage.getItem("users") === null) {
    users = [];
  } else {
    users = JSON.parse(localStorage.getItem("users"));
  }
  users.forEach((user) => {
    renderLeaderboard(user.initials, user.score);
  });
}

function saveHighScore(initials, score) {
  var user = { initials, score };
  if (localStorage.getItem("users") === null) {
    users = [];
  } else {
    users = JSON.parse(localStorage.getItem("users"));
  }
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
}

function clearLeaderboard() {
  highScoresEl.innerHTML = "";
  localStorage.clear();
}
function submitAnswer(event) {
  if (event.target.classList.contains("answer")) {
    checkAnswer(event);
    if (index < quizData.length - 1) {
      index++;
      renderQuestion(quizData);
    } else {
      quizOver();
    }
  }
}

function checkAnswer(event) {
  var userAnswer = event.target.id * 1;
  var correctAnswer = quizData[index].correctIndex;
  if (userAnswer === correctAnswer) {
    score++;
    renderScore();
    showAlert(
      "alert alert-success text-center",
      "Perfect",
      quizEl,
      scoreContainerEl
    );
  } else {
    seconds = seconds - penalty;
    if (seconds > 0) {
      showAlert(
        "alert alert-primary text-center",
        "10 second penalty",
        quizEl,
        scoreContainerEl
      );
    } else {
      quizOver();
    }
  }
}
//timer
function runTimer() {
  timerEl.textContent = seconds;
  if (seconds > 0) {
    interval = setInterval(function () {
      if (seconds === 0) {
        quizOver();
      } else {
        seconds--;
        timerEl.textContent = seconds;
      }
    }, 1000);
  } else {
    quizOver();
  }
}

function stopTimer() {
  clearInterval(interval);
}
//end timer
//quiz
function startQuiz() {
  toggleSection(landingPageEl, quizEl);
  clearAlert();
  renderQuestion(quizData);
  runTimer();
}

function quizOver() {
  stopTimer();
  finalScoreEl.textContent = calculateScorePercent() + "%";
  toggleSection(quizEl, scorePageEl);
}

function resetQuiz() {
  index = 0;
  score = 0;
  seconds = 60;
  interval;
  scoreEl.textContent = score;
  timerEl.textContent = seconds;
  initialsEl.value = "";
  toggleSection(leaderboardEl, formEl);
  toggleSection(scorePageEl, landingPageEl);
}
function calculateScorePercent() {
  return (score / totalQuestions) * 100;
}
function toggleSection(prev, next) {
  prev.classList.replace("d-block", "d-none");
  next.classList.replace("d-none", "d-block");
}
//event listeners
document.addEventListener("DOMContentLoaded", renderHighScores);
startBtnEl.addEventListener("click", startQuiz);
answersEl.addEventListener("click", submitAnswer);
scoreBtnEl.addEventListener("click", function (event) {
  event.preventDefault();
  if (initialsEl.value === "") {
    showAlert(
      "alert alert-primary",
      "Enter your initials to continue",
      scorePageEl,
      formEl
    );
    setTimeout(function () {
      clearAlert();
    }, 2000);
  } else {
    var initials = initialsEl.value;
    var percentScore = calculateScorePercent();

    renderLeaderboard(initials, percentScore);
    saveHighScore(initials, percentScore);

    toggleSection(formEl, leaderboardEl);
  }
});
clearBtnEl.addEventListener("click", clearLeaderboard);
restartBtnEl.addEventListener("click", resetQuiz);

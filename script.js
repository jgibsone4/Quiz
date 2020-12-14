var timerEl = document.getElementById("timer");

function runTimer() {
 
  timerEl.textContent = seconds;

  if (seconds > 0) {
    interval = setInterval(function() {
      if (seconds === 0) {
        quizOver();
      } else {
        seconds--;
        timerEl.textContent = seconds;
      }
    }, 1000);
  } 
 
  else {
    quizOver();
  }
}

function stopTimer() {
  clearInterval(interval);
}

/* 
var timeEl = document.querySelector(".time");
var mainEl = document.getElementById("main");

var secondsLeft = 60;

function setTime() {
  var timerInterval = setInterval(function() {
    secondsLeft--;
    timeEl.textContent = secondsLeft + "";

    if(secondsLeft === 0) {
      clearInterval(timerInterval);
      sendMessage();
    }

  }, 1000);
}

function sendMessage() {
  timeEl.textContent = " ";

  var imgEl = document.createElement("img");

  imgEl.setAttribute("src", "images/image_1.jpg");
  mainEl.appendChild(imgEl);

}

setTime(); */
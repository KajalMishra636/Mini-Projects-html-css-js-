// Loader hide after page loads
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  loader.style.opacity = "0";
  setTimeout(() => loader.style.display = "none", 500); // fade out
});


const word = document.getElementById("word");
const text = document.getElementById("text");
const scoreElement = document.getElementById("score");
const timeElement = document.getElementById("time");
const endgameElement = document.getElementById("end-game-container");
const settingsButton = document.getElementById("settings-btn");
const settings = document.getElementById("settings");
const settingsForm = document.getElementById("settings-form");
const difficultySelect = document.getElementById("difficulty");
const progress = document.getElementById("progress");
const highscoreElement = document.getElementById("highscore");
const accuracyElement = document.getElementById("accuracy");
const wpmElement = document.getElementById("wpm");

const words = ["sigh","tense","airplane","ball","pies","juice","warlike","bad","north","dependent","steer","silver","highfalutin","superficial","quince","eight","feeble","admit","drag","loving"];

let randomWord;
let score = 0;
let time = 10;
let correctWords = 0;
let typedWords = 0;
let difficulty = localStorage.getItem("difficulty") || "medium";
let highscore = localStorage.getItem("highscore") || 0;

highscoreElement.innerText = highscore;
difficultySelect.value = difficulty;

function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

function addWordToDom() {
  randomWord = getRandomWord();
  word.innerText = randomWord;
}

function updateScore() {
  score++;
  scoreElement.innerText = score;
}

function updateTime() {
  time--;
  timeElement.innerText = time + "s";
  progress.style.width = (time / 10) * 100 + "%";

  if (time <= 0) {
    gameOver();
  }
}

function updateStats() {
  let accuracy = typedWords > 0 ? ((correctWords / typedWords) * 100).toFixed(1) : 100;
  let wpm = Math.round((correctWords / ((10 - time) / 60)) || 0);
  accuracyElement.innerText = accuracy + "%";
  wpmElement.innerText = wpm;
}

function gameOver() {
  clearInterval(timeInterval);
  if (score > highscore) {
    highscore = score;
    localStorage.setItem("highscore", highscore);
  }
  endgameElement.innerHTML = `
    <h1>Game Over</h1>
    <p>Your final score: ${score}</p>
    <p>High Score: ${highscore}</p>
    <p>Accuracy: ${accuracyElement.innerText}</p>
    <p>WPM: ${wpmElement.innerText}</p>
    <button onclick="restartGame()">Play Again</button>
  `;
  endgameElement.style.display = "flex";
}

function restartGame() {
  location.reload();
}

text.addEventListener("input", (e) => {
  const insertedText = e.target.value;
  typedWords++;
  if (insertedText === randomWord) {
    correctWords++;
    e.target.value = "";
    addWordToDom();
    updateScore();
    if (difficulty === "hard") time += 2;
    else if (difficulty === "medium") time += 3;
    else time += 5;
  }
  updateStats();
});

settingsButton.addEventListener("click", () => {
  settings.classList.toggle("show");
});

settingsForm.addEventListener("change", (e) => {
  difficulty = e.target.value;
  localStorage.setItem("difficulty", difficulty);
});

// Init
addWordToDom();
text.focus();
const timeInterval = setInterval(updateTime, 1000);

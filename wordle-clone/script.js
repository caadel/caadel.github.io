import dictionary from "./dictionary.js";

const grid = document.querySelector("#grid");
const errOut = document.querySelector("#error-out");
const settingsBtn = document.querySelector("#settings-btn");
const settingsArea = document.querySelector("#settings-area");
const restartBtn = document.querySelector("#restart-btn");
const datasetCheck = document.querySelector("#checkbox-1");
const darkmodeCheck = document.querySelector("#checkbox-2");
const keyboard = document.querySelector("#keyboard");

let wordSize = 5;
let currPos, isAtEndOfRow, hasWon, word, guess, guessesMade;
let useSmallDataset = true;

// init
if (localStorage.getItem("useDarkmode") === "false") {
  darkmodeCheck.checked = false;
  document.documentElement.setAttribute("no-transition", "");
  document.documentElement.setAttribute("lightmode", "");
}
if (localStorage.getItem("useSmallDataset") === "false") {
  datasetCheck.checked = true;
  useSmallDataset = false;
}
newGame();

function newGame() {
  currPos = 0;
  isAtEndOfRow = false;
  hasWon = false;
  guess = "";
  guessesMade = 0;
  errOut.innerText = "";

  word = dictionary.getRandomWord(useSmallDataset);

  console.log(word);

  grid.innerHTML = "";

  for (let i = 0; i < wordSize * 6; i++) {
    grid.appendChild(document.createElement("div"));
  }
}

// Normal keyboard inoput
document.addEventListener("keydown", (e) => {
  handleAction(e.key, false, e.repeat);
});

// Virtual keyboard input
keyboard.addEventListener("click", (e) => {
  if (e.target.tagName !== "SPAN") return;
  handleAction(e.target.innerText, true);
});

function handleAction(key, usedVirtualKeyboard, repeat) {
  if (hasWon) return;

  errOut.innerText = "";

  key = key.toLowerCase();

  if (!usedVirtualKeyboard) {
    if (key === "backspace") removeLetter();

    if (repeat) return;
  } else if (key === "⌫") removeLetter();

  if (key === "enter") guessWord();

  // Only matches english characters
  if (!key.match(/[a-z]/) || key.length > 1) return;

  // Letter input, ignored if row is already full
  if (!isAtEndOfRow) addLetter(key);
}

function addLetter(letter) {
  const cell = grid.childNodes[currPos];
  cell.innerText = letter.toUpperCase();
  cell.classList = "active-cell";
  currPos++;
  guess += letter;
  if (currPos % wordSize === 0 && currPos !== 0) isAtEndOfRow = true;
}

function removeLetter() {
  if (currPos === 0 || (!isAtEndOfRow && currPos - wordSize * guessesMade < 1))
    return;

  currPos--;
  const cell = grid.childNodes[currPos];
  cell.innerText = "";
  cell.classList = "";
  guess = guess.slice(0, -1);
  isAtEndOfRow = false;
}

function guessWord() {
  if (!isAtEndOfRow) {
    errOut.innerText = "Too short!";
    return;
  }

  if (!dictionary.wordSet.has(guess)) {
    errOut.innerText = "Not a word!";
    return;
  }

  updateGuessedRow();

  guessesMade++;

  if (guess === word) {
    errOut.innerText = "YOU WON!";
    hasWon = true;
  } else if (guessesMade === 6) {
    console.log("YOU LOST!");
  }

  isAtEndOfRow = false;
  guess = "";
}

function updateGuessedRow() {
  for (let i = currPos - wordSize; i < currPos; i++) {
    const cell = grid.childNodes[i];
    const wordLetter = word[i - wordSize * guessesMade];
    const guessLetter = guess[i - wordSize * guessesMade];

    // TODO: how should double letters be handled?
    // currently guess "tests" makrs both "s" as yellow for the word "snowy"

    // console.log("word[i]: " + wordLetter + ", guess[i]: " + guessLetter);
    if (wordLetter === guessLetter) cell.classList = "correct-guess";
    else if (word.includes(guessLetter)) cell.classList = "incorrect-pos-guess";
    else cell.classList = "incorrect-guess";
  }
}

// toggle settings dropdown
settingsBtn.addEventListener("click", () => {
  document.documentElement.removeAttribute("no-transition");
  settingsArea.classList.toggle("height-auto");
});

// restart the game
restartBtn.addEventListener("click", () => newGame());

// toggle darkmode
darkmodeCheck.addEventListener("change", () => {
  document.documentElement.toggleAttribute("lightmode");
  darkmodeCheck.checked
    ? localStorage.setItem("useDarkmode", true)
    : localStorage.setItem("useDarkmode", false);
});

// change dataset to select random words from
datasetCheck.addEventListener("change", () => {
  let bool = true;
  if (datasetCheck.checked) bool = false;

  useSmallDataset = bool;
  localStorage.setItem("useSmallDataset", bool);

  newGame();
});

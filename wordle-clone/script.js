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
let currPos, isAtEndOfRow, hasWon, word, guess, numOfGuessesMade;
let useSmallDataset = true;

// INIT START //
if (localStorage.getItem("useDarkmode") === "false") {
  darkmodeCheck.checked = false;
  document.documentElement.setAttribute("no-transition", "");
  document.documentElement.setAttribute("lightmode", "");
}
if (localStorage.getItem("useSmallDataset") === "false") {
  datasetCheck.checked = true;
  useSmallDataset = false;
}

const STATUS = Object.freeze({
  CORRECT: "correct-guess",
  BAD_POS: "incorrect-pos-guess",
  INCORRECT: "incorrect-guess",
});
const letterMap = new Map();
let letters = keyboard.querySelectorAll("span");
for (const key of letters) {
  const it = key.innerText.toLowerCase();
  if (it === "backspace" || it === "⌫") continue;
  letterMap.set(it, key);
}

newGame();
// INIT END //

function newGame() {
  currPos = 0;
  isAtEndOfRow = false;
  hasWon = false;
  guess = "";
  numOfGuessesMade = 0;
  errOut.innerText = "";

  word = dictionary.getRandomWord(useSmallDataset);

  for (const key of letterMap.values()) key.classList = "";

  grid.innerHTML = "";

  for (let i = 0; i < wordSize * 6; i++) {
    grid.appendChild(document.createElement("div"));
  }
}

// Normal keyboard input
document.addEventListener("keydown", (e) => {
  settingsArea.classList.remove("height-auto");

  handleAction(e.key, false, e.repeat);

  // TODO: flash or "bounce scale" the last pressed key?
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

  // Delete action
  if (!usedVirtualKeyboard) {
    if (key === "backspace") removeLetterFromBoard();
    if (repeat) return;
  } else if (key === "⌫") removeLetterFromBoard();

  if (key === "enter") guessWord();

  // Only matches english characters
  if (!key.match(/[a-z]/) || key.length > 1) return;

  // Letter input, ignored if row is already full
  if (!isAtEndOfRow) addLetterToBoard(key);
}

function addLetterToBoard(letter) {
  const cell = grid.childNodes[currPos];
  cell.innerText = letter.toUpperCase();
  cell.classList = "active-cell";
  currPos++;
  guess += letter;
  if (currPos % wordSize === 0 && currPos !== 0) isAtEndOfRow = true;
}

function removeLetterFromBoard() {
  if (
    currPos === 0 ||
    (!isAtEndOfRow && currPos - wordSize * numOfGuessesMade < 1)
  )
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

  numOfGuessesMade++;

  if (guess === word) {
    errOut.innerText = "YOU WON!";
    hasWon = true;
  } else if (numOfGuessesMade === 6) {
    errOut.innerText = "YOU LOST!";
  }

  isAtEndOfRow = false;
  guess = "";
}

function updateGuessedRow() {
  for (let i = currPos - wordSize; i < currPos; i++) {
    const cell = grid.childNodes[i];
    const wordLetter = word[i - wordSize * numOfGuessesMade];
    const guessLetter = guess[i - wordSize * numOfGuessesMade];

    // TODO: how should double letters be handled?
    // currently guess "tests" makrs both "s" as yellow for the word "snowy"

    // console.log("word[i]: " + wordLetter + ", guess[i]: " + guessLetter);
    let newStatus;
    if (wordLetter === guessLetter) {
      newStatus = STATUS.CORRECT;
    } else if (word.includes(guessLetter)) {
      newStatus = STATUS.BAD_POS;
    } else {
      newStatus = STATUS.INCORRECT;
    }

    cell.classList = newStatus;
    updateKeyboardKey(guessLetter, newStatus);
  }
}

function updateKeyboardKey(letter, newStatus) {
  const key = letterMap.get(letter);
  const letterStatus = key.classList.toString();

  // Only ever "upgrade" key colors in the keyboard
  switch (letterStatus) {
    case "":
    case STATUS.INCORRECT:
      key.classList = newStatus;
      break;
    case STATUS.BAD_POS:
      if (newStatus === STATUS.CORRECT) key.classList = STATUS.CORRECT;
      break;
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

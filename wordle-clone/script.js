import dictionary from "./dictionary.js";

const guessGrid = document.querySelector("#grid");
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

const STATE = Object.freeze({
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

  guessGrid.innerHTML = "";

  for (let i = 0; i < wordSize * 6; i++) {
    guessGrid.appendChild(document.createElement("div"));
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
  const cell = guessGrid.childNodes[currPos];
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
  const cell = guessGrid.childNodes[currPos];
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

/**
 * Goes over the guess row and updates the UI with correct colors.
 * Overly long and complicated because of duplicate letter handling.
 */
function updateGuessedRow() {
  let duplicatesInGuess = new Set();
  let uniqueLettersInWord = new Map();
  let uniqueLettersInGuess = new Set();
  let guessLetterStates = [];

  // 1: check if the chosen word contains any duplicates
  for (let i = 0; i < 5; i++) {
    const letter = word[i];
    // record duplicate letters in the word
    if (uniqueLettersInWord.has(letter)) {
      uniqueLettersInWord.set(letter, uniqueLettersInWord.get(letter) + 1);
    } else uniqueLettersInWord.set(letter, 1);
  }

  // 2: record the preliminary state of each letter in the guess
  for (let i = currPos - wordSize; i < currPos; i++) {
    const wordLetter = word[i - wordSize * numOfGuessesMade];
    const guessLetter = guess[i - wordSize * numOfGuessesMade];

    // determine letter guess correctness state
    if (wordLetter === guessLetter) guessLetterStates.push(STATE.CORRECT);
    else if (word.includes(guessLetter)) guessLetterStates.push(STATE.BAD_POS);
    else guessLetterStates.push(STATE.INCORRECT);

    // check for duplicate letters in the guess
    if (uniqueLettersInGuess.has(guessLetter)) {
      duplicatesInGuess.add(guessLetter);
    } else uniqueLettersInGuess.add(guessLetter);
  }

  // 3: fix any incorrect states caused by duplicate letters in the guess
  for (const letter of duplicatesInGuess.values()) {
    let duplicateIndices = [];
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === letter) duplicateIndices.push(i);
    }

    let numOfFixesNeeded =
      duplicateIndices.length -
      (uniqueLettersInWord.get(letter) || duplicateIndices.length);

    // Only need to correct if there fewer dupes in the word than in the guess
    if (numOfFixesNeeded > 0) {
      // Apply fixes from back to front
      for (let i = duplicateIndices.length - 1; i >= 0; i--) {
        const index = duplicateIndices[i];

        if (guessLetterStates[index] === STATE.CORRECT) continue;

        guessLetterStates[index] = STATE.INCORRECT;
        numOfFixesNeeded--;

        if (numOfFixesNeeded === 0) break;
      }
    }
  }

  // 4: update the UI with the final states
  for (let i = 0; i < guessLetterStates.length; i++) {
    const newState = guessLetterStates[i];
    guessGrid.childNodes[i + wordSize * numOfGuessesMade].classList = newState;
    updateKeyboardKey(guess[i], newState);
  }
}

/**
 * Updates the color of a key on the virtual keyboard.
 * Only allows the "correctness state" of a key to be improved.
 * (e.g. from "wrong position" to "correct")
 *
 * @param {String} letter - The key to update.
 * @param {String} newStatus - The new status to give the key.
 */
function updateKeyboardKey(letter, newStatus) {
  const key = letterMap.get(letter);
  const letterStatus = key.classList.toString();

  // Only ever "upgrade" key colors in the keyboard
  switch (letterStatus) {
    case "":
    case STATE.INCORRECT:
      key.classList = newStatus;
      break;
    case STATE.BAD_POS:
      if (newStatus === STATE.CORRECT) key.classList = STATE.CORRECT;
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

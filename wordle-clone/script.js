import dictionary from "./dictionary.js";

const grid = document.querySelector("#grid");
const errOut = document.querySelector("#error-out");

let wordSize = 5;
let currPos, isAtEndOfRow, hasWon, word, guess, guessesMade;
let useSmallDataset = true;

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
newGame();

document.addEventListener("keydown", (e) => {
  if (hasWon) return;

  errOut.innerText = "";

  const key = e.key.toLowerCase();

  if (key === "backspace") removeLetter();

  if (e.repeat) return;

  if (key === "enter") guessWord();

  // Only matches english characters
  if (!key.match(/[a-z]/) || key.length > 1) return;

  // Letter input, ignored if row is already full
  if (!isAtEndOfRow) addLetter(key);
});

function addLetter(letter) {
  grid.childNodes[currPos].innerText = letter.toUpperCase();
  currPos++;
  guess += letter;
  if (currPos % wordSize === 0 && currPos !== 0) isAtEndOfRow = true;
}

function removeLetter() {
  if (currPos === 0 || (!isAtEndOfRow && currPos - wordSize * guessesMade < 1))
    return;

  currPos--;
  grid.childNodes[currPos].innerText = "";
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
    console.log("W");
    hasWon = true;
  } else if (guessesMade === 6) {
    console.log("L");
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

    console.log("word[i]: " + wordLetter + ", guess[i]: " + guessLetter);
    if (wordLetter === guessLetter) cell.classList = "green";
    else if (word.includes(guessLetter)) cell.classList = "yellow";
    else cell.classList = "grey";
  }
}

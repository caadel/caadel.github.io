/**
 * The Hangman game uses the example code for the SVG manipulation,
 * but it has been remade from using JS modules to JS Objects.
 */

/**
 * Constructs a Hangman object.
 *
 * @param {number} id - The id of the window.
 * @returns {void}
 */
function Hangman (id) {
  this.id = id
  // Get all elements as their id
  this.partAsElement = {}

  // Create an array with all valid parts
  this.validParts = [
    'hill',
    'gallow',
    'body',
    'rightarm',
    'leftarm',
    'rightleg',
    'leftleg',
    'rope',
    'head'
  ]
}

Hangman.prototype = {
  getElements: function () {
    this.partAsElement = {
      hill: document.getElementById(`hang_hill_${this.id}`),
      gallow: document.getElementById(`hang_construction_${this.id}`),
      body: document.getElementById(`hang_body_${this.id}`),
      rightarm: document.getElementById(`hang_rightarm_${this.id}`),
      leftarm: document.getElementById(`hang_leftarm_${this.id}`),
      rightleg: document.getElementById(`hang_rightleg_${this.id}`),
      leftleg: document.getElementById(`hang_leftleg_${this.id}`),
      rope: document.getElementById(`hang_rope_${this.id}`),
      head: document.getElementById(`hang_head_${this.id}`)
    }
  },
  /**
   * Check if part a valid part, writes error message to console if the part is invalid.
   *
   * @param {string} part Name of the part to check.
   * @returns {boolean} true if valid part, else false.
   */
  isValid: function (part) {
    if (!this.validParts.includes(part)) {
      return false
    }
    return true
  },

  /**
   * Hide a part.
   *
   * @param {string} part Name of the part to hide.
   * @returns {void}
   */
  hide: function (part) {
    if (this.isValid(part)) {
      this.partAsElement[part].style.display = 'none'
    }
  },

  /**
   * Hide all parts.
   *
   * @returns {void}
   */
  hideAll: function () {
    for (let i = 0; i < this.validParts.length; i++) {
      this.hide(this.validParts[i])
    }
  },

  /**
   * Show a part.
   *
   * @param {string} part Name of the part to show.
   * @returns {void}
   */
  show: function (part) {
    if (this.isValid(part)) {
      this.partAsElement[part].style.display = 'inline'
    }
  }
}
/**
 * Constructs a Game object.
 *
 * @param {number} id - The id of the window.
 * @returns {void} .
 */
function Game (id) {
  this.id = id
  this.hangman = new Hangman(id)
  this.io = new IO(id)

  this.dictionary = [
    'anaconda',
    'apple',
    'bicycle',
    'book',
    'car',
    'character',
    'corporation',
    'cucumber',
    'demonstration',
    'donkey',
    'explanation',
    'five',
    'garbage',
    'hammer',
    'internet',
    'jaguar',
    'kick',
    'lemur',
    'mannerism',
    'money',
    'murder',
    'nothing',
    'opera',
    'plantation',
    'quadruped',
    'reality',
    'staircase',
    'steam',
    'surfer',
    'surgeon',
    'teapot',
    'telephone',
    'upgrade',
    'vietnam',
    'waffle',
    'waterfall',
    'xylophone',
    'yellow',
    'zimbabwe'
  ]
  this.selectedWord = ''
  this.guesses = ''
  this.incorrectChars = ''
  this.incorrectWords = []
  this.totalIncorrect = 0
}

Game.prototype = {
  /**
   * Initializes the game.
   *
   * @returns {void}.
   */
  start: function () {
    this.hangman.getElements()
    this.io.getElements()

    // Reset everything
    this.guesses = ''
    this.incorrectChars = ''
    this.incorrectWords = []
    this.totalIncorrect = 0
    this.hangman.hideAll()

    // Select a new word and create the starting string
    this.selectedWord = this.dictionary[
      Math.floor(Math.random() * Math.floor(this.dictionary.length))
    ]
    this.updateFullWord(false)

    // Update the page
    this.io.updateOutput(this.guesses, '-', '-', false, false, this.selectedWord)
  },

  /**
   * Shows a hangman part.
   *
   * @param {number} i - the index of the part to be shown.
   * @returns {void}.
   */
  showHangmanPart: function (i) {
    this.hangman.show(this.hangman.validParts[i])
  },

  /**
   * Determines if the game has ended or should continue.
   *
   * @param {string} fullword - The string of the guess input, if the guess was a full word guess.
   * @returns {boolean} - first bool: game has ended, second bool: game was won or not.
   */
  checkGameState: function (fullword) {
    // A correct full word guess will instantly make you win
    if (fullword === this.selectedWord) {
      this.updateFullWord(true)
      return { ended: true, won: true }
    }
    // Maximum incorrect guesses reached; game over
    if (this.totalIncorrect === 9) {
      return { ended: true, won: false }
    } else {
      // Check if all characters have been correctly guessed
      let correct = true
      for (let i = 0; i < this.selectedWord.length; i++) {
        if (this.guesses[i * 2] !== this.selectedWord[i]) correct = false
      }
      return { ended: correct, won: correct }
    }
  },

  /**
   * Determines the outcome of the guess input.
   *
   * @param {string} guess - The string of the guess input.
   * @returns {void}.
   */
  handleGuess: function (guess) {
    // Check for duplicate guess, do nothing in that case
    if (
      this.incorrectWords.includes(guess) ||
      this.incorrectChars.includes(guess) ||
      this.guesses.includes(guess)
    ) {
    } else if (guess.length > 1) {
      // Word guess
      if (guess !== this.selectedWord) {
        this.showHangmanPart(this.totalIncorrect)
        this.incorrectWords[this.incorrectWords.length] = guess
        this.totalIncorrect++
      }
    } else {
      // Character guess
      if (this.selectedWord.includes(guess)) {
        // Replace "_" with the correctly guessed character
        for (let i = 0; i < this.selectedWord.length; i++) {
          if (guess.valueOf() === this.selectedWord[i].valueOf()) {
            const i2 = i * 2
            this.guesses = this.guesses.substring(0, i2) + guess + this.guesses.substring(i2 + 1)
          }
        }
      } else {
        this.showHangmanPart(this.totalIncorrect)
        this.incorrectChars += guess
        this.totalIncorrect++
      }
    }
  },

  /**
   * Updates the full word string, either at game start or when the word is guessed.
   *
   * @param {boolean} gameWon - True if the game was won, false if not.
   * @returns {void}.
   */
  updateFullWord: function (gameWon) {
    if (gameWon) {
      // If the game was won, display the entire word in the guesses section
      this.guesses = ''
      for (let i = 0; i < this.selectedWord.length; i++) {
        this.guesses += this.selectedWord[i] + ' '
      }
    } else {
      // Initial string creation
      for (let i = 0; i < this.selectedWord.length; i++) {
        this.guesses += '_ '
      }
    }
  },

  /**
   * Reads IO input, make a guess based on which type of input, and update the page.
   *
   * @returns {void}.
   */
  guess: function () {
    // Read the guess input
    this.io.readNewGuess()

    const short = this.io.charGuess
    const full = this.io.fullGuess

    // Handle the guess
    full.length > 1 ? this.handleGuess(full) : this.handleGuess(short)

    // Check the game state
    const gameState = this.checkGameState(full)

    // Some formatting of the data
    let chars, words
    if (this.incorrectChars === '') chars = '-'
    else {
      chars = ''
      for (let i = 0; i < this.incorrectChars.length; i++) {
        chars += `${this.incorrectChars.charAt(i)}, `
      }

      chars = chars.substring(0, chars.length - 2)
    }
    if (this.incorrectWords.length === 0) words = '-'
    else {
      words = []
      let i = 0
      this.incorrectWords.forEach((element) => {
        if (i !== this.incorrectWords.length) words[i] = ` ${element}`
        else words[i] = element
        i++
      })
    }

    // Update the page
    this.io.updateOutput(
      this.guesses,
      chars,
      words,
      gameState.ended,
      gameState.won,
      this.selectedWord
    )
  }
}

/**
 * Constructs a IO object.
 *
 * @param {number} id - The id of the game instance
 * @returns {void}.
 */
function IO (id) {
  this.id = id
  // All elements that this IO object can change
  this.outputElements = {}

  // The element that is read to get the last guess
  this.inputElement = ''

  // The input that was read from the above element, formatted
  this.charGuess = ''
  this.fullGuess = ''
}

// IO Functions
IO.prototype = {
  getElements: function () {
    this.outputElements = {
      correct: document.getElementById(`correctGuesses_${this.id}`),
      incorrect1: document.getElementById(`incorrectGuesses1_${this.id}`),
      incorrect2: document.getElementById(`incorrectGuesses2_${this.id}`),
      end: document.getElementById(`gameEnd_${this.id}`),
      submit: document.getElementById(`submit_${this.id}`),
      overlay: document.getElementById(`overlay_${this.id}`),
      start: document.getElementById(`hangman-start-button_${this.id}`)
    }
    this.inputElement = document.getElementById(`guess_${this.id}`)
  },

  /**
   * Reads input and update the last guess variables.
   *
   * @returns {void}.
   */
  readNewGuess: function () {
    const input = this.inputElement.value.toString().toLowerCase().trim()
    this.fullGuess = input
    this.charGuess = input.substring(0, 1)
  },

  /**
   * Updates the window contents.
   *
   * @param {string} guessProgressString - The string of correctly guessed, and missing, characters.
   * @param {string} incorrectCharGuesses - A string contining all incorrect character guesses.
   * @param {string[]} incorrectWordGuesses - A string contining all incorrect word guesses.
   * @param {boolean} gameHasEnded - Boolean that signifies whether the game has ended or not.
   * @param {boolean} gameWasWon - Boolean that signifies wether an ended game was won or lost.
   * @param {string} word - The word that the game was played with.
   * @returns {void}.
   */
  updateOutput: function (
    guessProgressString,
    incorrectCharGuesses,
    incorrectWordGuesses,
    gameHasEnded,
    gameWasWon,
    word
  ) {
    this.outputElements.correct.innerHTML = guessProgressString
    this.outputElements.incorrect1.innerHTML = incorrectCharGuesses
    this.outputElements.incorrect2.innerHTML = incorrectWordGuesses
    this.inputElement.value = ''
    if (gameHasEnded) {
      this.outputElements.submit.disabled = true
      this.outputElements.overlay.style.display = 'inline'
      this.outputElements.start.style.display = 'inline'

      gameWasWon
        ? (this.outputElements.end.innerHTML = `You Won!<br><br>The word was "${word}"`)
        : (this.outputElements.end.innerHTML = `You Lost!<br><br>The word was "${word}"`)
    } else {
      this.outputElements.submit.disabled = false
      this.outputElements.overlay.style.display = 'none'
      this.outputElements.start.style.display = 'none'
      this.outputElements.end.innerHTML = ''
    }
  }
}

/* eslint-disable no-unused-vars */

const gameInstances = new Map()
/**
 * Creates a new Game instance.
 *
 * @param {number} id - the id suffix of the game's window.
 * @returns {void}.
 */
function newGame (id) {
  gameInstances.set(id, new Game(id))
}

/**
 * Starts a guess event.
 *
 * @param {number} id - the id suffix of the game's window.
 * @returns {void}.
 */
function guess (id) {
  gameInstances.get(id).guess()
}

/**
 * Starts a new game event.
 *
 * @param {number} id - the id of the window the game is in.
 * @returns {void}.
 */
function start (id) {
  gameInstances.get(id).start()
}

export default {
  start,
  guess,
  newGame
}

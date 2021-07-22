import Storage from '../system-modules/storage.js'
import { Deck } from '../shared assets/deck of cards/deck.js'

class App {
  constructor(startscreen, gamescreen, deckArea) {
    this.startscreen = startscreen
    this.gamescreen = gamescreen
    this.deck = new Deck()
    this.shownDeck = deckArea.querySelector('.shown-cards')
    this.hiddenDeck = deckArea.querySelector('.deck')
  }

  /**
   * Receives a keyboard input and passes it to the app.
   *
   * @param {String} key - the input key.
   */
  keyboardInput(key) {}

  start() {
    console.log('New game started')
    this.startscreen.style.display = 'none'
    this.gamescreen.style.display = 'block'

    this.createCard(this.deck.drawAndKeepInTempPile())

    // TODO: Start timer
  }

  createCard(cardToAddToDom) {
    let shown = false

    const cont = document.createElement('div')
    cont.classList = 'card-container'

    const card = document.createElement('div')
    card.classList = 'card card-flipped'
    cont.appendChild(card)

    const img1 = document.createElement('img')
    img1.classList = 'card-face card-face-front'
    // img1.classList = 'card-face card-face-front'
    img1.src = `../${cardToAddToDom.imgSrc}`
    card.appendChild(img1)

    const img2 = document.createElement('img')
    img2.src = '../shared assets/deck of cards/back.jpg'
    img2.classList = 'card-face card-face-back'
    // img2.classList = 'card-face card-face-back'
    card.appendChild(img2)

    this.hiddenDeck.appendChild(cont)

    cont.addEventListener('click', () => {
      card.classList.toggle('in-shown-pile')
      // if (shown) {
      //   // TODO
      // } else {
      //   card.classList.toggle('card-flipped')
      //   shown = true
      // }
    })
  }

  restart() {}

  updateDOM() {
    // TODO
  }
}

const instances = new Map()

/**
 * Creates a new instance of the app.
 *
 * @param {String} windowID - the id of the window the app instance is opened in.
 */
function newInstance(windowID) {
  const window = document.getElementById(windowID).querySelector('.content')

  const startScreen = window.querySelector('.start-screen')
  const gameScreen = window.querySelector('.game-screen')
  const deckArea = window.querySelector('.deck-area')

  const instance = new App(startScreen, gameScreen, deckArea)

  instances.set(windowID, instance)

  const startBtn = window.querySelector('[data-start]')

  startBtn.addEventListener('click', () => {
    instance.start()
  })

  return instance
}

export default {
  newInstance,
}

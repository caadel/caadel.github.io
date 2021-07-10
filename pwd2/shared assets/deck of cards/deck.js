export class Deck {
  constructor() {
    this.cards = [Card]
    this.tempPile = []

    this.newDeck()
  }

  /**
   * Filles the deck with cards and shuffles it.
   */
  newDeck() {
    this.cards = []
    this.tempPile = []

    let spades = ['clubs', 'spades', 'diamonds', 'hearts']

    for (let i = 0; i < 4; i++) {
      let color = 'red'
      if (i < 2) color = 'black'

      for (let value = 1; value < 14; value++) {
        this.cards.push(new Card(spades[i], color, value, true))
      }
    }

    this.shuffle()
  }

  /**
   * Shuffles the deck.
   * Src: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
   */
  shuffle() {
    let currentIndex = this.cards.length
    let temporaryValue, randomIndex

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1

      // And swap it with the current element.
      temporaryValue = this.cards[currentIndex]
      this.cards[currentIndex] = this.cards[randomIndex]
      this.cards[randomIndex] = temporaryValue
    }
  }

  /**
   * Draws a card from the deck.
   *
   * @returns {Card} the drawn card.
   */
  draw() {
    return this.cards.pop()
  }

  /**
   * Draws a card and stores it in a temporary card pile.
   *
   * @returns {Card} the drawn card.
   */
  drawAndKeepInTempPile() {
    const drawnCard = this.cards.pop()
    this.tempPile.push(drawnCard)

    return drawnCard
  }

  /**
   * Removes a card from the temporary card pile.
   *
   * @param {Card} card - the card to remove from the temp pile.
   */
  removeFromTemp(card) {
    this.tempPile.splice(this.tempPile.indexOf(card), 1)
  }

  /**
   * Swaps the current card pile with the temporary card pile. Clears the temporary card pile.
   */
  swapTempPileWithCurrentPile() {
    this.cards = this.tempPile
    this.tempPile = []
  }

  /**
   *
   * @returns {number} the number of cards left in the deck
   */
  size() {
    return this.cards.length
  }
}

export class Card {
  /**
   * Creates a new Card.
   *
   * @param {String} spade - the spade of the card.
   * @param {String} color - the color of the card.
   * @param {Number} value - the value of the card.
   * @param {Boolean} isFlipped - if the card is flipped or not.
   */
  constructor(spade, color, value, isFlipped) {
    this.spade = spade
    this.color = color
    this.value = value
    this.isFlipped = isFlipped
    this.imgSrc = `shared assets/deck of cards/${spade}/${value}.jpg`
  }

  /**
   * Flips the card.
   */
  flip() {
    this.isFlipped = !this.isFlipped
  }
}

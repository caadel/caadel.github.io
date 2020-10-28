/**
 * Memory Game logic
 *
 * This module is VERY large for being what it is. The first reason for this is that
 * JS Objects are used, but the main reason is the keyboard controls for the game.
 *
 * Note that the movement code is the way it is because a hidden (matched) pair of cards are
 * no longer interactable and a keypress should never result in a hidden card being selected.
 * If this was allowed, the code for movement would be drastically simpler.
 *
 */

/**
 * @typedef {object} GridSize
 * @property {number} x - The width of the board.
 * @property {number} y - The height of the board.
 */

/**
 * Constructs a Card object.
 *
 * @param {number} cardNum  - The value of the card
 * @param {number} id - The id of the card (position in array).
 * @param {number} gameId - The id of the game the card belongs to.
 * @param {number} x - The x-position of the card.
 * @param {number} y - The y-posiiont of the card
 * @returns {void}
 */
function Card (cardNum, id, gameId, x, y) {
  this.id = id
  this.gameId = gameId
  this.cardNum = cardNum
  this.isFlipped = false
  this.isHidden = false
  this.x = x
  this.y = y
}

Card.prototype = {
  getElement: function () {
    return document.getElementById(`card_${this.gameId}_${this.id}`)
  },

  /**
   * Flips a card by toggling a css class.
   *
   * @returns {void}.
   */
  flip: function () {
    this.isFlipped = !this.isFlipped
    this.getElement().classList.toggle('memory-card-flipped')
  },

  /**
   * Hides a card on the board.
   *
   * @returns {void}.
   */
  hide: function () {
    this.isHidden = true
    this.getElement().classList.add('memory-card-deactivated')
  },

  /**
   * Highlights a card.
   *
   * @param {boolean} bool - Highlights if true, removes highlight if false.
   * @returns {void}.
   */
  highlight: function (bool) {
    bool
      ? this.getElement().classList.add('memory-card-selected')
      : this.getElement().classList.remove('memory-card-selected')
  }
}

/**
 * Constructs a Game object.
 *
 * @param {number} id - The id of the game.
 * @returns {void} .
 */
function Game (id) {
  this.id = id
  this.cards = null
  this.cardObjects = null
  this.flips = 0
  this.xSize = 4
  this.ySize = 4
  this.numOfCards = 16
  this.cardsLeft = 16
  this.selectedCard = null
  this.flippedCards = null
  this.topMostCards = null
  this.bottomMostCards = null
  this.rightMostCards = null
  this.leftMostCards = null
  this.lastActionWasKeyboard = null
  this.waitingForTurnToComplete = null
  this.edges = { maxX: 4, minX: 1, maxY: 4, minY: 1 }
}

Game.prototype = {
  /**
   * Initializes the game.
   *
   * @param {number} width - The x-size of the board.
   * @param {number} height - The y-size ofthe board.
   * @returns {void} .
   */
  init: function (width, height) {
    this.xSize = width
    this.ySize = height
    this.numOfCards = width * height
    this.cards = []
    this.cardObjects = []
    this.flips = 0
    this.selectedCard = null
    this.cardsLeft = this.numOfCards
    this.flippedCards = []
    this.topMostCards = new Map()
    this.bottomMostCards = new Map()
    this.rightMostCards = new Map()
    this.leftMostCards = new Map()
    this.lastActionWasKeyboard = false
    this.waitingForTurnToComplete = false
  },

  /**
   * Starts the game.
   *
   * @param {number} width - The x-size of the board.
   * @param {number} height - The y-size ofthe board.
   * @returns {boolean} true if new game could be started.
   */
  start: function (width, height) {
    // Don't allow for restarting during the 1-second wait after flipping two cards
    if (this.waitingForTurnToComplete || width < 2 || width > 6 || height < 2 || height > 6) {
      return false
    } else {
      // Reset everything
      this.init(width, height)

      // Create the card array
      this.cards = []
      for (let i = 0, j = 0; i < this.numOfCards; i += 2, j++) {
        this.cards[i] = j
        this.cards[i + 1] = j
      }
      this.shuffle()

      // Keep track of which cards are at the edges
      // add card positions
      for (let i = 0, x = 1, y = 1; i < this.cards.length; i++) {
        const card = new Card(this.cards[i], i, this.id, x, y)
        this.cardObjects.push(card)

        if (i < this.xSize) this.topMostCards.set(i, card)

        if ((i + 1) % this.xSize === 0) this.rightMostCards.set(i, card)

        if (i < this.numOfCards && i > this.numOfCards - this.xSize + -1) {
          this.bottomMostCards.set(i, card)
        }

        if (i % this.xSize === 0) this.leftMostCards.set(i, card)

        x++
        if (x > this.xSize) x = 1

        if (i % this.xSize === this.xSize - 1) y++
      }

      this.edges = { maxX: this.xSize, minX: 1, maxY: this.ySize, minY: 1 }

      return true
    }
  },
  /**
   * Shuffles the array of cards (https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array).
   *
   * @returns {void}.
   */
  shuffle: function () {
    let currentIndex = this.cards.length
    let temporaryValue
    let randomIndex

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
  },

  /**
   * Returns the size of the game board's array.
   *
   * @returns {GridSize} the size of the board.
   */
  getSize: function () {
    return { x: this.xSize, y: this.ySize }
  },

  /**
   * Returns the array of the game board's cards.
   *
   * @returns {void}.
   */
  getCardArray: function () {
    return this.cards
  },

  /**
   * Handles all keyboard input.
   *
   * @param {string} key - the key that was pressed.
   * @returns {void}.
   */
  keyPressed: function (key) {
    this.lastActionWasKeyboard = true

    if (this.selectedCard === null) {
      // No card is highlighted; find and select the first remaining card
      for (let i = 0; i < this.cardObjects.length; i++) {
        const element = this.cardObjects[i]
        if (!element.isHidden) {
          this.selectedCard = this.cardObjects[i]
          this.selectedCard.highlight(true)
          break
        }
      }
    } else {
      // Keep a flipped card highlighted, otherwise remove the highlight of the previous card
      if (!this.flippedCards.includes(this.selectedCard)) this.selectedCard.highlight(false)

      // Determine which action to take, and highlight any card that was moved to.
      switch (key) {
        case 'w':
        case 'ArrowUp':
          this.moveUp()
          this.selectedCard.highlight(true)
          break
        case 's':
        case 'ArrowDown':
          this.moveDown()
          this.selectedCard.highlight(true)
          break
        case 'a':
        case 'ArrowLeft':
          this.moveLeft()
          this.selectedCard.highlight(true)
          break
        case 'd':
        case 'ArrowRight':
          this.moveRight()
          this.selectedCard.highlight(true)
          break
        case 'Enter':
        case ' ':
          this.flipCard()
          break
      }
    }
  },

  /**
   * Moves up from the currently selected card.
   *
   * When moving in any direction, the game tries to make the move feel as
   * logical as possible for the player by moving diagonally when applicable and
   * wrapping around to the other side when applicable. This results in very verbose
   * code that takes as many situations in to consideration as possible.
   *
   * @returns {void}.
   */
  moveUp: function () {
    const startingCard = this.selectedCard
    const wrapPosition = this.numOfCards - this.xSize + (startingCard.id % this.xSize)

    // Check if the current card is alone in its column
    if (this.topMostCards.get(startingCard.id) !== undefined && startingCard.y > this.edges.minY) {
      // Find top items to the left
      let leftItem = this.cardObjects[(startingCard.id % this.xSize) - 1]
      let closestLeft = null
      let itemFound = false

      if (leftItem !== undefined) {
        for (let i = leftItem.id % this.xSize; i >= 0; i--) {
          for (let j = 0; j < startingCard.y; j++) {
            if (!leftItem.isHidden) {
              closestLeft = leftItem
              itemFound = true
              break
            }
            // Move down to next item
            leftItem = this.cardObjects[leftItem.id + this.xSize]
          }
          if (itemFound) break
          // Move left to the next column
          leftItem = this.cardObjects[(leftItem.id % this.xSize) - 1]
        }
      }

      // Find top items to the right
      const rightPos = (startingCard.id % this.xSize) + 1
      let rightItem = this.cardObjects[rightPos]
      let closestRight = null
      itemFound = false
      if (rightPos < this.xSize) {
        for (let i = rightItem.id % this.xSize; i < this.xSize; i++) {
          for (let j = 0; j < startingCard.y; j++) {
            if (!rightItem.isHidden) {
              closestRight = rightItem
              itemFound = true
              break
            }
            // Move down to next item
            rightItem = this.cardObjects[rightItem.id + this.xSize]
          }
          if (itemFound) break
          // Move right to the next column
          rightItem = this.cardObjects[(rightItem.id % this.xSize) + 1]
        }
      }

      // Select the new element based on horizontal distance from starting card
      if (closestLeft !== null) {
        if (closestRight !== null) {
          startingCard.x - closestLeft.x <= rightItem.x - startingCard.x
            ? (this.selectedCard = closestLeft)
            : (this.selectedCard = closestRight)
        } else this.selectedCard = closestLeft
      } else if (closestRight !== null) this.selectedCard = closestRight
    } else {
      // Search in the same column instead
      for (let i = 0; i < this.ySize; i++) {
        this.selectedCard = this.cardObjects[this.selectedCard.id - this.xSize]

        if (this.selectedCard === undefined) this.selectedCard = this.cardObjects[wrapPosition]

        if (!this.selectedCard.isHidden) break
      }
    }
  },

  /**
   * Moves down from the currently selected card.
   *
   * @returns {void}.
   */
  moveDown: function () {
    const startingCard = this.selectedCard
    const wrapPosition = startingCard.id % this.xSize

    // Check if the current card is alone in its column
    if (
      this.bottomMostCards.get(startingCard.id) !== undefined &&
      startingCard.y < this.edges.maxY
    ) {
      // Find bottom items to the left
      const leftPos = this.numOfCards - this.xSize + (startingCard.id % this.xSize) - 1
      let leftItem = this.cardObjects[leftPos]
      let closestLeft = null
      let itemFound = false
      if (leftPos >= this.numOfCards - this.xSize) {
        for (let i = leftItem.id % this.xSize; i >= 0; i--) {
          for (let j = this.ySize; j > startingCard.y; j--) {
            if (!leftItem.isHidden) {
              closestLeft = leftItem
              itemFound = true
              break
            }
            // Move up to next item
            leftItem = this.cardObjects[leftItem.id - this.xSize]
          }
          if (itemFound) break
          // Move left to the next column
          leftItem = this.cardObjects[
            this.numOfCards - this.xSize + (startingCard.id % this.xSize) - 1
          ]
        }
      }

      // Find bottom items to the right
      let rightItem = this.cardObjects[
        this.numOfCards - this.xSize + (startingCard.id % this.xSize) + 1
      ]
      let closestRight = null
      itemFound = false
      if (rightItem !== undefined) {
        for (let i = rightItem.id % this.xSize; i < this.xSize; i++) {
          for (let j = this.ySize; j > startingCard.y; j--) {
            if (!rightItem.isHidden) {
              closestRight = rightItem
              itemFound = true
              break
            }
            // Move up to next item
            rightItem = this.cardObjects[rightItem.id - this.xSize]
          }
          if (itemFound) break
          // Move right to the next column
          rightItem = this.cardObjects[
            this.numOfCards - this.xSize + (rightItem.id % this.xSize) + 1
          ]
        }
      }

      // Select the new element based on horizontal distance from starting card
      if (closestLeft !== null) {
        if (closestRight !== null) {
          startingCard.x - closestLeft.x <= rightItem.x - startingCard.x
            ? (this.selectedCard = closestLeft)
            : (this.selectedCard = closestRight)
        } else this.selectedCard = closestLeft
      } else if (closestRight !== null) this.selectedCard = closestRight
    } else {
      // Search in the same column instead
      for (let i = 0; i < this.ySize; i++) {
        this.selectedCard = this.cardObjects[this.selectedCard.id + this.xSize]

        if (this.selectedCard === undefined) this.selectedCard = this.cardObjects[wrapPosition]

        if (!this.selectedCard.isHidden) break
      }
    }
  },

  /**
   * Moves left from the currently selected card.
   *
   * @returns {void}.
   */
  moveLeft: function () {
    const startingCard = this.selectedCard
    const wrapPosition = startingCard.id + this.xSize - startingCard.x

    // Check if the current card is alone in its row
    if (this.leftMostCards.get(startingCard.id) !== undefined && startingCard.x > this.edges.minX) {
      // Find left-most items below
      let belowItem = this.cardObjects[startingCard.id + this.xSize - startingCard.x + 1]
      let closestBelow = null
      let itemFound = false
      if (belowItem !== undefined) {
        for (let i = belowItem.y; i <= this.ySize; i++) {
          for (let j = 1; j < startingCard.x; j++) {
            if (!belowItem.isHidden) {
              closestBelow = belowItem
              itemFound = true
              break
            }
            // Move right to next item
            belowItem = this.cardObjects[belowItem.id + 1]
          }
          if (itemFound) break
          // Move down to the next row
          belowItem = this.cardObjects[belowItem.id + this.xSize - belowItem.x + 1]
        }
      }

      // Find left-most items above
      let aboveItem = this.cardObjects[startingCard.id - this.xSize - startingCard.x + 1]
      let closestAbove = null
      itemFound = false
      if (aboveItem !== undefined) {
        for (let i = aboveItem.y; i > 0; i--) {
          for (let j = 1; j < startingCard.x; j++) {
            if (!aboveItem.isHidden) {
              closestAbove = aboveItem
              itemFound = true
              break
            }
            // Move right to next item
            aboveItem = this.cardObjects[aboveItem.id + 1]
          }
          if (itemFound) break
          // Move up to the next row
          aboveItem = this.cardObjects[aboveItem.id - this.xSize - aboveItem.x + 1]
        }
      }

      // Select the new element based on vertical distance from starting card
      if (closestBelow !== null) {
        if (closestAbove !== null) {
          closestBelow.y - startingCard.y <= startingCard.y - aboveItem.y
            ? (this.selectedCard = closestBelow)
            : (this.selectedCard = closestAbove)
        } else this.selectedCard = closestBelow
      } else if (closestAbove !== null) this.selectedCard = closestAbove
    } else {
      // Search in the same row instead
      for (let i = 0; i < this.ySize; i++) {
        this.selectedCard = this.cardObjects[this.selectedCard.id - 1]

        if (this.selectedCard === undefined || this.selectedCard.y < startingCard.y) {
          this.selectedCard = this.cardObjects[wrapPosition]
        }

        if (!this.selectedCard.isHidden) break
      }
    }
  },

  /**
   * Moves right from the currently selected card.
   *
   * @returns {void}.
   */
  moveRight: function () {
    const startingCard = this.selectedCard
    const wrapPosition = startingCard.id - startingCard.x + 1

    // Check if the current card is alone in its row
    if (
      this.rightMostCards.get(startingCard.id) !== undefined &&
      startingCard.x < this.edges.maxX
    ) {
      // Find right-most items below
      let belowItem = this.cardObjects[startingCard.id + this.xSize * 2 - startingCard.x]
      let closestBelow = null
      let itemFound = false
      if (belowItem !== undefined) {
        for (let i = belowItem.y; i <= this.ySize; i++) {
          for (let j = belowItem.x; j > startingCard.x; j--) {
            if (!belowItem.isHidden) {
              closestBelow = belowItem
              itemFound = true
              break
            }
            // Move left to next item
            belowItem = this.cardObjects[belowItem.id - 1]
          }
          if (itemFound) break
          // Move down to the next row
          belowItem = this.cardObjects[belowItem.id + this.xSize * 2 - belowItem.x]
        }
      }

      // Find left-most items above
      let aboveItem = this.cardObjects[startingCard.id - startingCard.x]
      let closestAbove = null
      itemFound = false
      if (aboveItem !== undefined) {
        for (let i = aboveItem.y; i > 0; i--) {
          for (let j = aboveItem.x; j > startingCard.x; j--) {
            if (!aboveItem.isHidden) {
              closestAbove = aboveItem
              itemFound = true
              break
            }
            // Move left to next item
            aboveItem = this.cardObjects[aboveItem.id - 1]
          }
          if (itemFound) break
          // Move up to the next row
          aboveItem = this.cardObjects[aboveItem.id - aboveItem.x]
        }
      }

      // Select the new element based on vertical distance from starting card
      if (closestBelow !== null) {
        if (closestAbove !== null) {
          closestBelow.y - startingCard.y <= startingCard.y - aboveItem.y
            ? (this.selectedCard = closestBelow)
            : (this.selectedCard = closestAbove)
        } else this.selectedCard = closestBelow
      } else if (closestAbove !== null) this.selectedCard = closestAbove
    } else {
      // Search in the same row instead
      for (let i = 0; i < this.ySize; i++) {
        this.selectedCard = this.cardObjects[this.selectedCard.id + 1]

        if (this.selectedCard === undefined || this.selectedCard.y > startingCard.y) {
          this.selectedCard = this.cardObjects[wrapPosition]
        }

        if (!this.selectedCard.isHidden) break
      }
    }
  },

  /**
   * Flips a card and determines what the outcome is; the game's actual logic.
   *
   * @param {number} cardId - The id of the card (its pos in the array)
   * @returns {void}.
   */
  flipCard: function (cardId) {
    /**
     * An argument supplied means mouse input, since keyboard input
     * would have already determined which card to select.
     */
    if (arguments.length > 0 && !this.waitingForTurnToComplete) {
      // Switch from keyboard to mouse input => remove the current highlight
      if (this.selectedCard !== null && this.flippedCards.length === 0) {
        this.selectedCard.highlight(false)
      }

      this.selectedCard = this.cardObjects[cardId]
      this.lastActionWasKeyboard = false
    }

    this.selectedCard.highlight(true)

    // Flip a card that is not already flipped, do nothing otherwise
    if (!this.selectedCard.isFlipped) {
      this.selectedCard.flip()
      this.flippedCards.push(this.selectedCard)

      // Two cards have been flipped; it's time to compare them
      if (this.flippedCards.length === 2) {
        // Sets the flag to stop additional input during the 1-second wait
        this.waitingForTurnToComplete = true
        this.flips++

        document.getElementById(`memoryMoves_${this.id}`).innerHTML = `Moves: ${this.flips}`

        const parent = this

        // After 1 second, continue with the game
        setTimeout(function () {
          const flipped1 = parent.flippedCards[0]
          const flipped2 = parent.flippedCards[1]
          parent.flippedCards = []

          flipped1.highlight(false)
          if (!parent.lastActionWasKeyboard) flipped2.highlight(false)

          // A match is found
          if (flipped1.cardNum === flipped2.cardNum) {
            // Hide/remove the pair
            flipped1.hide()
            flipped2.hide()

            parent.cardsLeft -= 2

            // If there are still cards remaining on the board, update the internal board state
            if (parent.cardsLeft > 0) {
              parent.updateEdges(flipped1)
              parent.updateEdges(flipped2)

              // Select and highlight a new card if keyboard is being used
              if (parent.lastActionWasKeyboard) parent.highlightNewCard(flipped2)
              else parent.selectedCard = null
            } else {
              // All cards have been matched; game ended
              parent.gameEnd()
            }
          } else {
            // Cards do not match, flip them back around.
            flipped1.flip()
            flipped2.flip()
          }
          parent.waitingForTurnToComplete = false
        }, 1000)
      }
    }
  },

  /**
   * Selects a new card to highlight after a successful pair match.
   *
   * @param {object} card - The Card that was deleted/hidden.
   * @param {number} card.id - The id of the Card.
   * @returns {void}.
   */
  updateEdges: function (card) {
    /**
     * If the left-most card in a row is deleted, find the new
     * left-most card in that same row.
     */
    if (this.leftMostCards.delete(card.id)) {
      const oppositeE = this.rightMostCards.get(card.id)

      // Check if the card is alone in its row
      if (oppositeE === undefined) {
        // Search for match in the same row
        for (let i = card.id + 1; i <= card.id + this.xSize - 1 - (card.id % this.xSize); i++) {
          if (!this.cardObjects[i].isHidden) {
            this.leftMostCards.set(i, this.cardObjects[i])
            break
          }
        }

        // Update new edges.minX
        let minX = this.edges.maxX
        for (const iterator of this.leftMostCards.values()) {
          if (iterator.x < minX) minX = iterator.x
        }
        this.edges.minX = minX
      }
    }

    /**
     * If the right-most card in a row is deleted, find the new
     * right-most card in that same row.
     */
    if (this.rightMostCards.delete(card.id)) {
      const oppositeE = this.leftMostCards.get(card.id)

      // Check if the card is alone in its row
      if (oppositeE === undefined) {
        // Search for match in the same row
        for (let i = card.id - 1; i >= card.id - (card.id % this.xSize); i--) {
          if (!this.cardObjects[i].isHidden) {
            this.rightMostCards.set(i, this.cardObjects[i])
            break
          }
        }
      }

      // Update new edges.maxX
      let maxX = this.edges.minX
      for (const iterator of this.rightMostCards.values()) {
        if (iterator.x > maxX) maxX = iterator.x
      }
      this.edges.maxX = maxX
    }

    /**
     * If the top-most card in a row is deleted, find the new
     * top-most card in that same row.
     */
    if (this.topMostCards.delete(card.id)) {
      const oppositeE = this.bottomMostCards.get(card.id)

      // Check if the card is alone in its column
      if (oppositeE === undefined) {
        // Search for match in the same column
        for (let i = card.id + this.xSize; i < this.numOfCards; i += this.xSize) {
          if (!this.cardObjects[i].isHidden) {
            this.topMostCards.set(i, this.cardObjects[i])
            break
          }
        }
      }

      // Update new edges.minY
      let minY = this.edges.maxY
      for (const iterator of this.topMostCards.values()) {
        if (iterator.y < minY) minY = iterator.y
      }
      this.edges.minY = minY
    }

    /**
     * If the bottom-most card in a column is deleted, find the new
     * bottom-most card in that same column.
     */
    if (this.bottomMostCards.delete(card.id)) {
      const oppositeE = this.topMostCards.get(card.id)

      // Check if the card is alone in its column
      if (oppositeE === undefined) {
        // Search for match in the same column
        for (let i = card.id - this.xSize; i >= 0; i -= this.xSize) {
          if (!this.cardObjects[i].isHidden) {
            this.bottomMostCards.set(i, this.cardObjects[i])
            break
          }
        }
      }

      // Update new edges.maxY
      let maxY = this.edges.minY
      for (const iterator of this.bottomMostCards.values()) {
        if (iterator.y > maxY) maxY = iterator.y
      }

      this.edges.maxY = maxY
    }
  },

  /**
   * Selects a new card to highlight after a successful pair match.
   *
   * @param {object} card - The Card to start the search from.
   * @param {number} card.id - The id of the Card.
   * @param {number} card.x - The x position of the Card.
   * @param {number} card.y - The y position of the Card.
   * @returns {void}.
   */
  highlightNewCard: function (card) {
    // Find new card to have highlighted
    let closestRight = null
    let closestLeft = null

    /**
     * Search for a non-hidden card to the left and right of the card, then
     * determine which is the closest of the two.
     *
     * Currently only picking between two points, could be expanded to always
     * pick the closes point out of all surrounding cards.
     */
    for (let i = card.id + 1; i < this.cardObjects.length; i++) {
      if (!this.cardObjects[i].isHidden) {
        closestRight = this.cardObjects[i]
        break
      }
    }

    for (let i = card.id - 1; i > 0; i--) {
      if (!this.cardObjects[i].isHidden) {
        closestLeft = this.cardObjects[i]
        break
      }
    }

    // Closest card was only found in one direction
    if (closestRight === null) this.selectedCard = closestLeft
    else if (closestLeft === null) this.selectedCard = closestRight
    else {
      // Find the closes of the two points
      const distanceRightEl = Math.sqrt(
        Math.pow(closestRight.x - card.x, 2) + Math.pow(card.y - closestRight.y, 2)
      )
      const distanceLeftEl = Math.sqrt(
        Math.pow(closestLeft.x - card.x, 2) + Math.pow(card.y - closestLeft.y, 2)
      )

      distanceLeftEl <= distanceRightEl
        ? (this.selectedCard = closestLeft)
        : (this.selectedCard = closestRight)
    }

    this.selectedCard.highlight(true)
  },

  /**
   * Displays the game ended message, along with the number of actions taken.
   *
   * @returns {void}.
   */
  gameEnd: function () {
    const endText = document.getElementById(`memoryEnd_${this.id}`)
    endText.style.display = 'block'
    endText.innerHTML = `You won!<br>Moves: ${this.flips}`
  }
}

/* eslint-disable no-unused-vars */

const games = new Map()
/**
 * Creates a new Game instance.
 *
 * @param {number} id - The id suffix of the game's window
 * @returns {void}.
 */
function newGame (id) {
  games.set(id, new Game(id))
}

/**
 * Starts a new game event.
 *
 * @param {number} id - The id of the window the game is in.
 * @param {number} xSize - The width of the game board.
 * @param {number} ySize - The height of the game board.
 * @returns {boolean} true if game could be started.
 */
function start (id, xSize, ySize) {
  return games.get(id).start(xSize, ySize)
}

/**
 * Returns the grid size of a game.
 *
 * @param {number} id - The id of the game.
 * @returns {GridSize} the size of the game board.
 */
function getGridSize (id) {
  return games.get(id).getSize()
}

/**
 * Returns the array of cards of a game.
 *
 * @param {number} id - The id of the game.
 * @returns {Array} the array of cards.
 */
function getCardArray (id) {
  return games.get(id).getCardArray()
}

/**
 * Receives a keypress.
 *
 * @param {number} id - The id of the game to receive the input.
 * @param {string} key - The string representation of the key that was pressed.
 * @returns {void}.
 */
function keyPress (id, key) {
  games.get(id.substring(id.length - 1, id.length)).keyPressed(key)
}

/**
 * Flips a card on the game board of a game.
 *
 * @param {number} id - The id of the game.
 * @param {number} cardId - The id of the card to flip.
 * @returns {void}.
 */
function clickCard (id, cardId) {
  games.get(id).flipCard(cardId)
}

export default {
  start,
  newGame,
  getGridSize,
  getCardArray,
  keyPress,
  clickCard
}

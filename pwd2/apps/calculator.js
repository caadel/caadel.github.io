class App {
  constructor(window, prevTxt, currTxt) {
    this.window = window
    this.prevTxt = prevTxt
    this.currTxt = currTxt

    this.clearAll()
  }

  /**
   * Clears the class' variables.
   */
  clear() {
    this.currentOperand = '0'
    this.previousOperand = ''
    this.operation = null
    this.computation = null
    this.lastActionWasEquals = false
    this.resultString = ''
  }

  /**
   * Clears the data displayed in the calculator.
   * Updates the DOM.
   */
  clearAll() {
    this.clear()

    this.updateDOM()
  }

  /**
   * Clears the current operand (bottom row) only.
   * Updates the DOM.
   */
  clearCurrent() {
    this.currentOperand = '0'

    this.updateDOM()
  }

  /**
   * Deletes the last digit of the current operand (bottom row).
   * Updates the DOM.
   *
   * @returns void
   */
  delete() {
    // Treat result as read-only
    if (this.lastActionWasEquals) return

    // Only allow delete action if the number is non-zero
    if (parseFloat(this.currentOperand) === 0) return

    this.currentOperand = this.currentOperand.toString().slice(0, -1)

    this.updateDOM()
  }

  /**
   * Appends an input number to the current operand (bottom row).
   * Updates the DOM.
   *
   * @param {Number} number - the digit to add.
   * @returns void
   */
  appendNumToString(number) {
    // Prevent multiple dots in the number
    if (number === '.' && this.currentOperand.includes('.')) return

    // Replace the lonesome "0" if present
    if (this.currentOperand === '0') this.currentOperand = ''

    // Determine if the current number should be replaced or not
    if (this.lastActionWasEquals) {
      this.currentOperand = number.toString()
      this.lastActionWasEquals = false
    } else {
      this.currentOperand = this.currentOperand.toString() + number.toString()
    }

    this.updateDOM()
  }

  /**
   * Sets the operation to apply to the next calculation.
   * Updates the DOM.
   *
   * @param {String} operation - the operation to apply/set.
   * @returns void
   */
  setOperation(operation) {
    if (this.currentOperand === '0' || this.currentOperand === '') return

    if (this.previousOperand !== '') this.calculate(false)

    this.operation = operation
    this.previousOperand = this.currentOperand
    this.currentOperand = '0'

    this.updateDOM()
  }

  /**
   * Performs a calculation.
   * Updates the DOM.
   *
   * @param {Boolean} equalsBtnClicked - true if the last button pressed was "=".
   * @returns void
   */
  calculate(equalsBtnClicked) {
    const prev = parseFloat(this.previousOperand)
    const curr = parseFloat(this.currentOperand)

    const notNumber = isNaN(prev) || isNaN(curr)

    // If equals was clicked, display the calculation
    if (equalsBtnClicked) {
      this.lastActionWasEquals = true

      if (notNumber) this.resultString = `${this.currentOperand} = `
      else
        this.resultString = `${parseFloat(this.previousOperand)} ${
          this.operation
        } ${parseFloat(this.currentOperand)} =`
    }

    this.computation = null

    if (notNumber) {
      this.updateDOM()
      return
    }

    // Perform operations
    switch (this.operation) {
      case '+':
        this.computation = prev + curr
        break
      case '-':
        this.computation = prev - curr
        break
      case 'x':
        this.computation = prev * curr
        break
      case '÷':
        if (curr === 0) this.computation = 'divide by 0'
        else this.computation = prev / curr
        break
      default:
        return
    }

    this.currentOperand = this.computation
    this.operation = null
    this.previousOperand = ''

    this.updateDOM()
  }

  /**
   * Formats a number to have comma separation.
   *
   * @param {Number} number - the number to format.
   * @returns the formatted string to display
   */
  formatNumber(number) {
    const stringNum = number.toString()
    const intDigits = parseFloat(stringNum.split('.')[0])
    const decimalDigits = stringNum.split('.')[1]

    let integerDOMDisplay

    if (isNaN(intDigits)) {
      integerDOMDisplay = 'error'
    } else {
      integerDOMDisplay = intDigits.toLocaleString('en', {
        maximumFractionDigits: 0,
      })
    }

    if (decimalDigits != null) return `${integerDOMDisplay}.${decimalDigits}`
    else return integerDOMDisplay
  }

  /**
   * Updates the DOM.
   */
  updateDOM() {
    this.currTxt.innerText = this.formatNumber(this.currentOperand)

    if (this.operation != null) {
      // There is an active operation
      this.prevTxt.innerText = `${this.formatNumber(this.previousOperand)} ${
        this.operation
      }`
    } else {
      // No active operation
      if (this.lastActionWasEquals) {
        // Display results

        this.prevTxt.innerText = this.resultString
      } else {
        // Clear prev
        this.prevTxt.innerText = ''
      }
    }
  }

  /**
   * Receives a keyboard input and passes it to the app.
   *
   * @param {String} key - the input key.
   */
  keyboardInput(key) {
    if (!isNaN(parseInt(key))) {
      this.appendNumToString(key)
      return
    }

    switch (key.toLowerCase()) {
      case '%':
        this.setOperation('÷')
      case '-':
      case '+':
      case 'x':
        this.setOperation(key)
        break
      case 'backspace':
        this.delete()
        break
      case 'escape':
        this.clearCurrent()
        break
      case 'c':
        this.clearAll()
        break
      case '.':
        this.appendNumToString(key)
        break
      case 'enter':
      case '=':
        this.calculate(true)
        break
      default:
        break
    }
  }
}

const instances = new Map()

/**
 * Creates a new instance of the app.
 *
 * @param {String} windowID - the id of the window the app instance is opened in.
 */
function newInstance(windowID) {
  // Calculator buttons
  const window = document.getElementById(windowID).querySelector('.content')
  const numberBtns = window.querySelectorAll('[data-number]')
  const opBtns = window.querySelectorAll('[data-op]')
  const clearCurrBtn = window.querySelector('[data-clear-current]')
  const clearAllBtn = window.querySelector('[data-clear-full]')
  const deleteBtn = window.querySelector('[data-clear-one]')
  const equalsBtn = window.querySelector('[data-equals]')
  const prevOperandTxt = window.querySelector('[data-previous]')
  const currOperandTxt = window.querySelector('[data-current]')

  const calc = new App(window, prevOperandTxt, currOperandTxt)

  instances.set(windowID, calc)

  // Adding functionality to all the buttons...
  numberBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      calc.appendNumToString(btn.innerText)
    })
  })

  opBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      calc.setOperation(btn.innerText)
    })
  })

  equalsBtn.addEventListener('click', () => {
    calc.calculate(true)
  })

  clearAllBtn.addEventListener('click', () => {
    calc.clearAll()
  })

  clearCurrBtn.addEventListener('click', () => {
    calc.clearCurrent()
  })

  deleteBtn.addEventListener('click', () => {
    calc.delete()
  })

  return calc
}

export default {
  newInstance,
}

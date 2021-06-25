class App {
  constructor(window, prevTxt, currTxt) {
    this.window = window
    this.prevTxt = prevTxt
    this.currTxt = currTxt

    this.clearAll()
  }

  clear() {
    this.currentOperand = '0'
    this.previousOperand = ''
    this.operation = null
    this.computation = null
    this.lastActionWasEquals = false
    this.resultString = ''
  }

  clearPrev() {
    this.previousOperand = ''

    this.updateDOM()
  }

  clearAll() {
    this.clear()

    this.updateDOM()
  }

  clearCurrent() {
    this.currentOperand = '0'

    this.updateDOM()
  }

  delete() {
    // Treat result as read-only
    if (this.lastActionWasEquals) return

    // Only allow delete action if the number is non-zero
    if (parseFloat(this.currentOperand) === 0) return

    this.currentOperand = this.currentOperand.toString().slice(0, -1)

    this.updateDOM()
  }

  appendNumToString(number) {
    // Prevent multiple dots in the number
    if (number === '.' && this.currentOperand.includes('.')) return

    if (this.lastActionWasEquals) {
      this.currentOperand = number.toString()
      this.lastActionWasEquals = false
    } else
      this.currentOperand = this.currentOperand.toString() + number.toString()

    this.updateDOM()
  }

  chooseOperation(operation) {
    if (this.currentOperand === '0' || this.currentOperand === '') return

    if (this.previousOperand !== '') this.calculate(false)

    this.operation = operation
    this.previousOperand = this.currentOperand
    this.currentOperand = '0'

    this.updateDOM()
  }

  calculate(equalsBtnClicked) {
    // If equals was clicked, display the entire calculation
    if (equalsBtnClicked) {
      this.lastActionWasEquals = true
      if (this.lastActionWasEquals) {
        this.resultString = parseFloat(this.currentOperand)

        /**
         * TODO: fix the following:
         * 1. click number
         * 2. click operand
         * 3. click number
         * 4. click equals
         * prev only displays the result string, "this.currentOperand"
         */
      } else {
        this.resultString = `${parseFloat(this.previousOperand)} ${
          this.operation
        } ${parseFloat(this.currentOperand)} =`
      }
    }

    this.computation = null

    const prev = parseFloat(this.previousOperand)
    const curr = parseFloat(this.currentOperand)

    if (isNaN(prev) || isNaN(curr)) {
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

    this.computation = this.round(this.computation)
    this.currentOperand = this.computation
    this.operation = null
    this.previousOperand = ''

    this.updateDOM()
  }

  formatNumber(number) {
    number = this.round(number)

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

  updateDOM() {
    if (this.currentOperand.toString().slice(-1).includes('.')) {
      // Make the trailing dot visible
      this.currTxt.innerText = `${this.formatNumber(this.currentOperand)}.`
    } else {
      this.currTxt.innerText = this.formatNumber(this.currentOperand)
    }

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

  round(number) {
    return Math.round((parseFloat(number) + Number.EPSILON) * 1000000) / 1000000
  }

  keyboardInput(key) {}
}

const instances = new Map()

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
      calc.chooseOperation(btn.innerText)
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
}

function keyboardInput(windowID, key) {
  instances.get(windowID).keyboardInput(key)
}

export default {
  newInstance,
  keyboardInput,
}

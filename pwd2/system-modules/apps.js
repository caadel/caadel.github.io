import KeyboardModule from './keyboard.js'

import Calculator from '../apps/calculator.js'
// import Calendar from '../apps/calendar.js'
// import DateTime from '../apps/date-time.js'
import Klondike from '../apps/klondike.js'

const appList = {
  calculator: {
    name: 'Calculator',
    icon: "<i class='fas fa-calculator'></i>",
  },
  calendar: {
    name: 'Calendar',
    icon: "<i class='far fa-calendar-alt'></i>",
  },
  'date-time': {
    name: 'Date & Time',
    icon: "<i class='far fa-clock'></i>",
  },
  klondike: {
    name: 'Klondike',
    icon: "<i class='far fa-gamepad'></i>",
  },
}

function createApp(name, windowID) {
  switch (name) {
    case 'calculator':
      const calc = Calculator.newInstance(windowID)
      KeyboardModule.attachOutput(windowID, calc)
      break
    case 'klondike':
      const klon = Klondike.newInstance(windowID)
      break
    default:
      console.log('No app found!')
      break
  }
}

export default {
  createApp,
  appList,
}

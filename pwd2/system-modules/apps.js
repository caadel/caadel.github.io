import KeyboardModule from './keyboard.js'

import Calculator from '../apps/calculator.js'
// import Calendar from '../apps/calendar.js'
// import DateTime from '../apps/date-time.js'
import Klondike from '../apps/klondike.js'
import SettingsApp from '../apps/settings-app.js'

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
  settings: {
    name: 'Settings',
    icon: "<i class='fas fa-cog'></i>",
  },
}

function createApp(name, windowID) {
  switch (name) {
    case 'calculator':
      const calculatorApp = Calculator.newInstance(windowID)
      KeyboardModule.attachOutput(windowID, calculatorApp)
      break
    case 'klondike':
      const klondikeApp = Klondike.newInstance(windowID)
      break
    case 'settings':
      const settingsApp = SettingsApp.newInstance(windowID)
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

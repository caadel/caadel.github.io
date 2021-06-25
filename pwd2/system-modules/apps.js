import Calculator from '../apps/calculator.js'
// import Calendar from '../apps/calendar.js'
// import DateTime from '../apps/date-time.js'

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
}

function createApp(name, windowID) {
  switch (name) {
    case 'calculator':
      Calculator.newInstance(windowID)
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

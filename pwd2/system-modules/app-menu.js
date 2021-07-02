import OpenWindows from './open-windows.js'
import WindowHandler from './windows.js'

const appMenuContainer = document.querySelector('#app-menu')
const searchBox = appMenuContainer.querySelector('#app-menu-search')
const appMenu = appMenuContainer.getElementsByTagName('ul')[0]

let tempAppList = appMenu.childNodes
let selectedApp = null

function init(globalData) {
  appMenuContainer.addEventListener('click', () => {
    searchBox.focus()
  })

  for (const appName in globalData.availableApps) {
    const app = globalData.availableApps[appName]

    const li = document.createElement('li')
    li.innerHTML = `${app.icon} <span>${app.name}</span>`
    li.dataset.appName = appName

    appMenu.appendChild(li)

    li.addEventListener('click', () => {
      WindowHandler.createWindow(appName)
    })
  }

  searchBox.addEventListener('input', () => {
    search()
  })

  initHideCalls()
}

function search() {
  tempAppList = []
  selectedApp = null

  // Hide all apps not matching the text in the input field
  for (const appNode of appMenu.childNodes) {
    // Reset styling if the input field is cleared after having had content
    if (searchBox.value == '') {
      appNode.classList.remove('selected')
      appNode.style.display = 'block'
      continue
    }

    const text = appNode.childNodes[2].innerText
    if (text.toLowerCase().indexOf(searchBox.value.toLowerCase()) > -1) {
      appNode.style.display = 'block'
      tempAppList.push(appNode)
    } else {
      appNode.style.display = 'none'
    }
  }

  // Pre-select the first match to allow opening by pressing "Enter"
  if (tempAppList.length > 0) {
    for (let i = 0; i < tempAppList.length; i++) {
      tempAppList[i].classList.remove('selected')
    }

    tempAppList[0].classList.add('selected')
    selectedApp = tempAppList[0]
  } else {
    tempAppList = appMenu.childNodes
  }
}

function hide() {
  appMenuContainer.classList.add('hidden')
  searchBox.blur()
  tempAppList = appMenu.childNodes
}

function initHideCalls() {
  // Clicking outside the menu hides it
  document.querySelector('#taskbar').addEventListener('click', (e) => {
    if (!e.target.classList.contains('app-menu-btn')) {
      hide()
    } else {
      // The menu button has different behaviour
      appMenuContainer.classList.toggle('hidden')

      if (!appMenuContainer.classList.contains('hidden')) searchBox.focus()

      OpenWindows.clearOpenWindows()
    }
  })

  document.querySelector('#desktop').addEventListener('click', () => {
    hide()
  })
}

function openSelectedApp() {
  if (!selectedApp) return

  WindowHandler.createWindow(selectedApp.dataset.appName)

  searchBox.value = ''
  search()

  hide()
}

function selectAnotherApp(key) {
  if (key === 'ArrowUp' || key === 'ArrowDown') {
    let directionIsUp
    key === 'ArrowUp' ? (directionIsUp = true) : (directionIsUp = false)

    let index = -1
    for (let i = 0; i < tempAppList.length; i++) {
      const element = tempAppList[i]
      if (element.classList.contains('selected')) {
        index = i
        element.classList.remove('selected')
        break
      }
    }

    if (directionIsUp) {
      if (index <= 0) index = tempAppList.length
      index--
    } else {
      if (index === tempAppList.length - 1) index = -1
      index++
    }

    tempAppList[index].classList.add('selected')
    selectedApp = tempAppList[index]
  }
}

export default {
  init,
  hide,
  appMenuContainer,
  openSelectedApp,
  selectAnotherApp,
}

import OpenWindows from './open-windows.js'
import WindowHandler from './windows.js'

let appMenuContainer, searchBox

function init(globalData) {
  appMenuContainer = document.querySelector('#app-menu')

  searchBox = appMenuContainer.querySelector('#app-menu-search')

  const appMenu = appMenuContainer.getElementsByTagName('ul')[0]

  for (const appName in globalData.availableApps) {
    const app = globalData.availableApps[appName]

    const li = document.createElement('li')
    li.innerHTML = `${app.icon} <span>${app.name}</span>`

    appMenu.appendChild(li)

    li.addEventListener('click', () => {
      WindowHandler.createWindow(appName)
    })
  }

  searchBox.addEventListener('input', () => {
    for (const appNode of appMenu.childNodes) {
      const text = appNode.childNodes[2].innerText

      if (text.toUpperCase().indexOf(searchBox.value.toUpperCase()) > -1)
        appNode.style.display = 'block'
      else appNode.style.display = 'none'
    }
  })

  initHideCalls()
}

function hide() {
  appMenuContainer.classList.add('hidden')
  searchBox.blur()
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

export default {
  init,
  hide,
}

// import OpenApps from './modules/open-apps.js'

// Init
let templates, desktop, availableApps, fontSize
async function init() {
  templates = document.createElement('template')
  templates.innerHTML = await (await fetch('templates.html')).text()
  desktop = document.getElementById('desktop')
  availableApps = await (await fetch('apps.json')).json()
  fontSize = parseInt(
    window.getComputedStyle(desktop, null).getPropertyValue('font-size')
  )
}

function createWindow(appName) {
  // Create window
  const windowTemplate = templates.content
    .querySelector('#window-template')
    .content.cloneNode(true)

  // TODO: get id number from openApps later
  const windowElement = windowTemplate.querySelector('.window')
  windowElement.id = `window_${1}`
  // window.style.zIndex = id from openApps

  // Add app content to window, TODO: get id from OpenApps or app icons
  const appHTML = templates.content
    .querySelector(`#${appName}`)
    .content.cloneNode(true)

  windowElement.querySelector('.content').innerHTML = appHTML.textContent

  let pos1,
    pos2,
    pos3,
    pos4 = 0

  // Get the header components
  const windowHeader = windowElement.querySelector('.header')
  const windowIcon = windowHeader.querySelector('.icon')
  const windowTitle = windowHeader.querySelector('.title')
  const windowClose = windowHeader.querySelector('.close')

  // Get app icon html code (font awesome icon)
  windowIcon.innerHTML = availableApps[appName].icon

  windowTitle.innerHTML = `<h4>${availableApps[appName].name}</h4>`

  windowIcon.onmousedown = dragging
  windowTitle.onmousedown = dragging

  // Whenever the window is clicked, move it to the top
  windowElement.addEventListener('click', () => {
    // OpenApps.setActiveWindow(selectedApp.name, elmnt)
  })

  function dragging(dragEvent) {
    // Move window to top
    // OpenApps.setActiveWindow(selectedApp.name, elmnt)

    // Define the event
    dragEvent = dragEvent || windowElement.event
    dragEvent.preventDefault()

    // Get the mouse cursor position at startup:
    pos3 = dragEvent.clientX
    pos4 = dragEvent.clientY

    // Stop moving when mouse button is released:
    document.onmouseup = () => {
      document.onmouseup = null
      document.onmousemove = null

      windowIcon.style.cursor = 'grab'
      windowTitle.style.cursor = 'grab'

      // Check if window header is under taskbar, move up if true
      const halfHeight = windowElement.scrollHeight / 2
      const distanceToTop = windowElement.offsetTop - halfHeight

      if (distanceToTop < 0) {
        windowElement.style.top = `${
          parseInt(windowElement.style.top) - distanceToTop
        }px`
      }

      const taskbarHeaderHeight = fontSize * 5
      const browserHeight = window.innerHeight

      const distanceToTaskbar =
        browserHeight - distanceToTop - taskbarHeaderHeight

      if (distanceToTaskbar < 0) {
        const heightToMoveUpTo =
          browserHeight + halfHeight - taskbarHeaderHeight
        windowElement.style.top = `${heightToMoveUpTo}px`
      }
    }

    // call a function whenever the cursor moves:
    document.onmousemove = (moveEvent) => {
      windowIcon.style.cursor = 'grabbing'
      windowTitle.style.cursor = 'grabbing'
      moveEvent = moveEvent || windowElement.event
      moveEvent.preventDefault()
      // calculate the new cursor position:
      pos1 = pos3 - moveEvent.clientX
      pos2 = pos4 - moveEvent.clientY
      pos3 = moveEvent.clientX
      pos4 = moveEvent.clientY
      // set the element's new position:
      windowElement.style.top = `${windowElement.offsetTop - pos2}px`
      windowElement.style.left = `${windowElement.offsetLeft - pos1}px`
    }
  }

  // Close window
  windowClose.addEventListener('click', () => {
    // OpenApps.remove(selectedApp.name, elmnt.id)
    windowElement.remove()
  })

  // OpenApps.add(selectedApp.name, elmnt)

  // Add the element to the screen once it is fully initialized
  desktop.appendChild(windowTemplate)
}

export default {
  init,
  createWindow,
}

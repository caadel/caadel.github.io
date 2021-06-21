// import OpenApps from './modules/open-apps.js'

// Init
let templates, desktop, fontSize, globalData
function init(dataObject) {
  globalData = dataObject

  templates = document.createElement('template')
  templates.innerHTML = dataObject.templates
  desktop = document.getElementById('desktop')
  fontSize = globalData.fontSize
}

function createWindow(appName) {
  const appTemplate = templates.content.querySelector(`#${appName}`)
  if (appTemplate === null) {
    console.log(`No app exist with the name "${appName}"!`)
    return
  }

  // Create window
  const windowTemplate = templates.content
    .querySelector('#window-template')
    .content.cloneNode(true)

  // TODO: get id number from openApps later
  const windowElement = windowTemplate.querySelector('.window')
  windowElement.id = `window_${1}`
  // TODO: window.style.zIndex = id from openApps

  // Add app content to window, TODO: get id from OpenApps or app icons
  const appHTML = appTemplate.content.cloneNode(true)
  const windowContent = windowElement.querySelector('.content')
  windowContent.appendChild(appHTML)

  let pos1,
    pos2,
    pos3,
    pos4,
    xPos,
    yPos,
    contentWidth,
    contentHeight = 0
  let isFullscreen = false

  // Get the header components
  const windowHeader = windowElement.querySelector('.header')
  const windowIcon = windowHeader.querySelector('.icon')
  const windowTitle = windowHeader.querySelector('.title')
  const windowMinimize = windowHeader.querySelector('.minimize')
  const windowFullscreen = windowHeader.querySelector('.fullscreen')
  const windowClose = windowHeader.querySelector('.close')
  const resizeBtn = windowElement.querySelector('.resizer')

  // Get app icon html code (font awesome icon)
  windowIcon.innerHTML = globalData.availableApps[appName].icon

  windowTitle.innerHTML = `<h4>${globalData.availableApps[appName].name}</h4>`

  windowIcon.onmousedown = windowDragging
  windowTitle.onmousedown = windowDragging

  resizeBtn.onmousedown = resizeDragging

  // TODO: Whenever the window is clicked, move it to the top
  windowElement.addEventListener('click', () => {
    // OpenApps.setActiveWindow(selectedApp.name, elmnt)
  })

  function windowDragging(dragEvent) {
    if (isFullscreen) return

    dragEvent.preventDefault()

    // TODO: Move window to top
    // OpenApps.setActiveWindow(selectedApp.name, elmnt)

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
      const distanceToTop = windowElement.offsetTop

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
        const heightToMoveUpTo = browserHeight - taskbarHeaderHeight
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

      xPos = windowElement.style.left
      yPos = windowElement.style.top
    }
  }

  // Close window
  windowClose.addEventListener('click', () => {
    // OpenApps.remove(selectedApp.name, elmnt.id)
    windowElement.remove()
  })

  function resizeDragging(dragEvent) {
    dragEvent.preventDefault()

    // Get the mouse cursor position at startup:
    pos3 = dragEvent.clientX
    pos4 = dragEvent.clientY

    // Stop moving when mouse button is released:
    document.onmouseup = () => {
      document.onmouseup = null
      document.onmousemove = null

      resizeBtn.style.cursor = 'grab'
    }

    // call a function whenever the cursor moves:
    document.onmousemove = (moveEvent) => {
      moveEvent.preventDefault()

      // TODO: limit resize to not be able to be drawn larger than the screens width
      // let rightsideXPos = windowElement.offsetLeft + contentWidth + 1
      // console.log(window.innerWidth - rightsideXPos)
      // if (window.innerWidth - rightsideXPos < 0) return

      // TODO: limit resize to not be able to make the window smaller than a min size
      resizeBtn.style.cursor = 'grabbing'

      // calculate the new cursor position:
      pos1 = pos3 - moveEvent.clientX
      pos2 = pos4 - moveEvent.clientY
      pos3 = moveEvent.clientX
      pos4 = moveEvent.clientY

      // Change window size
      contentHeight = windowContent.scrollHeight - pos2
      contentWidth = windowContent.scrollWidth - pos1

      windowContent.style.height = `${contentHeight}px`
      windowContent.style.width = `${contentWidth}px`
    }
  }

  // OpenApps.add(selectedApp.name, elmnt)

  // Add the element to the screen
  desktop.appendChild(windowElement)

  // Set initial centered position
  let initialYPos =
    desktop.scrollHeight / 2 -
    globalData.taskbarHeight -
    windowElement.scrollHeight / 2
  let initialXPos = desktop.scrollWidth / 2 - windowElement.scrollWidth / 2

  windowElement.style.top = `${initialYPos}px`
  windowElement.style.left = `${initialXPos}px`

  // Record its position and size
  contentWidth = windowContent.scrollWidth
  contentHeight = windowContent.scrollHeight
  yPos = windowElement.style.top
  xPos = windowElement.style.left

  // Fullscreen header button functionality
  windowFullscreen.addEventListener('click', () => {
    if (isFullscreen) {
      isFullscreen = false
      windowIcon.style.cursor = 'grab'
      windowTitle.style.cursor = 'grab'
      windowFullscreen.innerHTML = `<i class="fas fa-expand"></i>`
      resizeBtn.style.display = 'inline-block'

      windowContent.style.width = `${contentWidth}px`
      windowContent.style.height = `${contentHeight}px`

      windowElement.style.width = 'fit-content'
      windowElement.style.height = 'fit-content'
      windowElement.style.left = xPos
      windowElement.style.top = yPos
    } else {
      isFullscreen = true
      windowIcon.style.cursor = 'default'
      windowTitle.style.cursor = 'default'
      windowFullscreen.innerHTML = `<i class="fas fa-compress"></i>`
      resizeBtn.style.display = 'none'

      windowElement.style.top = 0
      windowElement.style.left = 0
      windowElement.style.width = `${desktop.scrollWidth}px`
      windowElement.style.height = `${
        desktop.scrollHeight - globalData.taskbarHeight
      }px`

      windowContent.style.height = `${
        desktop.scrollHeight -
        windowHeader.scrollHeight -
        globalData.taskbarHeight
      }px`
      windowContent.style.width = '100%'
    }
  })

  //TODO: determine what background we want on the window content'
  windowContent.classList.add('white-bg')
  // windowContent.classList.add('blur-bg')
}

export default {
  init,
  createWindow,
}

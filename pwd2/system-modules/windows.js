import OpenWindows from './open-windows.js'

let templates, desktop, fontSize, globalData

/**
 * Initializes the Windows module.
 *
 * @param {Object} dataObject - The initialized "GlobalData" object.
 */
function init(dataObject) {
  globalData = dataObject
  templates = document.createElement('template')
  templates.innerHTML = dataObject.templates
  desktop = document.getElementById('desktop')
  fontSize = globalData.fontSize
}

/**
 * Creates a new window and adds all window-related functionality to it.
 *
 * @param {String} appName - The name of the app to be launched.
 * @returns {HTMLElement} the created window.
 */
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

  const windowElement = windowTemplate.querySelector('.window')

  // Add app content to window, TODO: get id from OpenWindows or app icons
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
  const resizeBtnX = windowElement.querySelector('.resizer-x')
  const resizeBtnY = windowElement.querySelector('.resizer-y')

  // Get app icon html code (font awesome icon)
  windowIcon.innerHTML = globalData.availableApps[appName].icon

  windowTitle.innerHTML = `<h4>${globalData.availableApps[appName].name}</h4>`

  windowElement.addEventListener('click', (event) => {
    /**
     * Guard clause: Prevents giving focus to a window if
     * for example the "close" button is clicked.
     */
    if (event.target.classList.contains('no-focus-on-click')) return

    OpenWindows.setActiveWindow(appName, windowElement)
  })

  // Window move functionality
  windowIcon.onmousedown = windowDragging
  windowTitle.onmousedown = windowDragging

  function windowDragging(dragEvent) {
    if (isFullscreen) return

    dragEvent.preventDefault()

    // Move window to top
    OpenWindows.setActiveWindow(appName, windowElement)

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

      if (distanceToTop < 0)
        windowElement.style.top = `${
          parseInt(windowElement.style.top) - distanceToTop
        }px`

      const taskbarHeaderHeight = fontSize * 5
      const browserHeight = window.innerHeight

      const distanceToTaskbar =
        browserHeight - distanceToTop - taskbarHeaderHeight

      if (distanceToTaskbar < 0) {
        const heightToMoveUpTo = browserHeight - taskbarHeaderHeight
        windowElement.style.top = `${heightToMoveUpTo}px`
      }

      // Check if window is out of bounds on the X-axis, move in if true
      // Left
      if (windowElement.offsetLeft < 0) windowElement.style.left = 0
      // Right
      if (windowElement.offsetLeft + contentWidth > window.innerWidth)
        windowElement.style.left = `${window.innerWidth - contentWidth}px`
    }

    // Called when cursor moves during drag
    document.onmousemove = (moveEvent) => {
      moveEvent.preventDefault()
      windowIcon.style.cursor = 'grabbing'
      windowTitle.style.cursor = 'grabbing'

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

  // Window resizing functionality
  resizeBtn.onmousedown = resizeDragInit
  resizeBtnX.onmousedown = resizeDragInit
  resizeBtnY.onmousedown = resizeDragInit

  function resizeDragInit(dragEvent) {
    dragEvent.preventDefault()
    if (dragEvent.target == resizeBtn) resizeDragging(dragEvent, true, true)
    else if (dragEvent.target == resizeBtnX)
      resizeDragging(dragEvent, true, false)
    else if (dragEvent.target == resizeBtnY)
      resizeDragging(dragEvent, false, true)
  }

  // Resize window
  function resizeDragging(dragEvent, resizeX, resizeY) {
    // Get the mouse cursor position at startup
    pos3 = dragEvent.clientX
    pos4 = dragEvent.clientY

    // Stop moving when mouse button is released
    document.onmouseup = () => {
      document.onmouseup = null
      document.onmousemove = null

      // Check if app window bounds are outside of browser window, resize to fit screen if so
      const rightsideXPos = windowElement.offsetLeft + contentWidth
      const bottomsideYPos = windowElement.offsetTop + contentHeight

      const isOutOfBoundsX = rightsideXPos > window.innerWidth
      const isOutOfBoundsY =
        window.innerHeight -
          globalData.taskbarHeight -
          windowHeader.scrollHeight -
          bottomsideYPos <
        0

      // Resize width
      if (isOutOfBoundsX) {
        const outOfBoundsX = rightsideXPos - window.innerWidth
        contentWidth -= outOfBoundsX

        windowContent.style.width = `${contentWidth}px`
      }

      // Resize height
      if (isOutOfBoundsY) {
        contentHeight =
          window.innerHeight -
          windowElement.offsetTop -
          windowHeader.scrollHeight -
          globalData.taskbarHeight

        windowContent.style.height = `${contentHeight}px`
      }
    }

    // Called when cursor moves during drag
    document.onmousemove = (moveEvent) => {
      moveEvent.preventDefault()

      // Calculate new cursor position
      pos1 = pos3 - moveEvent.clientX
      pos2 = pos4 - moveEvent.clientY
      pos3 = moveEvent.clientX
      pos4 = moveEvent.clientY

      // Change window size (height)
      if (resizeY) {
        contentHeight = windowContent.scrollHeight - pos2
        if (contentHeight < initialContentHeight) return

        windowContent.style.height = `${contentHeight}px`
      }

      // Change window size (width)
      if (resizeX) {
        contentWidth = windowContent.scrollWidth - pos1
        if (contentWidth < initialContentWidth) return

        windowContent.style.width = `${contentWidth}px`
      }
    }
  }

  // Close window functionality
  windowClose.addEventListener('click', () => {
    OpenWindows.removeWindow(appName, windowElement)
  })

  // TODO: Minimize window functionality
  windowMinimize.addEventListener('click', () => {
    // TODO
    console.log('minimize')
  })

  // Add the element to the screen
  desktop.appendChild(windowElement)
  OpenWindows.add(appName, windowElement)

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

  const initialContentWidth = parseFloat(
    window.getComputedStyle(windowContent).width.slice(0, -2)
  )
  const initialContentHeight = parseFloat(
    window.getComputedStyle(windowContent).height.slice(0, -2)
  )

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

  // TODO: determine what background we want on the window content'
  // windowContent.classList.add('white-bg')
  windowContent.classList.add('blur-bg-2')

  return windowElement
}

export default {
  init,
  createWindow,
}

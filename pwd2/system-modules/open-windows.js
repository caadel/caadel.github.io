/**
 * This script keeps track of:
 *  1. all open apps
 *  2. which windows belong to what app
 *  3. TODO: which apps have minimized windows
 *
 * This script is used to style app shortcuts
 * according to their windows' states.
 */

// import Settings from './settings.js'

const windows = new Map()

let activeWindow,
  activeAppName,
  prevActiveApp = null

let windowIndex = 0
let numOfWindowsOpened = 0

let windowStack = []

/**
 * Tracks a new window and adds an ID to it
 *
 * @param {String} name - The name of the app
 * @param {HTMLElement} window - The window itself
 */
function add(name, window) {
  const openOfSameApp = windows.get(name)
  window.id = `window_${numOfWindowsOpened}`
  if (openOfSameApp === undefined) windows.set(name, [window])
  else {
    openOfSameApp.push(window)
    windows.set(name, openOfSameApp)
  }
  numOfWindowsOpened++
  setActiveWindow(name, window)
}

function setActiveWindow(name, window) {
  // Whenever the window is clicked, move it to the top
  if (activeWindow !== window) {
    prevActiveApp = activeAppName
    window.style.zIndex = ++windowIndex
    activeWindow = window
    activeAppName = name
    windowStack.push({ name: name, window: window })

    // Update window style
    let prevActiveWindow = document.querySelector('.active-window')
    if (prevActiveWindow !== null)
      prevActiveWindow.classList.remove('active-window')
    window.classList.add('active-window')

    // TODO: track open window for keyboard controls
  }

  // Update shortcuts in taskbar
  if (windows.get(name).length > 0) updateShortcutStyle(name, true, true)
}

/**
 * Updates the style of the app shortcuts depending on if
 * the app has a window open or not and if the currently active
 * window belongs to the app.
 *
 * @param {String} name - The name of the app
 * @param {Boolean} isOpen - If the app is currently open
 * @param {Boolean} isActive - If the app has the currently active window
 */
function updateShortcutStyle(name, isOpen, isActive) {
  let shortcut = document.querySelector('#taskbar').querySelector(`#${name}`)

  if (isOpen) {
    shortcut.classList.add('open')
    if (isActive) {
      shortcut.classList.add('active')

      if (prevActiveApp !== activeAppName && prevActiveApp != undefined) {
        document
          .querySelector('#taskbar')
          .querySelector(`#${prevActiveApp}`)
          .classList.remove('active')
      }
    } else shortcut.classList.remove('active')
  } else shortcut.classList.remove('open', 'active')
}

function removeWindow(name, window) {
  let removeIndex = windows.get(name).findIndex((el) => {
    return el.id == window.id
  })

  /**
   * When a window is removed, go back in the window stack to
   * select the last active window, and make it active again.
   */
  activeAppName = null
  activeWindow = null
  let newActiveWindow = null
  windowStack.pop()
  for (let i = windowStack.length - 1; i >= 0; i--) {
    newActiveWindow = windowStack.pop()

    let test = document.querySelector(`#${newActiveWindow.window.id}`)
    if (test != null) {
      setActiveWindow(newActiveWindow.name, newActiveWindow.window)
      break
    }
  }

  // Remove the window and update the shortcuts
  windows.get(name).splice(removeIndex, 1)

  if (windows.get(name).length > 0) updateShortcutStyle(name, true, false)
  else updateShortcutStyle(name, false, false)

  window.remove()

  // Clear the window stack if necessary
  if (windows.size === 0) windowStack = []
}

export default {
  add,
  setActiveWindow,
  updateShortcutStyle,
  removeWindow,
}

/**
 * Module that keeps track of all open windows in the PWD.
 * Also updates the taskbar to indicate whether an app has any windows of it opened.
 */

import Settings from './settings.js'

/**
 * Map containing all open windows.
 * key = the name of the application
 * value = an array of all open instances of the app
 */
const allOpenWindows = new Map()

let currentShortcutStyle, currentShortcutStyleActive

let activeWindow = null

let activeAppName = null

let index = 0

let openedWindows = 0

/**
 * Adds an open window to the Map.
 *
 * @param {string} name - The name of the application.
 * @param {HTMLElement} window - The html window.
 * @returns {void}.
 */
function add (name, window) {
  const openOfSameApp = allOpenWindows.get(name)
  if (openOfSameApp === undefined) allOpenWindows.set(name, [window.id])
  else {
    openOfSameApp.push(window.id)
    allOpenWindows.set(name, openOfSameApp)
  }
  openedWindows++
  updateShortcuts()
  setActiveWindow(name, window)
}

/**
 * Removes an open window from the Map.
 *
 * @param {string} name - The name of the application.
 * @param {string} id - The id of the window.
 * @returns {void}.
 */
function remove (name, id) {
  const openOfSameApp = allOpenWindows.get(name)
  if (openOfSameApp === undefined) return

  const pos = openOfSameApp.indexOf(id)

  if (pos === -1) return

  openOfSameApp.splice(pos, 1)

  allOpenWindows.set(name, openOfSameApp)

  updateShortcuts()
}

/**
 * Updates the appearance of the app shortcuts in the taskbar. If there are
 * any apps opened, the shortcut that opened the app will get a different
 * look to indicate that a window of that app is open.
 *
 * @returns {void}.
 */
function updateShortcuts () {
  for (const [key, value] of allOpenWindows) {
    const shortcut = document.getElementById(`shortcut_${key}`)
    if (value.length === 0) shortcut.classList = `app-shortcut ${currentShortcutStyle}`
    else {
      if (key === activeAppName) {
        shortcut.classList = `app-shortcut ${currentShortcutStyle} ${currentShortcutStyleActive}-focus`
      } else { shortcut.classList = `app-shortcut ${currentShortcutStyle} ${currentShortcutStyleActive}` }
    }
  }
}

/**
 * Fetches the current settings and changes the visual appearance of the app shortcuts.
 *
 * @returns {void}.
 */
function updateSettings () {
  currentShortcutStyle = Settings.getShortcutStyle().default
  currentShortcutStyleActive = Settings.getShortcutStyle().active

  updateStyle()
  updateShortcuts()
}

/**
 * Changes the visual appearance of the app shortcuts.
 *
 * @returns {void}.
 */
function updateStyle () {
  const shortcuts = document.getElementById('taskbar-shortcuts')
  const count = shortcuts.childElementCount

  for (let index = 0; index < count; index++) {
    shortcuts.childNodes[index].classList = `app-shortcut ${currentShortcutStyle}`
  }
}

/**
 * Returns the window that is currently in focus.
 *
 * @returns {void}.
 */
function getActiveWindow () {
  return activeWindow
}

/**
 * Sets the currently active/in focus window id.
 *
 * @param {string} name - The name of the application.
 * @param {HTMLElement} window - The window.
 * @returns {void}.
 */
function setActiveWindow (name, window) {
  const openOfSameApp = allOpenWindows.get(name)

  if (name !== null && window.id !== undefined && openOfSameApp !== undefined) {
    if (openOfSameApp.includes(window.id)) {
      if (activeWindow !== null) activeWindow.classList.remove('window-focus')

      activeWindow = window
      activeAppName = name

      window.style.zIndex = ++index
      window.classList.add('window-focus')

      updateShortcuts()
    } else activeWindow = null
  }
}

/**
 * Returns the total number of opened windows.
 *
 * @returns {number} The number.
 */
function getNumOfOpenedWindows () {
  return openedWindows
}

export default {
  add,
  remove,
  updateSettings,
  getActiveWindow,
  setActiveWindow,
  getNumOfOpenedWindows
}

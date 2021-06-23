/**
 * This script keeps track of:
 *  1. all open apps
 *  2. which windows belong to what app
 *  3. which apps have minimized windows
 *
 * This script is used to style app shortcuts
 * according to their windows' states.
 */

// import Settings from './settings.js'

const windows = new Map()

let activeWindow,
  activeAppName = null

let index,
  numOfWindows = 0

/**
 * Tracks a new window and adds an ID to it
 *
 * @param {String} name - The name of the app
 * @param {HTMLElement} window - The window itself
 */
function add(name, window) {
  const openOfSameApp = windows.get(name)
  window.id = `window_${numOfWindows}`
  if (openOfSameApp === undefined) windows.set(name, [window])
  else {
    openOfSameApp.push(window)
    windows.set(name, openOfSameApp)
  }
  numOfWindows++
  setActiveWindow(name, window)
}

function setActiveWindow(name, window) {
  // TODO: update window styles? (header color/transparency?)

  // TODO: zIndex

  // Update shortcuts in taskbar
  if (name !== activeAppName) updateShortcutStyle(name, true, true)

  /**
   * TODO: removing a window if the app has more than one
   * open instance should remove "active" class, currently
   * the shortcut style does not change
   */

  checkEmptyWindowArrayForApp(name)
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

      if (activeAppName !== null) {
        document
          .querySelector('#taskbar')
          .querySelector(`#${activeAppName}`)
          .classList.remove('active')
      }

      activeAppName = name
    }
  } else {
    shortcut.classList.remove('open', 'active')
  }
}

function removeWindow(name, window) {
  let removeIndex = windows.get(name).findIndex((el) => {
    return el.id == window.id
  })

  windows.get(name).splice(removeIndex, 1)

  checkEmptyWindowArrayForApp(name)

  window.remove()
}

function checkEmptyWindowArrayForApp(name) {
  if (windows.get(name).length === 0) updateShortcutStyle(name, false, false)
}

export default {
  add,
  setActiveWindow,
  updateShortcutStyle,
  removeWindow,
}

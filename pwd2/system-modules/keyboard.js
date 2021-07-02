import OpenWindows from './open-windows.js'
import AppMenu from './app-menu.js'

const outputMap = new Map()

document.body.addEventListener('keydown', (e) => {
  const openWindow = OpenWindows.getActiveWindow()

  // Close app menu
  if (e.key === 'Escape') {
    if (openWindow == null) {
      AppMenu.hide()
      return
    }
  }

  if (openWindow == null) return

  // Send keypress to the correct app instance
  outputMap.get(openWindow.id).keyboardInput(e.key)
})

/**
 * Attaches a new app instance that wants to receive keyboard inputs.
 *
 * @param {String} windowID - the id of the window.
 * @param {Object} instance - the app instance.
 */
function attachOutput(windowID, instance) {
  outputMap.set(windowID, instance)
}

export default {
  attachOutput,
}

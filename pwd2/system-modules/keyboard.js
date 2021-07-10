import OpenWindows from './open-windows.js'
import AppMenu from './app-menu.js'

const outputMap = new Map()

document.body.addEventListener('keydown', (e) => {
  const openWindow = OpenWindows.getActiveWindow()

  // App menu controls
  if (openWindow == null) {
    if (!AppMenu.appMenuContainer.classList.contains('hidden')) {
      switch (e.key) {
        case 'Escape':
          AppMenu.hide()
          break
        case 'ArrowUp':
        case 'ArrowDown':
          AppMenu.selectAnotherApp(e.key)
          break
        case 'Enter':
          AppMenu.openSelectedApp()
          break
        default:
          break
      }
    }

    return
  }

  // Send keypress to the correct app instance
  const outWindow = outputMap.get(openWindow.id)
  if (outWindow) outWindow.keyboardInput(e.key)
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

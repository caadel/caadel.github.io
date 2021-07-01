import OpenWindows from './open-windows.js'
import AppMenu from './app-menu.js'

document.body.addEventListener('keydown', (e) => {
  const openWindow = OpenWindows.getActiveWindow()

  // Close app menu
  if (e.key === 'Escape') {
    if (openWindow == null) {
      AppMenu.hide()
      return
    }
  }

  // TODO: send keyboard input to open app
})

export default {}

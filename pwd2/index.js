import Windows from './modules/windows.js'
import Settings from './modules/settings.js'
import Apps from './apps.js'

// Init everything
window.addEventListener('DOMContentLoaded', async () => {
  // Init Windows.js
  await Windows.init()

  // Init app icons in taskbar
  await Apps.init()

  // Testing adding windows manually
  Windows.createWindow('date-time')
})

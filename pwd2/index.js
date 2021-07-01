import GlobalData from './system-modules/global-data.js'
import Windows from './system-modules/windows.js'
import Settings from './system-modules/settings.js'
import Apps from './system-modules/app-shortcuts.js'
import KeyboardModule from './system-modules/keyboard.js'

// Init global data
await GlobalData.init()
let DO = GlobalData.getDataObject()

// Init Windows.js
Windows.init(DO)

// Init app icons in taskbar
Apps.init(DO)

// Testing adding windows manually
// Windows.createWindow('calculator')

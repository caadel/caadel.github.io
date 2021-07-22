import GlobalData from './system-modules/global-data.js'
import Windows from './system-modules/windows.js'
import Settings from './system-modules/settings.js'
import Shortcuts from './system-modules/app-shortcuts.js'
import RightClickModule from './system-modules/right-click.js'
import KeyboardModule from './system-modules/keyboard.js'

// Init global data
await GlobalData.init()
let DO = GlobalData.getDataObject()

// Init Windows.js
Windows.init(DO)

// Init app icons in taskbar
Shortcuts.init(DO)

// Init the custom right-click menu
RightClickModule.init()

// Testing adding windows manually
Windows.createWindow('klondike')

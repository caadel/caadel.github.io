import Windows from './system-modules/windows.js'
import Settings from './system-modules/settings.js'
import Apps from './system-modules/app-shortcuts.js'

// Init Windows.js
await Windows.init()

// Init app icons in taskbar
await Apps.init()

// Testing adding windows manually
Windows.createWindow('calculator')

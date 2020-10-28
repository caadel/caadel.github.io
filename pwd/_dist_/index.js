import Templates from './modules/templates.js'
import DateTime from './modules/datetime.js'
import Settings from './modules/settings.js'
;(function () {
  /**
   * Settings needs to be initialised first
   */
  Settings.init()

  /**
   * Start the system clock and display the date in the taskbar
   */
  DateTime.init()

  /**
   * Create the app shortcuts in the taskbar
   *
   */
  Templates.createNewAppShortcut(Templates.Apps.CHAT)
  Templates.createNewAppShortcut(Templates.Apps.HANGMAN)
  Templates.createNewAppShortcut(Templates.Apps.MEMORY)
  Templates.createNewAppShortcut(Templates.Apps.SETTINGS)

  /**
   * Windows can be created on directly if we want, but due to how the system
   * keeps track of the open instances of all apps to update their appearance
   * in the taskbar, all app shortcuts need to be initialized before any windows
   * can be directly opened from this index file.
   */
  // Templates.createNewWindow(Templates.Apps.SETTINGS)
  // Templates.createNewWindow(Templates.Apps.MEMORY)
  // Templates.createNewWindow(Templates.Apps.HANGMAN)
  // Templates.createNewWindow(Templates.Apps.CHAT)
})()

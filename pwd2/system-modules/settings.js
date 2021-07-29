import StorageModule from './storage.js'

const availableSettings = {
  SYSTEM_ACCENT_COLOR: '--accent-color',
  SYSTEM_BACKGROUND_TRANSPARENCY: '--background-transparency',
  SYSTEM_BACKGROUND_COLOR: '--background-color',
  SYSTEM_FONT_COLOR: '--font-color',
  SYSTEM_DARKMODE_1: '--darkmode-color-1',
  SYSTEM_DARKMODE_2: '--darkmode-color-2',
  WINDOW_BORDER_RADIUS: '--window-border-radius',
  WINDOW_BORDER_WIDTH: '--window-border-width',
  WINDOW_BORDER_COLOR: '--window-border-color',
}
Object.freeze(availableSettings)

const defaultValues = {
  '--accent-color': '#40e0d0',
  '--background-transparency': '0.75',
  '--background-color': '#000000',
  '--font-color': '#f3f3f3',
  '--darkmode-color-1': 'rgb(5,5,5)',
  '--darkmode-color-2': 'b',
  '--window-border-radius': '5px',
  '--window-border-width': '0px',
  '--window-border-color': '#000',
}

function init() {
  // How to set a value
  // document.documentElement.style.setProperty('--test-var', '#FFFFFF')

  // How to read a set value
  // getComputedStyle(document.body).getPropertyValue('--test-var')

  // Get all stored settings and apply them to the DOM.
  for (const setting of Object.keys(availableSettings)) {
    let fetchedValue = StorageModule.getItem(availableSettings[setting])

    if (fetchedValue === null)
      fetchedValue = defaultValues[availableSettings[setting]]

    document.documentElement.style.setProperty(
      availableSettings[setting],
      fetchedValue
    )
  }
}

function getSetting(setting) {
  let fetchedSetting = StorageModule.getItem(setting)

  if (fetchedSetting === null) fetchedSetting = defaultValues[setting]

  return fetchedSetting
}

function setSetting(settingName, ...args) {
  switch (settingName) {
    case availableSettings.WINDOW_BORDER_RADIUS:
    case availableSettings.WINDOW_BORDER_WIDTH:
      document.documentElement.style.setProperty(settingName, `${args[0]}px`)
      updateStorage(settingName, `${args[0]}px`)
      break

    case availableSettings.SYSTEM_ACCENT_COLOR:
    case availableSettings.SYSTEM_BACKGROUND_TRANSPARENCY:
    case availableSettings.SYSTEM_BACKGROUND_COLOR:
    case availableSettings.SYSTEM_FONT_COLOR:
    case availableSettings.WINDOW_BORDER_COLOR:
      document.documentElement.style.setProperty(settingName, args[0])
      updateStorage(settingName, args[0])
      break
    default:
      break
  }
}

function updateStorage(key, value) {
  StorageModule.storeItem(key, value)
}

function clearSettings() {
  StorageModule.clearStorage()

  init()
}

function printSettings() {
  StorageModule.printStoredItems()
}
export default {
  availableSettings,
  defaultValues,
  init,
  getSetting,
  setSetting,
  clearSettings,
  printSettings,
}

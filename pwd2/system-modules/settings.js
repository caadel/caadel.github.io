import StorageModule from './storage.js'

const availableSettings = {
  WINDOW_BORDER_RADIUS: '--window-border-radius',
  WINDOW_BORDER_WIDTH: '--window-border-width',
  WINDOW_BORDER_COLOR: '--window-border-color',
}
Object.freeze(availableSettings)

const defaultValues = {
  WINDOW_BORDER_RADIUS: '0',
  WINDOW_BORDER_WIDTH: '0',
  WINDOW_BORDER_COLOR: '#000',
}

function init() {
  console.log('init settings')

  // How to set a value
  // document.documentElement.style.setProperty('--test-var', '#FFFFFF')

  // How to read a set value
  // getComputedStyle(document.body).getPropertyValue('--test-var')

  // Get all stored settings and apply them to the DOM.
  for (const setting of Object.keys(availableSettings)) {
    let fetchedValue = StorageModule.getItem(availableSettings[setting])

    if (fetchedValue === null) fetchedValue = defaultValues[setting]

    document.documentElement.style.setProperty(
      availableSettings[setting],
      fetchedValue
    )
  }
}

function getSetting(setting) {
  let fetchedSetting = StorageModule.getItem(setting)

  return fetchedSetting
}

function setSetting(settingName, ...args) {
  switch (settingName) {
    case availableSettings.WINDOW_BORDER_RADIUS:
      document.documentElement.style.setProperty(settingName, `${args[0]}px`)
      updateStorage(settingName, `${args[0]}px`)
      break
    case availableSettings.WINDOW_BORDER_WIDTH:
      document.documentElement.style.setProperty(settingName, `${args[0]}px`)
      updateStorage(settingName, `${args[0]}px`)
      break
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

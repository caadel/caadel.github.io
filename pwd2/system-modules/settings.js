import StorageModule from './storage.js'

const availableSettings = {
  WINDOWBORDERRADIUS: '--window-border-radius',
}
Object.freeze(availableSettings)

const defaultValues = {
  WINDOWBORDERRADIUS: '0',
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

function setSetting(setting, ...args) {
  switch (setting) {
    case availableSettings.WINDOWBORDERRADIUS:
      document.documentElement.style.setProperty(
        availableSettings.WINDOWBORDERRADIUS,
        `${args[0]}px`
      )
      updateStorage(availableSettings.WINDOWBORDERRADIUS, `${args[0]}px`)
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

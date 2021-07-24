import SettingsModule from '../system-modules/settings.js'
const settings = SettingsModule.availableSettings
const settingsDefault = SettingsModule.defaultValues

class App {
  constructor(outputArea, categoryContents) {
    this.currentCategory = 'windows'
    this.categoryDisplayArea = outputArea
    this.categoryContents = categoryContents
    this.previousCategoryContents = null
  }

  changeActiveSettingsCategory(newCategoryName) {
    if (newCategoryName === this.currentCategory) return

    this.currentCategory = newCategoryName

    this.setDisplayAreaContent()
  }

  setDisplayAreaContent() {
    // Remove previous displayed settings
    if (this.previousCategoryContents !== null) {
      this.categoryDisplayArea.removeChild(this.previousCategoryContents)
      this.categoryContents.appendChild(this.previousCategoryContents)
    }

    // Get the new settings and display them
    let currentContent = this.categoryContents.querySelector(
      `[data-cat="${this.currentCategory}"]`
    )
    this.categoryDisplayArea.appendChild(currentContent)

    // Prepare for next category swap
    this.previousCategoryContents = currentContent
  }

  updateBorderRadius(value) {
    SettingsModule.setSetting(settings.WINDOWBORDERRADIUS, value)
  }
}

// document.createElement().appendChild

const instances = new Map()

/**
 * Creates a new instance of the app.
 *
 * @param {String} windowID - the id of the window the app instance is opened in.
 */
function newInstance(windowID) {
  const window = document.getElementById(windowID).querySelector('.content')
  const menu = window.querySelector('.category-settings')
  const content = window.querySelector('.category-contents')

  const instance = new App(menu, content)

  instances.set(windowID, instance)

  const menuList = window.querySelector('ul')

  // Add functionality to the left-hand-side settings menu
  for (const button of menuList.querySelectorAll('li')) {
    button.addEventListener('click', () => {
      instance.changeActiveSettingsCategory(button.dataset.cat)
    })
  }

  const borderRadiusSlider = content.querySelector('#border-radius-slider')
  let borderRadiusSetting = SettingsModule.getSetting(
    settings.WINDOWBORDERRADIUS
  )
  if (borderRadiusSetting === null)
    borderRadiusSlider.value = settingsDefault.WINDOWBORDERRADIUS
  else borderRadiusSlider.value = borderRadiusSetting.slice(0, -2)

  borderRadiusSlider.addEventListener('input', () => {
    instance.updateBorderRadius(borderRadiusSlider.value)
  })

  content.querySelector('#reset-settings').addEventListener('click', () => {
    SettingsModule.clearSettings()
    borderRadiusSlider.value = settingsDefault[settings.WINDOWBORDERRADIUS]
  })

  content.querySelector('#log-settings').addEventListener('click', () => {
    SettingsModule.printSettings()
  })

  instance.setDisplayAreaContent()
  return instance
}

export default {
  newInstance,
}

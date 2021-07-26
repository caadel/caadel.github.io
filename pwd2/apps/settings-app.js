import SettingsModule from '../system-modules/settings.js'
const settings = SettingsModule.availableSettings
const settingsDefault = SettingsModule.defaultValues

class App {
  constructor(outputArea, categoryContents, menuItems) {
    this.currentCategory = 'windows'
    this.categoryDisplayArea = outputArea
    this.categoryContents = categoryContents
    this.previousCategoryContents = null
    this.menuItems = menuItems
  }

  changeActiveSettingsCategory(button, newCategoryName) {
    if (newCategoryName === this.currentCategory) return

    this.currentCategory = newCategoryName

    this.setDisplayAreaContent(button)
  }

  setDisplayAreaContent(button) {
    if (this.previousCategoryContents !== null) {
      // Change the category style in the menu
      this.menuItems.querySelector('.active').classList.remove('active')

      // Remove previous displayed settings
      this.categoryDisplayArea.removeChild(this.previousCategoryContents)
      this.categoryContents.appendChild(this.previousCategoryContents)
    }

    // Change the category style in the menu
    button.classList.add('active')

    // Get the new settings and display them
    let currentContent = this.categoryContents.querySelector(
      `[data-cat="${this.currentCategory}"]`
    )
    this.categoryDisplayArea.appendChild(currentContent)

    // Prepare for next category swap
    this.previousCategoryContents = currentContent
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
  const settingsArea = window.querySelector('.category-settings')
  const content = window.querySelector('.category-contents')
  const menuList = window.querySelector('ul')

  const instance = new App(settingsArea, content, menuList)

  instances.set(windowID, instance)

  // Add functionality to the left-hand-side settings menu
  for (const button of menuList.querySelectorAll('li')) {
    button.addEventListener('click', () => {
      instance.changeActiveSettingsCategory(button, button.dataset.cat)
    })
  }

  // Setup functionality for the different settings sliders/buttons/etc
  setupWindowsSettings(content)

  content.querySelector('#reset-settings').addEventListener('click', () => {
    SettingsModule.clearSettings()
    // TODO: reset the displayed value in sliders, buttons, etc
    // borderRadiusSlider.value = settingsDefault[settings.WINDOW_BORDER_RADIUS]
  })

  content.querySelector('#log-settings').addEventListener('click', () => {
    SettingsModule.printSettings()
  })

  // Set initial active category
  instance.setDisplayAreaContent(menuList.querySelector(`[data-cat="windows"]`))

  return instance
}

function setupWindowsSettings(content) {
  // Border width settings
  const borderWidthSlider = content.querySelector(
    `[name="border-width-slider"]`
  )
  const borderWidthSlider_label = content.querySelector(
    `[for="border-width-slider"]`
  )
  let borderWidthSetting = SettingsModule.getSetting(
    settings.WINDOW_BORDER_WIDTH
  )
  let borderWidthDisplayValue
  if (borderWidthSetting === null)
    borderWidthDisplayValue = settingsDefault.WINDOW_BORDER_WIDTH
  else borderWidthDisplayValue = borderWidthSetting.slice(0, -2)
  borderWidthSlider.value = borderWidthDisplayValue
  borderWidthSlider_label.innerHTML = borderWidthDisplayValue

  borderWidthSlider.addEventListener('input', () => {
    SettingsModule.setSetting(
      settings.WINDOW_BORDER_WIDTH,
      borderWidthSlider.value
    )
    borderWidthSlider_label.innerHTML = borderWidthSlider.value
  })

  // Border radius setting
  const borderRadiusSlider = content.querySelector(
    `[name="border-radius-slider"]`
  )
  const borderRadiusSlider_label = content.querySelector(
    `[for="border-radius-slider"]`
  )
  let borderRadiusSetting = SettingsModule.getSetting(
    settings.WINDOW_BORDER_RADIUS
  )
  let borderRadiusDisplayValue
  if (borderRadiusSetting === null)
    borderRadiusDisplayValue = settingsDefault.WINDOW_BORDER_RADIUS
  else borderRadiusDisplayValue = borderRadiusSetting.slice(0, -2)
  borderRadiusSlider.value = borderRadiusDisplayValue
  borderRadiusSlider_label.innerHTML = borderRadiusDisplayValue

  borderRadiusSlider.addEventListener('input', () => {
    SettingsModule.setSetting(
      settings.WINDOW_BORDER_RADIUS,
      borderRadiusSlider.value
    )
    borderRadiusSlider_label.innerHTML = borderRadiusSlider.value
  })

  // Border color settings
  const borderColorPicker = content.querySelector(
    `[name="border-color-picker"]`
  )
  let borderColorSetting = SettingsModule.getSetting(
    settings.WINDOW_BORDER_COLOR
  )
  if (borderColorSetting === null)
    borderColorPicker.value = settingsDefault.WINDOW_BORDER_COLOR
  else borderColorPicker.value = borderColorSetting

  borderColorPicker.addEventListener('input', () => {
    SettingsModule.setSetting(
      settings.WINDOW_BORDER_COLOR,
      borderColorPicker.value
    )
  })
  borderColorPicker.addEventListener('change', () => {
    SettingsModule.setSetting(
      settings.WINDOW_BORDER_COLOR,
      borderColorPicker.value
    )
  })
}

export default {
  newInstance,
}

import SettingsModule from '../system-modules/settings.js'
const settings = SettingsModule.availableSettings

class App {
  constructor(outputArea, categoryContents, menuItems, initialCategory) {
    this.currentCategory = initialCategory
    this.categoryDisplayArea = outputArea
    this.categoryContents = categoryContents
    this.previousCategoryContents = null
    this.menuItems = menuItems

    this.setDisplayAreaContent(
      menuItems.querySelector(`[data-cat="${initialCategory}"]`)
    )
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

  resetDisplayAreaContent() {}
}

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

  const instance = new App(settingsArea, content, menuList, 'system')

  instances.set(windowID, instance)

  // Add functionality to the left-hand-side settings menu
  for (const button of menuList.querySelectorAll('li')) {
    button.addEventListener('click', () => {
      instance.changeActiveSettingsCategory(button, button.dataset.cat)
    })
  }

  // Setup functionality for the different settings sliders/buttons/etc
  setupAllCategories(menuList, content, settingsArea, false)

  // Reset settings button (special case since it changes values of all categories)
  let resetBtn = content.querySelector(`[name="reset-settings"]`)
  if (resetBtn === null)
    resetBtn = settingsArea.querySelector(`[name="reset-settings"]`)

  resetBtn.addEventListener('click', () => {
    SettingsModule.clearSettings()

    setupAllCategories(menuList, content, settingsArea, true)
  })

  return instance
}

function setupAllCategories(
  categories,
  contentStorage,
  settingsDisplayArea,
  resetOnly
) {
  for (let i = 1; i < categories.childNodes.length; i += 2) {
    let content = contentStorage
    const category = categories.childNodes[i]
    const active = category.classList.contains('active')

    if (active) content = settingsDisplayArea

    switch (category.dataset.cat) {
      case 'windows':
        setupWindowsSettings(content, resetOnly)
        break
      case 'system':
        setupSystemSettings(content, resetOnly)
        break
      default:
        break
    }
  }
}

function setupSystemSettings(content, reset) {
  // Background transparency settings
  const transparencyCheckbox = content.querySelector(
    `[name="background-transparency-check"]`
  )
  const transparencyLabel = content.querySelector(
    '#background-transparency-text'
  )
  let transparencySetting = SettingsModule.getSetting(
    settings.SYSTEM_BACKGROUND_TRANSPARENCY
  )

  transparencySetting === '1'
    ? (transparencyCheckbox.checked = false)
    : (transparencyCheckbox.checked = true)

  transparencyCheckbox.checked
    ? (transparencyLabel.innerHTML = 'on')
    : (transparencyLabel.innerHTML = 'off')

  if (!reset) {
    transparencyCheckbox.addEventListener('input', () => {
      if (transparencyCheckbox.checked) {
        transparencyLabel.innerHTML = 'on'
        SettingsModule.setSetting(
          settings.SYSTEM_BACKGROUND_TRANSPARENCY,
          SettingsModule.defaultValues[settings.SYSTEM_BACKGROUND_TRANSPARENCY]
        )
      } else {
        transparencyLabel.innerHTML = 'off'
        SettingsModule.setSetting(settings.SYSTEM_BACKGROUND_TRANSPARENCY, '1')
      }
    })
  }
}

function setupWindowsSettings(content, reset) {
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

  const borderWidthDisplayValue = borderWidthSetting.slice(0, -2)
  borderWidthSlider.value = borderWidthDisplayValue
  borderWidthSlider_label.innerHTML = borderWidthDisplayValue

  if (!reset) {
    borderWidthSlider.addEventListener('input', () => {
      SettingsModule.setSetting(
        settings.WINDOW_BORDER_WIDTH,
        borderWidthSlider.value
      )
      borderWidthSlider_label.innerHTML = borderWidthSlider.value
    })
  }

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
  const borderRadiusDisplayValue = borderRadiusSetting.slice(0, -2)
  borderRadiusSlider.value = borderRadiusDisplayValue
  borderRadiusSlider_label.innerHTML = borderRadiusDisplayValue

  if (!reset) {
    borderRadiusSlider.addEventListener('input', () => {
      SettingsModule.setSetting(
        settings.WINDOW_BORDER_RADIUS,
        borderRadiusSlider.value
      )
      borderRadiusSlider_label.innerHTML = borderRadiusSlider.value
    })
  }

  // Border color settings
  const borderColorPicker = content.querySelector(
    `[name="border-color-picker"]`
  )
  const borderColorSetting = SettingsModule.getSetting(
    settings.WINDOW_BORDER_COLOR
  )
  borderColorPicker.value = borderColorSetting

  if (!reset) {
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
}

export default {
  newInstance,
}

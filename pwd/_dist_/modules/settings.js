/**
 * Settings that can be modified through the "Settings" app in the PWD.
 * These settings affect the "system" (i.e some modules that are not launchabe apps).
 */

import SettingsChanger from './settingsChanger.js'
import Storage from './storage.js'

const ShortcutStyle = {
  NO_BORDER: 'app-shortcut-default',
  BORDER: 'app-shortcut-border',
  NO_BORDER_ACTIVE: 'app-shortcut-default-active',
  BORDER_ACTIVE: 'app-shortcut-border-active'
}
Object.freeze(ShortcutStyle)

const BackgroundStyle = {
  REPEAT: 'repeat',
  COVER: 'desktop-cover'
}
Object.freeze(BackgroundStyle)

const SettingCategory = {
  DESKTOP: 'Desktop',
  DATE_TIME: 'Date & Time',
  GENERAL: 'General'
}
Object.freeze(SettingCategory)

const DateFormat = {
  STANDARD: 'DD/MM/YYYY',
  STANDARD_DASH: 'DD-MM-YYYY',
  MONTH_FIRST: 'MM/DD/YYYY',
  MONTH_FIRST_DASH: 'MM-DD-YYYY'
}
Object.freeze(DateFormat)

let currentShortcutStyle,
  currentShortcutStyleActive,
  currentDateFormat,
  currentTimeFormatUseSeconds,
  currentBackgroundStyle
const desktop = document.getElementById('desktop')

/**
 * Initializes the current settings from local storage.
 * If a setting has not been stored, it is set to a default value.
 *
 * @returns {void}.
 */
function init () {
  // Load the style for app shortcuts
  currentShortcutStyle = Storage.getShortcutStyle()
  if (
    currentShortcutStyle !== ShortcutStyle.NO_BORDER &&
    currentShortcutStyle !== ShortcutStyle.BORDER
  ) {
    currentShortcutStyle = ShortcutStyle.NO_BORDER
    currentShortcutStyleActive = ShortcutStyle.NO_BORDER_ACTIVE
  } else setShortcutStyle(currentShortcutStyle)

  // Load the style for the date format
  currentDateFormat = Storage.getDateFormat()
  if (
    currentDateFormat !== DateFormat.STANDARD &&
    currentDateFormat !== DateFormat.MONTH_FIRST &&
    currentDateFormat !== DateFormat.STANDARD_DASH &&
    currentDateFormat !== DateFormat.MONTH_FIRST_DASH
  ) {
    currentDateFormat = DateFormat.STANDARD
  }

  // Load the style for background image style
  currentBackgroundStyle = Storage.getBackgroundStyle()
  if (
    currentBackgroundStyle !== BackgroundStyle.COVER &&
    currentBackgroundStyle !== BackgroundStyle.REPEAT
  ) {
    currentBackgroundStyle = BackgroundStyle.COVER
  }

  // Load the style for the time format
  currentTimeFormatUseSeconds = Storage.getTimeUsesSeconds()
  if (currentTimeFormatUseSeconds === 'false') currentTimeFormatUseSeconds = false
  else currentTimeFormatUseSeconds = true

  SettingsChanger.openApps()
  setBackgroundStyle(currentBackgroundStyle)
  Storage.loadBackgroundImage()
}

/**
 * A song
 *
 * @typedef {{default: string, active: string}} ScStyles
 */
/**
 * Sets the app shortcut border-style.
 *
 * @returns {ScStyles} the two shortcut styles.
 */
function getShortcutStyle () {
  return { default: currentShortcutStyle, active: currentShortcutStyleActive }
}

/**
 * Sets the app shortcut border-style.
 *
 * @param {string} style - the style to change to.
 * @returns {void}.
 */
function setShortcutStyle (style) {
  if (style === ShortcutStyle.BORDER || style === ShortcutStyle.NO_BORDER) {
    currentShortcutStyle = style
    style === ShortcutStyle.NO_BORDER
      ? (currentShortcutStyleActive = ShortcutStyle.NO_BORDER_ACTIVE)
      : (currentShortcutStyleActive = ShortcutStyle.BORDER_ACTIVE)

    SettingsChanger.openApps()
    Storage.setShortcutStyle(style)
  }
}

/**
 * Returns the current date format.
 *
 * @returns {string} the date format enum.
 */
function getDateFormat () {
  return currentDateFormat
}

/**
 * Sets the date format.
 *
 * @param {string} format - the format to change to.
 * @returns {void}.
 */
function setDateFormat (format) {
  if (
    format === DateFormat.STANDARD ||
    format === DateFormat.MONTH_FIRST ||
    format === DateFormat.STANDARD_DASH ||
    format === DateFormat.MONTH_FIRST_DASH
  ) {
    currentDateFormat = format
  }

  Storage.setDateFormat(format)

  SettingsChanger.dateTime(currentDateFormat, currentTimeFormatUseSeconds)
}

/**
 * Returns whether the clock should display seconds or not.
 *
 * @returns {boolean} the current setting.
 */
function getClockUsesSeconds () {
  return currentTimeFormatUseSeconds
}

/**
 * Sets whether the clock should display seconds or not.
 *
 * @param {boolean} usesSeconds - true if clock should display seconds.
 * @returns {void}.
 */
function setClockUsesSeconds (usesSeconds) {
  if (usesSeconds === true || usesSeconds === false) currentTimeFormatUseSeconds = usesSeconds
  Storage.setTimeUsesSeconds(usesSeconds)
  SettingsChanger.dateTime(currentDateFormat, currentTimeFormatUseSeconds)
}

/**
 * Saves a user-uploaded background image to the storage.
 *
 * @param {string} inputId - the id of the input element the image was added to.
 * @returns {void}.
 */
function uploadBackgroundImage (inputId) {
  Storage.uploadBackgroundImage(inputId)
}

/**
 * Removes the current background image.
 *
 * @returns {void}.
 */
function clearBackgroundImage () {
  Storage.clearBackgroundImage()
}

/**
 * Sets the current background repeating style.
 *
 * @param {string} style - the style to change to.
 * @returns {void}.
 */
function setBackgroundStyle (style) {
  if (style === BackgroundStyle.COVER || style === BackgroundStyle.REPEAT) {
    desktop.classList = style
    currentBackgroundStyle = style
    Storage.setBackgroundStyle(style)
  }
}

/**
 * Returns the current background style.
 *
 * @returns {string} the style enum.
 */
function getBackgroundStyle () {
  return currentBackgroundStyle
}

/**
 * Resets all settings to their default values and
 * clears their respective entries in local storage.
 *
 * @returns {void}.
 */
function clearSettings () {
  currentBackgroundStyle = BackgroundStyle.COVER
  currentDateFormat = DateFormat.STANDARD
  currentShortcutStyle = ShortcutStyle.NO_BORDER
  currentShortcutStyleActive = ShortcutStyle.NO_BORDER_ACTIVE
  currentTimeFormatUseSeconds = true

  SettingsChanger.dateTime()
  SettingsChanger.openApps()

  Storage.clearSettings()
}

/**
 * Clears local storage and resets settings.
 *
 * @returns {void}.
 */
function clearStorage () {
  clearSettings()
  Storage.clearStorage()
}

export default {
  ShortcutStyle,
  BackgroundStyle,
  SettingCategory,
  DateFormat,
  init,
  getShortcutStyle,
  setShortcutStyle,
  getDateFormat,
  setDateFormat,
  getClockUsesSeconds,
  setClockUsesSeconds,
  uploadBackgroundImage,
  clearBackgroundImage,
  setBackgroundStyle,
  getBackgroundStyle,
  clearSettings,
  clearStorage
}

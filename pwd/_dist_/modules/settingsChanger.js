/**
 * Changes the settings in apps. Can be expanded with many
 * more system settings.
 */

import DateTime from './datetime.js'
import OpenApps from './openapps.js'

/**
 * Updates the date and time settings.
 *
 * @returns {void}.
 */
function dateTime () {
  DateTime.updateSettings()
}

/**
 * Updates the settings for the open apps app.
 *
 * @returns {void}.
 */
function openApps () {
  OpenApps.updateSettings()
}

export default {
  dateTime,
  openApps
}

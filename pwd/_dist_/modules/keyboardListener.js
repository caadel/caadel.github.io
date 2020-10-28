/**
 * This module adds an event listener for keyboard input to the body.
 *
 * If the currently active window has requested to be able to be able
 * to read keyboard inputs (i.e. has been added with addOutputSource()),
 * they will receive the inputs. No other open window will receive the input,
 * only the currently active one will.
 *
 * Also, the source has to implement the "keyPress(openId, e.key)" function to
 * be able to receive any data.
 *
 * This module could also be expanded to be able to read and execute keyboard
 * shortcuts for the System, without needing an open app window to start.
 *
 * This module is also only necessary for use when the app needs input read from outside
 * an element that would otherwise be easier to read input from; i.e. a textarea.
 */

import OpenApps from './openapps.js'

const outputWindows = new Map()

document.body.addEventListener('keydown', (e) => {
  const openWindow = OpenApps.getActiveWindow()

  // Only proceed if a window is actually open
  if (openWindow !== null) {
    const output = outputWindows.get(openWindow.id)
    if (output !== undefined) output.keyPress(openWindow.id, e.key)
  }
})

/**
 * Adds a window as an output source to send keypresses to.
 *
 * @param {*} windowId - The Id of the window.
 * @param {*} object - The module that the should receive the keypresses.
 * @returns {void}.
 */
function addOutputSource (windowId, object) {
  if (typeof windowId === 'number') windowId = `window${windowId}`

  outputWindows.set(windowId, object)
}

export default {
  addOutputSource
}

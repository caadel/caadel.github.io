/**
 * Clock functionality, from this source:
 * https://www.w3schools.com/js/tryit.asp?filename=tryjs_timing_clock
 *
 */
import Settings from './settings.js'

const clock = document.getElementById('taskbar-clock')
const date = document.getElementById('taskbar-date')
let usesSeconds, dateFormat

/**
 * Initializes the module.
 *
 * @returns {void}.
 */
function init () {
  usesSeconds = Settings.getClockUsesSeconds()
  dateFormat = Settings.getDateFormat()
  startClock()
  displayDate()
}

let timer
/**
 * Starts the clock.
 *
 * @returns {void}.
 */
function startClock () {
  const today = new Date()
  const h = today.getHours()
  let m = today.getMinutes()
  let s = today.getSeconds()
  m = checkTime(m)
  s = checkTime(s)

  if (usesSeconds) clock.innerHTML = `${h}:${m}:${s}`
  else clock.innerHTML = `${h}:${m}`

  timer = setTimeout(startClock, 500)
}

/**
 * Fetches the current settings and re-displays the content in the taskbar.
 *
 * @returns {void}.
 */
function updateSettings () {
  usesSeconds = Settings.getClockUsesSeconds()
  dateFormat = Settings.getDateFormat()
  displayDate()
  clearTimeout(timer)
  startClock()
}

/**
 * Adds a '0' in front of 1-digit numbers.
 *
 * @param {number} i - the number to check.
 * @returns {string} the edited number.
 */
function checkTime (i) {
  if (i < 10) i = `0${i}`
  return i
}

/**
 * Displays the current date in the taskbar.
 *
 * @returns {void}.
 */
function displayDate () {
  const today = new Date()

  const separator = dateFormat.substring(2, 3)
  if (
    dateFormat === Settings.DateFormat.STANDARD ||
    dateFormat === Settings.DateFormat.STANDARD_DASH
  ) {
    date.innerHTML =
      today.getDate() + separator + (today.getMonth() + 1) + separator + today.getFullYear()
  } else {
    date.innerHTML =
      today.getMonth() + 1 + separator + today.getDate() + separator + today.getFullYear()
  }
}

/**
 * Returns the current time, hours only.
 *
 * @returns {string} the hours string.
 */
function getHours () {
  const today = new Date()
  let h = today.getHours()
  h = checkTime(h)
  return h
}

/**
 * Returns the current time, minutes only.
 *
 * @returns {string} the minutes string.
 */
function getMinutes () {
  const today = new Date()
  let m = today.getMinutes()
  m = checkTime(m)
  return m
}

export default {
  init,
  updateSettings,
  getHours,
  getMinutes
}

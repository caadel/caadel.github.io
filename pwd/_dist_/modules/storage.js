/**
 * Storage module that is used by the Settings and the Chat apps for
 * storing and retrieving data relevant needed for the apps to funciton
 * according to their respective requirements.
 */

const localStorage = window.localStorage
const sessionStorage = window.sessionStorage

const desktop = document.getElementById('desktop')
// function initStorage() {
//   let localLog = localStorage.getItem("messageLog")
//   let sessionLog = sessionStorage.getItem("messageLog")

//   console.log("INIT STORAGE")

//   if (localLog === null) {
//       console.log("INIT LOCAL STORAGE")
//       localStorage.setItem("messageLog", JSON.stringify([]))
//   }

//   if (sessionLog === null) {
//       console.log("INIT SESSION STORAGE")
//       sessionStorage.setItem("messageLog", JSON.stringify([]))
//   }

//   outputStorage()
// }

/**
 * Initializes local storage.
 *
 * @returns {void}.
 */
function initStorage () {
  // let localLog = storageLocal.getItem('backgroundImg')
  // if (localLog === null) {
  //   // console.log('INIT LOCAL STORAGE')
  //   storageLocal.setItem('backgroundImg', JSON.stringify([]))
  // }
  // outputStorage()
}
initStorage()

/**
 * Saves a background image to the local storage.
 *
 * @param {string} inputId - the id of the input where the image was added.
 * @returns {void}.
 */
function uploadBackgroundImage (inputId) {
  const formInput = document.getElementById(inputId)

  const fileReader = new FileReader()

  if (formInput.files.length !== 0) {
    // Check file extension
    if (formInput.files[0].name.match(/.(jpg|jpeg|png)$/i)) {
      fileReader.readAsDataURL(formInput.files[0])

      fileReader.addEventListener('load', function () {
        try {
          if (this.result && localStorage) {
            localStorage.setItem('backgroundImg', this.result)
            desktop.style.backgroundImage = `url('${this.result}')`
          } else console.log('Image upload failed!')
        } catch (error) {
          console.log('Image upload failed, your file might be too large!')
        }
      })
    } else console.log('Image upload failed, your file is not an image!')
  }
}

/**
 * Displays the saved background image to the desktop.
 *
 * @returns {void}.
 */
function loadBackgroundImage () {
  const url = localStorage.getItem('backgroundImg')
  if (url === undefined) console.log('not found ')
  else desktop.style.backgroundImage = `url('${url}')`
}

/**
 * Removes the saved background image from local storage and the desktop.
 *
 * @returns {void}.
 */
function clearBackgroundImage () {
  localStorage.setItem('backgroundImg', undefined)
  loadBackgroundImage()
}

/**
 * Returns the saved app shortcut style.
 *
 * @returns {void}.
 */
function getShortcutStyle () {
  return localStorage.getItem('shortcutStyle')
}

/**
 * Saves the app shortcut style to local storage.
 *
 * @param {string} style - the shortcut style to save.
 * @returns {void}.
 */
function setShortcutStyle (style) {
  localStorage.setItem('shortcutStyle', style)
}

/**
 * Returns the saved date format.
 *
 * @returns {string} the saved date format.
 */
function getDateFormat () {
  return localStorage.getItem('dateFormat')
}

/**
 * Saves the date format to local storage.
 *
 * @param {string} format - the date format to save.
 * @returns {void}.
 */
function setDateFormat (format) {
  localStorage.setItem('dateFormat', format)
}

/**
 * Returns the saved background image style.
 *
 * @returns {string}.
 */
function getBackgroundStyle () {
  return localStorage.getItem('backgroundStyle')
}

/**
 * Saves thebackground image style to local storage.
 *
 * @param {string} style - the background repeating style to save.
 * @returns {void}.
 */
function setBackgroundStyle (style) {
  localStorage.setItem('backgroundStyle', style)
}

/**
 * Returns the saved boolean of whether the clock should display seconds or not.
 *
 * @returns {boolean} true if clock should display seconds.
 */
function getTimeUsesSeconds () {
  return localStorage.getItem('timeUsesSeconds')
}

/**
 * Saves whetherthe clock should use seconds or not to local storage.
 *
 * @param {boolean} boolean - whether the clock should use seconds or not.
 * @returns {void}.
 */
function setTimeUsesSeconds (boolean) {
  localStorage.setItem('timeUsesSeconds', boolean)
}

/**
 * Clears all entries currently in saved to local storage.
 *
 * @returns {void}.
 */
function clearStorage () {
  localStorage.clear()
  sessionStorage.clear()
  console.log('Storage cleared!')
}

/**
 * Prints all items from local storage to the console.
 *
 * @returns {void}.
 */
function outputStorage () {
  console.log('localStorage')
  console.log(localStorage)
  console.log('sessionStorage')
  console.log(sessionStorage)
}

/**
 * Clears only the storage related to settings. (Leaves the chat storage intact).
 *
 * @returns {void}.
 */
function clearSettings () {
  clearBackgroundImage()
  localStorage.removeItem('backgroundImg')
  localStorage.removeItem('shortcutStyle')
  localStorage.removeItem('dateFormat')
  localStorage.removeItem('backgroundStyle')
  localStorage.removeItem('timeUsesSeconds')
}

/**
 * Returns the last stored chat username.
 *
 * @returns {string} the stored username.
 */
function getChatUsername () {
  return localStorage.getItem('chatUsername')
}

/**
 * Stores a new username for the cat application to local storage.
 *
 * @param {string} username - The username to store.
 * @returns {void}.
 */
function setChatUsername (username) {
  localStorage.setItem('chatUsername', username)
}

window.addEventListener('storage', () => {
  console.log('Local storage event received')
  // outputStorage()
  // outputLocalStorage()
  // outputSessionStorage()
})

export default {
  initStorage,
  uploadBackgroundImage,
  loadBackgroundImage,
  clearBackgroundImage,
  getShortcutStyle,
  setShortcutStyle,
  getDateFormat,
  setDateFormat,
  getBackgroundStyle,
  setBackgroundStyle,
  getTimeUsesSeconds,
  setTimeUsesSeconds,
  getChatUsername,
  setChatUsername,
  clearStorage,
  outputStorage,
  clearSettings
}

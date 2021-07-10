const localStorage = window.localStorage
const sessionStorage = window.sessionStorage

/**
 * Stores data in a given key string to the local (persistant) storage.
 *
 * @param {String} key - the name of the storage.
 * @param {String} value - the value to store.
 */
function storeItem(key, value) {
  localStorage.setItem(key, value)
}

/**
 * Stores data in a given key string to the session storage.
 *
 * @param {String} key - the name of the storage.
 * @param {String} value - the value to store.
 */
function storeItemSession(key, value) {
  sessionStorage.setItem(key, value)
}

/**
 * Fetches the stored string for a given key from local (persistant) storage.
 *
 * @param {String} key - the name of the value to fetch.
 * @returns the stored value.
 */
function getItem(key) {
  return localStorage.getItem(key)
}

/**
 * Fetches the stored string for a given key from session storage.
 *
 * @param {String} key - the name of the value to fetch.
 * @returns the stored value.
 */
function getItemSession(key) {
  return localStorage.getItem(key)
}

/**
 * Clears all entries currently in saved to local storage.
 */
function clearStorage() {
  localStorage.clear()
  sessionStorage.clear()
  console.log('Storage cleared!')
}

/**
 * Prints all items from local storage to the console.
 */
function printStoredItems() {
  console.log('localStorage:')
  console.log(localStorage)
  console.log('sessionStorage:')
  console.log(sessionStorage)
}

export default {
  clearStorage,
  storeItem,
  storeItemSession,
  getItem,
  getItemSession,
  printStoredItems,
}

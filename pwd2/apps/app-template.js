class App {
  constructor(attr) {
    this.attr = attr
  }

  /**
   * Receives a keyboard input and passes it to the app.
   *
   * @param {String} key - the input key.
   */
  keyboardInput(key) {}
}

const instances = new Map()

/**
 * Creates a new instance of the app.
 *
 * @param {String} windowID - the id of the window the app instance is opened in.
 */
function newInstance(windowID) {
  const window = document.getElementById(windowID).querySelector('.content')

  const instance = new App('data')

  instances.set(windowID, instance)

  return instance
}

export default {
  newInstance,
}

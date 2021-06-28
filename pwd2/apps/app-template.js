class App {
  constructor(a) {
    this.a = a
  }

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
}

/**
 * Passes a keyboard input to an instance of the app.
 *
 * @param {String} windowID - the window id of the app to receive the input.
 * @param {Strig} key - the input key.
 */
function keyboardInput(windowID, key) {
  instances.get(windowID).keyboardInput(key)
}

export default {
  newInstance,
  keyboardInput,
}

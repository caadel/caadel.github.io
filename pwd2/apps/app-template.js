class App {
  constructor(a) {
    this.a = a

    this.clearAll()
  }

  keyboardInput(key) {}
}

const instances = new Map()

function newInstance(windowID) {
  const window = document.getElementById(windowID).querySelector('.content')

  const instance = new App('data')

  instances.set(windowID, instance)
}

function keyboardInput(windowID, key) {
  instances.get(windowID).keyboardInput(key)
}

export default {
  newInstance,
  keyboardInput,
}

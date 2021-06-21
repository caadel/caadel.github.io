class DataObject {
  constructor(templates, availableApps, fontSize, taskbarHeight) {
    this.templates = templates
    this.availableApps = availableApps
    this.fontSize = fontSize
    this.taskbarHeight = taskbarHeight
  }
}

let DO = null
async function init() {
  let templates, availableApps, fontSize, taskbarHeight

  fontSize = parseInt(
    window.getComputedStyle(desktop, null).getPropertyValue('font-size')
  )
  taskbarHeight = fontSize * 3
  document.getElementById('taskbar').style.height = `${taskbarHeight}px`

  templates = await (await fetch('templates.html')).text()

  availableApps = await (await fetch('app-list.json')).json()

  DO = new DataObject(templates, availableApps, fontSize, taskbarHeight)
}

function getDataObject() {
  if (DO === null) {
    console.log('init() must be called before accessing the data object!')
    return
  }

  return DO
}

export default {
  init,
  getDataObject,
}

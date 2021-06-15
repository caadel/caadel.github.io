class DataObject {
  constructor(templates, availableApps) {
    this.templates = templates
    this.availableApps = availableApps
  }
}

let DO = null
async function init() {
  let templates, availableApps
  templates = await (await fetch('templates.html')).text()
  availableApps = await (await fetch('apps.json')).json()
  DO = new DataObject(templates, availableApps)
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

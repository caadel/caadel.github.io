async function init() {
  let availableApps = (availableApps = await (await fetch('apps.json')).json())

  // Add icons to taskbar (TODO: read order from stored settings!)
}

export default {
  init,
}

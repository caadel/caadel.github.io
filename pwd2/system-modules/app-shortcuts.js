let taskbarShortcuts, availableApps, template
let currentOffset = 1

async function init() {
  taskbarShortcuts = document
    .getElementById('taskbar')
    .querySelector('.app-shortcuts')
  availableApps = await (await fetch('apps.json')).json()

  let templates = document.createElement('template')
  templates.innerHTML = await (await fetch('templates.html')).text()
  template = templates.content.querySelector('#app-shortcut-template')

  // Add icons to taskbar (TODO: read order from stored settings!)

  /**
   * All icons are added in the same place:
   * to the far left place in the "grid"
   *
   * The apps are then given a "transformX(1.5em * X)"
   * to offset them to the right a number of places which corresponds to
   * their order in the settings.
   *
   * When moving the icons around on the x-axis only, the transform is
   * what should be chaninging when swapping places.
   *
   * There can be a maximum of 10 apps in the taskbar at once.
   */

  //TODO: change this to be from settings instead
  for (const key in availableApps) {
    const app = availableApps[key]

    addAppToTaskbar(key)
  }
}

function addAppToTaskbar(appName) {
  const container = template.content.cloneNode(true).querySelector('.container')
  taskbarShortcuts.appendChild(container)

  container.querySelector('.icon').innerHTML = availableApps[appName].icon
  container.style.transform = `translateX(${3 * currentOffset}em)`
  currentOffset++

  const openWindowsContainer = container.querySelector('.windows-container')
  openWindowsContainer.querySelector('.title').innerHTML =
    availableApps[appName].name

  // OpenApps should do the things below
  let rows = 1 // --> floor(number of open windows / 3)
  openWindowsContainer.style.transform = `translate(-50%, -${rows + 0.4}em)`
  if (appName === 'calculator') container.classList.add('active')
}

function removeAppFromTaskbar(appName) {}

export default {
  init,
  addAppToTaskbar,
  removeAppFromTaskbar,
}

import WindowHandler from './windows.js'
import AppMenu from './app-menu.js'

let taskbarShortcuts, template, fontSize, globalData, shortcutHeight
let currentOffset = 1

function init(dataObject) {
  globalData = dataObject

  taskbarShortcuts = document
    .getElementById('taskbar')
    .querySelector('.app-shortcuts')

  let templates = document.createElement('template')
  templates.innerHTML = dataObject.templates
  template = templates.content.querySelector('#app-shortcut-template')

  fontSize = globalData.fontSize
  shortcutHeight = globalData.taskbarHeight

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
  let i = 1
  for (const key in dataObject.availableApps) {
    // const app = dataObject.availableApps[key]

    let container = addAppToTaskbar(key)
    container.classList.add(`pos-${i}`)
    i++
  }

  AppMenu.init(globalData)
}

function addAppToTaskbar(appName) {
  const container = template.content.cloneNode(true).querySelector('.container')
  taskbarShortcuts.appendChild(container)

  container.id = appName

  container.querySelector('.icon').innerHTML =
    globalData.availableApps[appName].icon
  container.style.transform = `translateX(${3 * currentOffset}em)`
  currentOffset++

  const openWindowsContainer = container.querySelector('.windows-container')
  openWindowsContainer.querySelector('.title').innerHTML =
    globalData.availableApps[appName].name

  let originalPosition = 0

  let draggedElement = false
  container.onmousedown = dragging

  function dragging(dragEvent) {
    dragEvent.preventDefault()

    // Get the mouse cursor position at startup:
    originalPosition = dragEvent.clientX
    let prevPos = dragEvent.clientX
    let currPos = dragEvent.clientX
    let swapPlaceUpperBound = 0
    container.classList.remove('being-corrected', 'low')
    container.classList.add('not-being-corrected', 'high')
    let numOfAppsInTaskbar = 3 // TODO: get from Settings

    // Stop moving when mouse button is released:
    document.onmouseup = () => {
      document.onmouseup = null
      document.onmousemove = null
      container.style.cursor = 'pointer'

      if (swapPlaceUpperBound < 1) return

      /**If the shortcut is moved too far to the right,
       * reset it to the right-most shortcut position.
       *
       * This skips the more extensive check in the loop below.
       * */
      if (swapPlaceUpperBound >= numOfAppsInTaskbar + 1) {
        moveShortCut(container, numOfAppsInTaskbar)
        return
      }

      // Determine the closest place to drop the shortcut
      let closestPlaceToDrop = 1
      let diff = shortcutHeight
      let smallestDiff = Number.MAX_VALUE

      //TODO: change the loop to be from settings (num of apps in taskbar)
      for (let i = 1; i <= numOfAppsInTaskbar; i++) {
        let testPos = i * shortcutHeight + shortcutHeight * 0.5
        diff = Math.abs(currPos - testPos)

        if (diff <= smallestDiff) {
          closestPlaceToDrop = i
          smallestDiff = diff
        }
      }

      moveShortCut(container, closestPlaceToDrop)
    }

    // call a function whenever the cursor moves:
    document.onmousemove = (moveEvent) => {
      moveEvent.preventDefault()

      currPos = moveEvent.clientX

      // Checking for shortcut place swapping when moving
      swapPlaceUpperBound = currPos / shortcutHeight
      if (Number.isInteger(swapPlaceUpperBound)) {
        if (
          swapPlaceUpperBound <= numOfAppsInTaskbar &&
          swapPlaceUpperBound > 0
        ) {
          // console.log(swappingPlaceHigherBound)
          // console.log('right: ' + swappingPlaceHigherBound)
          // console.log('left: ' + (swappingPlaceHigherBound - 1))

          // Check moving direction to see which way to swap
          let posDiff = currPos - prevPos
          if (posDiff !== 0) {
            let contAtSwapPos
            if (posDiff > 0) {
              console.log(swapPlaceUpperBound)

              // New pos for item to be swapped with
              contAtSwapPos = document.querySelector(
                `.pos-${swapPlaceUpperBound}`
              )
              contAtSwapPos.classList.remove(`pos-${swapPlaceUpperBound}`)
              contAtSwapPos.classList.add(`pos-${swapPlaceUpperBound - 1}`)
              moveShortCut(contAtSwapPos, swapPlaceUpperBound - 1)

              // New class for the swapper
              container.classList.remove(`pos-${swapPlaceUpperBound - 1}`)
              container.classList.add(`pos-${swapPlaceUpperBound}`)
            } else {
              console.log(swapPlaceUpperBound - 1)

              // New pos for item to be swapped with
              contAtSwapPos = document.querySelector(
                `.pos-${swapPlaceUpperBound - 1}`
              )
              contAtSwapPos.classList.remove(`pos-${swapPlaceUpperBound - 1}`)
              contAtSwapPos.classList.add(`pos-${swapPlaceUpperBound}`)
              moveShortCut(contAtSwapPos, swapPlaceUpperBound)

              // New class for the swapper
              container.classList.remove(`pos-${swapPlaceUpperBound}`)
              container.classList.add(`pos-${swapPlaceUpperBound - 1}`)
            }
          }

          // TODO: change settings after swap!
        }
      }

      draggedElement = true
      container.style.cursor = 'grabbing'

      // fontSize * 1.5 => offsets half of the width of the shortcut element
      let newCalcPos = currPos - fontSize * 1.5
      if (newCalcPos > shortcutHeight) {
        container.style.transform = `translateX(${newCalcPos}px)`
      }

      prevPos = currPos
    }
  }

  // When clicked, open corresponding app
  container.addEventListener('click', () => {
    if (!draggedElement) WindowHandler.createWindow(appName)
    else draggedElement = false
  })

  // TODO: OpenApps should do the things below
  let rows = 1 // --> floor(number of open windows / 3)
  openWindowsContainer.style.transform = `translate(-50%, -${rows + 0.4}em)`
  // if (appName === 'calculator') container.classList.add('active')

  return container
}

function removeAppFromTaskbar(appName) {
  // TODO
}

/**
 * Moves a shortcut to a new positionin the taskbar,
 * with an applied additional transition.
 *
 * @param {HTMLElement} container - The shortcut to move
 * @param {Number} position  - The index to move to
 */
function moveShortCut(container, position) {
  container.classList.add('being-corrected', 'low')
  container.classList.remove('not-being-corrected', 'high')

  container.style.transform = `translateX(${position * shortcutHeight}px)`
}

export default {
  init,
  addAppToTaskbar,
  removeAppFromTaskbar,
}

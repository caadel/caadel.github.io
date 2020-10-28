/**
 * Templates for most things in the PWD
 *
 * Things that can be created using this module:
 * 1. an app shortcut
 * 2. a window with an app inside
 *
 * App templates only create the html objects that will be present in the app window.
 * App logic is found in each app's module.
 */
import ChatTemplate from '../templates/chat_template.js'
import HangmanTemplate from '../templates/hangman_template.js'
import MemoryTemplate from '../templates/memory_template.js'
import SettingsTemplate from '../templates/settings_template.js'
import OpenApps from './openapps.js'
import Settings from './settings.js'

const Apps = {
  CHAT: ChatTemplate,
  MEMORY: MemoryTemplate,
  HANGMAN: HangmanTemplate,
  SETTINGS: SettingsTemplate
}
Object.freeze(Apps)

const desktop = document.getElementsByTagName('main')[0]
const taskbar = document.getElementById('taskbar')

/**
 * Creates creates a new window on the PWD.
 *
 * @param {object} selectedApp - The Apps template module to use.
 * @param {string} selectedApp.name - The app name.
 * @returns {void} .
 */
function createNewWindow (selectedApp) {
  const elmnt = window(selectedApp)

  console.log(elmnt)

  OpenApps.add(selectedApp.name, elmnt)

  let pos1 = 0
  let pos2 = 0
  let pos3 = 0
  let pos4 = 0

  /*
   * Functions that allow for dragging a window.
   * With the Drag and Drop API, I could not achieve the effect that I wanted;
   * that only the header and icon parts of the window are draggable.
   * With the API, I needed to make the entire window draggable.
   */
  elmnt.childNodes[0].childNodes[1].onmousedown = dragging
  elmnt.childNodes[0].childNodes[0].onmousedown = dragging

  // Whenever the window is clicked, move it to the top
  elmnt.addEventListener('click', () => {
    OpenApps.setActiveWindow(selectedApp.name, elmnt)
  })

  /**
   * Changes the position of the window when dragging it.
   *
   * @param {*} dragEvent - The event.
   * @returns {void}.
   */
  function dragging (dragEvent) {
    // Move window to top
    OpenApps.setActiveWindow(selectedApp.name, elmnt)

    // Define the event
    dragEvent = dragEvent || window.event
    dragEvent.preventDefault()

    // Get the mouse cursor position at startup:
    pos3 = dragEvent.clientX
    pos4 = dragEvent.clientY

    // Stop moving when mouse button is released:
    document.onmouseup = () => {
      elmnt.childNodes[0].childNodes[0].style.cursor = 'grab'
      elmnt.childNodes[0].childNodes[1].style.cursor = 'grab'
      document.onmouseup = null
      document.onmousemove = null
    }

    // call a function whenever the cursor moves:
    document.onmousemove = (moveEvent) => {
      elmnt.childNodes[0].childNodes[0].style.cursor = 'grabbing'
      elmnt.childNodes[0].childNodes[1].style.cursor = 'grabbing'
      moveEvent = moveEvent || window.event
      moveEvent.preventDefault()
      // calculate the new cursor position:
      pos1 = pos3 - moveEvent.clientX
      pos2 = pos4 - moveEvent.clientY
      pos3 = moveEvent.clientX
      pos4 = moveEvent.clientY
      // set the element's new position:
      elmnt.style.top = `${elmnt.offsetTop - pos2}px`
      elmnt.style.left = `${elmnt.offsetLeft - pos1}px`
    }
  }

  // Close window
  elmnt.childNodes[0].childNodes[2].addEventListener('click', () => {
    OpenApps.remove(selectedApp.name, elmnt.id)
    elmnt.remove()
  })

  // Add the element to the screen once it is fully initialized
  desktop.appendChild(elmnt)
}

/**
 * Creates an app shortcut and adds it to the desktop.
 *
 * @param {object} selectedApp - The Apps template module to use.
 * @param {string} selectedApp.svg - The svg string of the icon.
 * @param {string} selectedApp.name - The app name.
 * @returns {void}.
 */
function createNewAppShortcut (selectedApp) {
  // The shortcut
  const elmnt = document.createElement('DIV')
  elmnt.classList = `app-shortcut ${Settings.getShortcutStyle().default}`
  elmnt.id = `shortcut_${selectedApp.name}`
  elmnt.innerHTML = selectedApp.svg

  // Opens a new instance of the app on click
  elmnt.addEventListener('click', () => {
    createNewWindow(selectedApp)
  })

  // Hover over to see the name of the application
  const tooltip = document.createElement('SPAN')
  tooltip.classList = 'app-shortcut-tooltip no-select'
  tooltip.innerHTML = selectedApp.name
  elmnt.appendChild(tooltip)

  taskbar.children[0].appendChild(elmnt)
}

/**
 * Creates and opens a new window of a selected application.
 *
 * @param {object} selectedApp - The Apps template module to use.
 * @param {string} selectedApp.svg - The svg string of the icon.
 * @param {string} selectedApp.name - The app name.
 * @returns {HTMLElement} the window element.
 */
function window (selectedApp) {
  const windowIndex = OpenApps.getNumOfOpenedWindows()

  // The window itself
  const newWindow = document.createElement('DIV')
  newWindow.id = `window${windowIndex}`
  newWindow.classList = 'window'

  // Header container
  const newWindowHeaderContainer = document.createElement('DIV')
  newWindowHeaderContainer.classList = 'window-header-container'
  newWindow.appendChild(newWindowHeaderContainer)

  // App icon
  const newWindowIconContainer = document.createElement('DIV')
  newWindowIconContainer.classList = 'window-header-img'
  newWindowIconContainer.innerHTML = selectedApp.svg
  newWindowHeaderContainer.appendChild(newWindowIconContainer)

  // Header title box
  const newWindowHeader = document.createElement('P')
  newWindowHeader.id = `window${windowIndex}header`
  newWindowHeader.classList = 'window-header no-select'
  newWindowHeader.innerHTML = selectedApp.name
  newWindowHeaderContainer.appendChild(newWindowHeader)

  // Close button
  const newWindowClose = document.createElement('DIV')
  newWindowClose.id = `window${windowIndex}close`
  newWindowClose.classList = 'window-close'
  newWindowClose.innerHTML = closeSvg
  newWindowHeaderContainer.appendChild(newWindowClose)

  // Main window area, where the apps go
  const newWindowContent = document.createElement('DIV')
  newWindowContent.classList = 'window-content wrapper'
  newWindow.appendChild(newWindowContent)

  // Add the actual app content
  selectedApp.template(newWindowContent, windowIndex)

  return newWindow
}

const closeSvg =
  '<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="75.151505mm" height="75.151505mm" viewBox="0 0 75.151505 75.151505" version="1.1" id="svg8933" inkscape:version="0.92.5 (2060ec1f9f, 2020-04-08)" sodipodi:docname="close-icon.svg"> <defs id="defs8927" /> <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666" borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2" inkscape:zoom="0.49497475" inkscape:cx="-169.87391" inkscape:cy="300.31191" inkscape:document-units="mm" inkscape:current-layer="layer1" showgrid="false" inkscape:window-width="1920" inkscape:window-height="1017" inkscape:window-x="-8" inkscape:window-y="-8" inkscape:window-maximized="1" /> <metadata id="metadata8930"> <rdf:RDF> <cc:Work rdf:about=""> <dc:format>image/svg+xml</dc:format> <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /> <dc:title></dc:title> </cc:Work> </rdf:RDF> </metadata> <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1" transform="translate(-62.424248,-59.424248)"> <path style="fill:none;stroke-width:15;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 70,67 60,60" id="path9478" inkscape:connector-curvature="0" sodipodi:nodetypes="cc" /> <path style="fill:none;stroke-width:15;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="M 130,67 70,127" id="path9480" inkscape:connector-curvature="0" sodipodi:nodetypes="cc" /> </g> </svg>'

export default {
  Apps,
  createNewWindow,
  createNewAppShortcut
}

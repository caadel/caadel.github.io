// import OpenApps from './modules/open-apps.js'

let desktop = document.getElementById('desktop')

async function createWindow() {
  // Get templates
  let templates = document.createElement('template')
  templates.innerHTML = await (await fetch('templates.html')).text()

  // Create window
  let windowTemplate = templates.content
    .querySelector('#window-template')
    .content.cloneNode(true)

  // TODO: get id number from openApps later
  const window = windowTemplate.querySelector('.window')
  window.id = `window_${1}`
  // window.style.zIndex = id from openApps

  // Add app content to window, TODO: get id from OpenApps or app icons
  let appHTML = templates.content
    .querySelector('#calculator')
    .content.cloneNode(true)

  window.querySelector('.content').innerHTML = appHTML.textContent

  let pos1,
    pos2,
    pos3,
    pos4 = 0

  // Get the header components
  const windowIcon = window.querySelector('.icon')
  const windowTitle = window.querySelector('.title')
  const windowClose = window.querySelector('.close')

  windowIcon.onmousedown = dragging
  windowTitle.onmousedown = dragging

  // Whenever the window is clicked, move it to the top
  window.addEventListener('click', () => {
    // OpenApps.setActiveWindow(selectedApp.name, elmnt)
  })

  function dragging(dragEvent) {
    // Move window to top
    // OpenApps.setActiveWindow(selectedApp.name, elmnt)

    // Define the event
    dragEvent = dragEvent || window.event
    dragEvent.preventDefault()

    // Get the mouse cursor position at startup:
    pos3 = dragEvent.clientX
    pos4 = dragEvent.clientY

    // Stop moving when mouse button is released:
    document.onmouseup = () => {
      windowIcon.style.cursor = 'grab'
      windowTitle.style.cursor = 'grab'
      document.onmouseup = null
      document.onmousemove = null
    }

    // call a function whenever the cursor moves:
    document.onmousemove = (moveEvent) => {
      windowIcon.style.cursor = 'grabbing'
      windowTitle.style.cursor = 'grabbing'
      moveEvent = moveEvent || window.event
      moveEvent.preventDefault()
      // calculate the new cursor position:
      pos1 = pos3 - moveEvent.clientX
      pos2 = pos4 - moveEvent.clientY
      pos3 = moveEvent.clientX
      pos4 = moveEvent.clientY
      // set the element's new position:
      window.style.top = `${window.offsetTop - pos2}px`
      window.style.left = `${window.offsetLeft - pos1}px`
    }
  }

  // Close window
  windowClose.addEventListener('click', () => {
    // OpenApps.remove(selectedApp.name, elmnt.id)
    window.remove()
  })

  // OpenApps.add(selectedApp.name, elmnt)

  // Add the element to the screen once it is fully initialized
  desktop.appendChild(windowTemplate)
}

export default {
  createWindow,
}

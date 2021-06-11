// import OpenApps from './modules/open-apps.js'

let dropArea = document.getElementById('desktop')

for (const windowElement of document.getElementsByClassName('window')) {
  const windowHeader = windowElement.getElementsByClassName('header')[0]

  // const elmnt = window(selectedApp)
  const elmnt = windowElement

  console.log(elmnt)

  // OpenApps.add(selectedApp.name, elmnt)

  let pos1,
    pos2,
    pos3,
    pos4 = 0

  elmnt.childNodes[1].childNodes[1].onmousedown = dragging
  elmnt.childNodes[1].childNodes[3].onmousedown = dragging

  // Whenever the window is clicked, move it to the top
  elmnt.addEventListener('click', () => {
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
      elmnt.childNodes[1].childNodes[1].style.cursor = 'grab'
      elmnt.childNodes[1].childNodes[3].style.cursor = 'grab'
      document.onmouseup = null
      document.onmousemove = null
    }

    // call a function whenever the cursor moves:
    document.onmousemove = (moveEvent) => {
      elmnt.childNodes[1].childNodes[1].style.cursor = 'grabbing'
      elmnt.childNodes[1].childNodes[3].style.cursor = 'grabbing'
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
  elmnt.childNodes[1].childNodes[5].addEventListener('click', () => {
    // OpenApps.remove(selectedApp.name, elmnt.id)
    elmnt.remove()
  })

  // Add the element to the screen once it is fully initialized
  desktop.appendChild(elmnt)
}

function createWindow() {
  console.log('create window')
}

export default {
  createWindow,
}

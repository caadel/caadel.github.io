let desktop, taskbar, appMenu, rightclickMenu, appShortcuts

function init() {
  desktop = document.querySelector('#desktop')
  taskbar = document.querySelector('#taskbar')
  appShortcuts = taskbar.querySelector('.app-shortcuts')
  appMenu = document.querySelector('#app-list')
  rightclickMenu = document.querySelector('#right-click-menu')

  addMenus()
}

function addMenus() {
  document.addEventListener('click', () => {
    rightclickMenu.style.display = ''
  })

  // Taskbar
  taskbar.addEventListener('contextmenu', (e) => {
    e.preventDefault()

    rightclickMenu.innerHTML = 'taskbar'
    showMenu(e)
  })

  // App shortcut
  appShortcuts.addEventListener('contextmenu', (e) => {
    e.preventDefault()

    console.log(e.target)

    rightclickMenu.innerHTML = 'app'
    showMenu(e)
  })
}

function showMenu(e) {
  rightclickMenu.style.display = 'block'

  // Check for vertical dekstop overflow
  if (rightclickMenu.scrollHeight + e.clientY > desktop.scrollHeight) {
    rightclickMenu.style.bottom = `${desktop.scrollHeight - e.clientY}px`
    rightclickMenu.style.top = ''
  } else {
    rightclickMenu.style.top = `${
      desktop.scrollHeight - e.clientY - rightclickMenu.scrollHeight
    }px`
    rightclickMenu.style.bottom = ''
  }

  // Check for horizontal dekstop overflow
  if (rightclickMenu.scrollWidth + e.clientX > desktop.scrollWidth) {
    rightclickMenu.style.right = `${desktop.scrollWidth - e.clientX}px`
    rightclickMenu.style.left = ''
  } else {
    rightclickMenu.style.left = `${e.clientX}px`
    rightclickMenu.style.right = ''
  }
}

export default {
  init,
}

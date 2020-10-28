/**
 * Template module: creates the html elements for the Memory app.
 */

import Memory from '../modules/memory.js'
import KeyboardListener from '../modules/keyboardListener.js'

/**
 * Fills the window with this template's content.
 *
 * @param {HTMLElement} parent - parent element.
 * @param {number} id - window id suffix.
 * @returns {void}.
 */
function template (parent, id) {
  parent.classList = 'wrapper memory-window'
  const header = parent.parentElement.children[0]

  const menuBox = document.createElement('DIV')
  menuBox.id = `memoryLeft_${id}`
  menuBox.classList = 'memory-left-menu left-menu wrapper'

  const memoryContent = document.createElement('DIV')
  memoryContent.id = `memoryRight_${id}`
  memoryContent.classList = 'memory-right-content'

  /**
   * Click event listener is only added to the game board, each individual
   * element contained within the board does not need its own event listener.
   */
  memoryContent.addEventListener('click', (e) => {
    // Parent => the card (since clicks are on the card faces)
    const parentId = e.target.parentElement.id

    // Only proceed if a card was clicked, ignore parent clicks
    if (parentId.length > 0) {
      let cardId
      if (parentId.charAt(parentId.length - 2) === '_') {
        cardId = parentId.substring(parentId.length - 1, parentId.length)
      } else cardId = parentId.substring(parentId.length - 2, parentId.length)

      Memory.clickCard(menuBox.id.substring(menuBox.id.length - 1, menuBox.id.length), cardId)
    }
  })

  parent.appendChild(menuBox)
  parent.appendChild(memoryContent)

  menu(id, memoryContent, menuBox, header)
}

/**
 * Adds the menu to the left side of the settings window.
 *
 * @param {number} id - window id suffix.
 * @param {HTMLElement} contentParent - parent element of the right side window area.
 * @param {HTMLElement} parent - parent element.
 * @param {HTMLElement} header - header part of the window.
 * @returns {void}.
 */
function menu (id, contentParent, parent, header) {
  // Fix incorrectness on firefox browsers
  const browserIsFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1

  let gridX = 4
  let gridY = 4

  parent.innerHTML = ''

  // RESTART BUTTON
  const menuItem1 = document.createElement('DIV')
  menuItem1.classList = 'wrapper memory-restart'
  menuItem1.id = `restart_${id}`
  parent.appendChild(menuItem1)

  const currId = menuItem1.id.substring(menuItem1.id.length - 1, menuItem1.id.length)

  Memory.newGame(currId)
  KeyboardListener.addOutputSource(id, Memory)

  const menuIcon1 = document.createElement('DIV')
  menuIcon1.classList = 'app-shortcut'
  menuIcon1.innerHTML = svgRestart
  menuItem1.appendChild(menuIcon1)

  const menuOption1 = document.createElement('H4')
  menuOption1.innerHTML = 'Restart'
  menuOption1.classList = 'no-select'
  menuItem1.appendChild(menuOption1)

  // GRID SIZE SELECTION BOX
  const gridSizeBox = document.createElement('DIV')
  if (browserIsFirefox) gridSizeBox.classList = 'wrapper memory-grid-size memory-grid-size-firefox'
  else gridSizeBox.classList = 'wrapper memory-grid-size'
  parent.appendChild(gridSizeBox)

  const gridSizeTitle = document.createElement('H4')
  gridSizeTitle.innerHTML = 'Grid size: '
  gridSizeTitle.classList = 'no-select'
  gridSizeBox.appendChild(gridSizeTitle)

  const gridSizeSelectContainer = document.createElement('DIV')
  gridSizeSelectContainer.classList = 'wrapper'
  gridSizeBox.appendChild(gridSizeSelectContainer)

  const gridSizeSelectText1 = document.createElement('P')
  gridSizeSelectText1.innerHTML = gridX
  gridSizeSelectContainer.appendChild(gridSizeSelectText1)

  const gridSizeSelectChange1 = document.createElement('SPAN')
  gridSizeSelectChange1.classList = 'wrapper memory-size-icons'
  gridSizeSelectContainer.appendChild(gridSizeSelectChange1)

  const gridSizeSelectPlus1 = document.createElement('SPAN')
  gridSizeSelectPlus1.innerHTML = svgPlus
  gridSizeSelectChange1.appendChild(gridSizeSelectPlus1)

  const gridSizeSelectMinus1 = document.createElement('SPAN')
  gridSizeSelectMinus1.innerHTML = svgMinus
  gridSizeSelectChange1.appendChild(gridSizeSelectMinus1)

  const gridSizeSelectText3 = document.createElement('span')
  gridSizeSelectText3.classList = 'memory-grid-size-times no-select'
  gridSizeSelectText3.innerHTML = 'x'
  gridSizeSelectContainer.appendChild(gridSizeSelectText3)

  const gridSizeSelectText2 = document.createElement('P')
  gridSizeSelectText2.innerHTML = gridY
  gridSizeSelectContainer.appendChild(gridSizeSelectText2)

  const gridSizeSelectChange2 = document.createElement('SPAN')
  gridSizeSelectChange2.classList = 'wrapper memory-size-icons'
  gridSizeSelectContainer.appendChild(gridSizeSelectChange2)

  const gridSizeSelectPlus2 = document.createElement('SPAN')
  gridSizeSelectPlus2.innerHTML = svgPlus
  gridSizeSelectChange2.appendChild(gridSizeSelectPlus2)

  const gridSizeSelectMinus2 = document.createElement('SPAN')
  gridSizeSelectMinus2.innerHTML = svgMinus
  gridSizeSelectChange2.appendChild(gridSizeSelectMinus2)

  // SCORE TEXT
  const menuItem4 = document.createElement('DIV')
  menuItem4.classList = 'wrapper'
  parent.appendChild(menuItem4)

  const menuOption4 = document.createElement('H4')
  menuOption4.id = `memoryMoves_${currId}`
  menuOption4.innerHTML = 'Moves: 0'
  menuOption4.classList = 'no-select'
  menuItem4.appendChild(menuOption4)

  // Menu event listeners
  menuItem1.addEventListener('click', () => {
    if (Memory.start(currId, gridX, gridY)) {
      menuOption4.innerHTML = 'Moves: 0'
      content(currId, contentParent, header, parent)
    } else console.log('could not be started')
  })

  gridSizeSelectPlus1.addEventListener('click', () => {
    gridX += 2

    if (!Memory.start(currId, gridX, gridY)) gridX -= 2
    else {
      menuOption4.innerHTML = 'Moves: 0'
      gridSizeSelectText1.innerHTML = gridX
      content(currId, contentParent, header, parent)
    }
  })

  gridSizeSelectMinus1.addEventListener('click', () => {
    gridX -= 2

    if (!Memory.start(currId, gridX, gridY)) gridX += 2
    else {
      menuOption4.innerHTML = 'Moves: 0'
      gridSizeSelectText1.innerHTML = gridX
      content(currId, contentParent, header, parent)
    }
  })

  gridSizeSelectPlus2.addEventListener('click', () => {
    gridY++

    if (!Memory.start(currId, gridX, gridY)) gridY--
    else {
      menuOption4.innerHTML = 'Moves: 0'
      gridSizeSelectText2.innerHTML = gridY
      content(currId, contentParent, header, parent)
    }
  })

  gridSizeSelectMinus2.addEventListener('click', () => {
    gridY--

    if (!Memory.start(currId, gridX, gridY)) gridY++
    else {
      menuOption4.innerHTML = 'Moves: 0'
      gridSizeSelectText2.innerHTML = gridY
      content(currId, contentParent, header, parent)
    }
  })

  Memory.start(currId, gridX, gridY)

  content(currId, contentParent, header, parent)
}

/**
 * Displays the available settings in the right area of the settings window.
 *
 * @param {number} parentId - window id suffix.
 * @param {HTMLElement} parent - parent element.
 * @param {HTMLElement} header - header part of the window.
 * @param {HTMLElement} menu - left side menu.
 * @returns {void}.
 */
function content (parentId, parent, header, menu) {
  parent.innerHTML = ''

  const gridSize = Memory.getGridSize(parentId)

  /**
   * The window's size, header's width and left side menu's height
   * are all set to fixed values based on the size of the game board.
   * This is done to make the window look better and fit the content snuggly,
   * as these elements did not properly resize on their own.
   *
   * Also, the width of the window determines how many cards fit horizontally.
   */
  parent.style.width = `${70 * gridSize.x}px`
  parent.style.height = `${70 * gridSize.y}px`
  header.style.width = `${170 + 70 * gridSize.x}px`
  menu.style.height = `${10 + 70 * gridSize.y}px`

  const cards = Memory.getCardArray(parentId)

  // Create the cards
  for (let index = 0; index < cards.length; index++) {
    const card = document.createElement('DIV')
    card.classList = 'memory-card no-select'
    card.id = `card_${parentId}_${index}`

    const cardFaceFront = document.createElement('IMG')
    cardFaceFront.classList = 'memory-card-face memory-card-face-front'
    cardFaceFront.setAttribute('src', '../pwd/img/memory/front.png')

    const cardFaceBack = document.createElement('IMG')
    cardFaceBack.classList = 'memory-card-face memory-card-face-back'
    cardFaceBack.setAttribute('src', `../pwd/img/memory/${cards[index]}.png`)

    card.appendChild(cardFaceFront)
    card.appendChild(cardFaceBack)

    parent.appendChild(card)
  }

  // Game ended message, only displayed after all card pairs are matched
  const gameEndTitle = document.createElement('H2')
  gameEndTitle.id = `memoryEnd_${parentId}`
  gameEndTitle.classList = 'memory-game-end'
  parent.appendChild(gameEndTitle)
}

const name = 'Memory'
const svg =
  '<svg xmlns:osb="http://www.openswatchbook.org/uri/2009/osb" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="116.58929mm" height="116.58929mm" viewBox="0 0 116.58929 116.58929" version="1.1" id="svg825" inkscape:version="0.92.5 (2060ec1f9f, 2020-04-08)" sodipodi:docname="memory-icon.svg"> <defs id="defs819"> <linearGradient inkscape:collect="always" id="linearGradient2937" osb:paint="gradient"> <stop style="stop-color:#000000;stop-opacity:1;" offset="0" id="stop2933" /> <stop style="stop-color:#000000;stop-opacity:0;" offset="1" id="stop2935" /> </linearGradient> <linearGradient id="linearGradient2915" osb:paint="solid"> <stop style="stop-color:#000000;stop-opacity:1;" offset="0" id="stop2913" /> </linearGradient> <linearGradient id="linearGradient1427" osb:paint="solid"> <stop style="stop-color:#000000;stop-opacity:1;" offset="0" id="stop1425" /> </linearGradient> </defs> <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666" borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2" inkscape:zoom="0.0875" inkscape:cx="-1295.98" inkscape:cy="952.41197" inkscape:document-units="mm" inkscape:current-layer="layer1" showgrid="false" inkscape:window-width="1920" inkscape:window-height="1017" inkscape:window-x="-8" inkscape:window-y="-8" inkscape:window-maximized="1" /> <metadata id="metadata822"> <rdf:RDF> <cc:Work rdf:about=""> <dc:format>image/svg+xml</dc:format> <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /> <dc:title></dc:title> </cc:Work> </rdf:RDF> </metadata> <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1" transform="translate(9.5367432e-7,-0.18871307)"> <rect style="fill:none;fill-opacity:1;  stroke-width:10;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;paint-order:normal" class="app-shortcut-path" id="rect1388-1" width="43.089287" height="43.089287" x="5" y="5.1887131" ry="6.8035712" /> <rect style="fill:none;fill-opacity:1;  stroke-width:10;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;paint-order:normal" class="app-shortcut-path" id="rect1388-1-5" width="43.089287" height="43.089287" x="68.500008" y="68.688721" ry="6.8035712" /> <rect style="  fill-opacity:1;  stroke-width:10;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;paint-order:normal" class="app-shortcut-filled" id="rect1388-1-3" width="43.089287" height="43.089287" x="68.500008" y="5.1887131" ry="6.8035712" /> <rect style="  fill-opacity:1;  stroke-width:10;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;paint-order:normal" class="app-shortcut-filled" id="rect1388-1-2" width="43.089287" height="43.089287" x="4.999999" y="68.688721" ry="6.8035712" /> </g> </svg> '
const svgRestart =
  '<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="56.328777mm" height="53.310844mm" viewBox="0 0 56.328777 53.310844" version="1.1" id="svg11169" inkscape:version="0.92.5 (2060ec1f9f, 2020-04-08)" sodipodi:docname="restart-icon.svg"> <defs id="defs11163" /> <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666" borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2" inkscape:zoom="0.7" inkscape:cx="-410.50077" inkscape:cy="112.50146" inkscape:document-units="mm" inkscape:current-layer="layer1" showgrid="false" inkscape:window-width="1920" inkscape:window-height="1017" inkscape:window-x="-8" inkscape:window-y="-8" inkscape:window-maximized="1" /> <metadata id="metadata11166"> <rdf:RDF> <cc:Work rdf:about=""> <dc:format>image/svg+xml</dc:format> <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /> <dc:title></dc:title> </cc:Work> </rdf:RDF> </metadata> <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1" transform="translate(-70.641972,-89.275122)"> <path style="fill:none;fill-opacity:1;  stroke-width:7;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;paint-order:markers stroke fill" class="app-shortcut-path" id="path11720" sodipodi:type="arc" sodipodi:cx="-125.09987" sodipodi:cy="-88.618126" sodipodi:rx="23.157955" sodipodi:ry="23.157955" sodipodi:start="0.068897047" sodipodi:end="5.3233066" sodipodi:open="true" d="m -101.99685,-87.023873 a 23.157955,23.157955 0 0 1 -18.76817,21.154373 23.157955,23.157955 0 0 1 -25.23257,-12.769843 23.157955,23.157955 0 0 1 5.93146,-27.650847 23.157955,23.157955 0 0 1 28.25011,-1.29713" transform="rotate(-166.18137)" /> <path style="fill:none;  stroke-width:7;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" class="app-shortcut-path" d="m 74.157796,96.404721 4.101347,12.462259 13.589862,-3.14025" id="path11722" inkscape:connector-curvature="0" sodipodi:nodetypes="ccc" /> </g> </svg>'
const svgPlus =
  '<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="100.28485mm" height="100.28485mm" viewBox="0 0 100.28485 100.28485" version="1.1" id="svg11730" inkscape:version="0.92.5 (2060ec1f9f, 2020-04-08)" sodipodi:docname="plus-icon.svg"> <defs id="defs11724" /> <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666" borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2" inkscape:zoom="0.35" inkscape:cx="-278.67749" inkscape:cy="263.09383" inkscape:document-units="mm" inkscape:current-layer="layer1" showgrid="false" inkscape:window-width="1920" inkscape:window-height="1017" inkscape:window-x="-8" inkscape:window-y="-8" inkscape:window-maximized="1" /> <metadata id="metadata11727"> <rdf:RDF> <cc:Work rdf:about=""> <dc:format>image/svg+xml</dc:format> <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /> <dc:title></dc:title> </cc:Work> </rdf:RDF> </metadata> <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1" transform="translate(-34.857575,-56.857575)"> <path style="fill:none;  stroke-width:20;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" class="app-shortcut-path" d="m 85,67 v 80" id="path12275" inkscape:connector-curvature="0" sodipodi:nodetypes="cc" /> <path style="fill:none;  stroke-width:20;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" class="app-shortcut-path" d="m 45,107.18049 80,-1.5e-4" id="path12277" inkscape:connector-curvature="0" sodipodi:nodetypes="cc" /> </g> </svg>'
const svgMinus =
  ' <svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="100.28485mm" height="100.28485mm" viewBox="0 0 100.28485 100.28485" version="1.1" id="svg11730" inkscape:version="0.92.5 (2060ec1f9f, 2020-04-08)" sodipodi:docname="minus-icon.svg"> <defs id="defs11724" /> <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666" borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2" inkscape:zoom="0.35" inkscape:cx="-278.67749" inkscape:cy="263.09383" inkscape:document-units="mm" inkscape:current-layer="layer1" showgrid="false" inkscape:window-width="1920" inkscape:window-height="1017" inkscape:window-x="-8" inkscape:window-y="-8" inkscape:window-maximized="1" /> <metadata id="metadata11727"> <rdf:RDF> <cc:Work rdf:about=""> <dc:format>image/svg+xml</dc:format> <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /> <dc:title></dc:title> </cc:Work> </rdf:RDF> </metadata> <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1" transform="translate(-34.857575,-56.857575)"> <path style="fill:none;  stroke-width:20;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" class="app-shortcut-path" d="m 45,107.18049 80,-1.5e-4" id="path12277" inkscape:connector-curvature="0" sodipodi:nodetypes="cc" /> </g> </svg> '

export default {
  template,
  name,
  svg
}

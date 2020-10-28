/**
 * Template module: creates the html elements for the Chat app.
 */

import Chat from '../modules/chat.js'
import Emojis from '../modules/emoji.js'

/**
 * Fills the window with this template's content.
 *
 * @param {HTMLElement} parent - The parent element.
 * @param {number} id - The window id suffix.
 * @returns {void}.
 */
function template (parent, id) {
  // Fix incorrectness on firefox browsers
  const browserIsFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1

  parent.classList.add('chat-window')
  parent.parentElement.children[0].style.width = '400px'

  // Menu settings button (expands settings)
  const menuExpCont = document.createElement('DIV')
  menuExpCont.id = `chatMenuExpander_${id}`
  menuExpCont.classList = 'chat-menu-button wrapper'
  parent.appendChild(menuExpCont)

  const menuExpIcon = document.createElement('DIV')
  menuExpIcon.classList = 'chat-menu-icon'
  menuExpIcon.innerHTML = settingsSvg
  menuExpCont.appendChild(menuExpIcon)

  const menuExpTitle = document.createElement('H5')
  menuExpTitle.innerHTML = 'Chat settings'
  menuExpTitle.classList = 'no-select'
  menuExpCont.appendChild(menuExpTitle)

  // Menu (username change, channel change)
  const menuBox = document.createElement('DIV')
  menuBox.id = `chatMenu_${id}`
  menuBox.classList = 'chat-menu expandable wrapper'
  parent.appendChild(menuBox)

  // Channel change item
  const channelChangeCont = document.createElement('DIV')
  channelChangeCont.id = `chatChannelMenu_${id}`
  channelChangeCont.classList = 'chat-menu-item chat-dropdown wrapper'
  menuBox.appendChild(channelChangeCont)

  const channelChangeIcon = document.createElement('DIV')
  channelChangeIcon.id = `chatChannelMenu_${id}`
  channelChangeIcon.classList = 'chat-menu-icon'
  channelChangeIcon.innerHTML = channelSvg
  channelChangeCont.appendChild(channelChangeIcon)

  const channelChangeTitle = document.createElement('H5')
  channelChangeTitle.id = `chatChannelMenu_${id}`
  channelChangeTitle.classList = 'no-select'
  channelChangeTitle.innerHTML = 'Channel:'
  channelChangeCont.appendChild(channelChangeTitle)

  const channelChangeInput = document.createElement('INPUT')
  channelChangeInput.type = 'text'
  channelChangeInput.id = `chatChannelInput_${id}`
  channelChangeInput.classList = 'chat-settings-input'
  channelChangeInput.value = 'channel'
  channelChangeCont.appendChild(channelChangeInput)

  // Username change item
  const userChangeCont = document.createElement('DIV')
  userChangeCont.id = `chatChannelMenu_${id}`
  userChangeCont.classList = 'chat-menu-item chat-dropdown wrapper'
  menuBox.appendChild(userChangeCont)

  const userChangeIcon = document.createElement('DIV')
  userChangeIcon.id = `chatChannelMenu_${id}`
  userChangeIcon.classList = 'chat-menu-icon'
  userChangeIcon.innerHTML = userSvg
  userChangeCont.appendChild(userChangeIcon)

  const userChangeTitle = document.createElement('H5')
  userChangeTitle.id = `chatChannelMenu_${id}`
  userChangeTitle.classList = 'no-select'
  userChangeTitle.innerHTML = 'Username:'
  userChangeCont.appendChild(userChangeTitle)

  const userChangeInput = document.createElement('INPUT')
  userChangeInput.type = 'text'
  userChangeInput.id = `chatUsernameInput_${id}`
  userChangeInput.value = 'name'
  userChangeInput.classList = 'chat-settings-input'
  userChangeCont.appendChild(userChangeInput)

  // Message log
  const chatBox = document.createElement('DIV')
  chatBox.id = `chatBox_${id}`
  chatBox.classList = 'chat-log expandable'
  parent.appendChild(chatBox)

  // Message input area
  const chatInputCont = document.createElement('DIV')
  chatInputCont.classList = 'chat-input-container'

  const chatInput = document.createElement('TEXTAREA')
  chatInput.name = `chatInput_${id}`
  chatInput.id = `chatInput_${id}`
  chatInput.placeholder = 'Message [channel]'
  if (browserIsFirefox) chatInput.classList = 'chat-input chat-input-firefox'
  else chatInput.classList = 'chat-input'
  chatInputCont.appendChild(chatInput)

  // Emoji menu
  const emojiArr = Emojis.getEmojiArray()
  const emojiMap = Emojis.getEmojiMap()

  const emojiButton = document.createElement('DIV')
  emojiButton.innerHTML = emojiArr[0].code
  emojiButton.classList = 'emoji-menu-button'

  const emojiMenu = document.createElement('DIV')
  emojiMenu.classList = 'emoji-menu hidden'

  const emojiCatMenu = document.createElement('DIV')
  emojiCatMenu.classList = 'emoji-category-menu'
  emojiMenu.appendChild(emojiCatMenu)

  const emojiCat1 = document.createElement('DIV')
  emojiCat1.innerHTML = emojiMap.get(':grinning-face:')
  emojiCat1.classList = 'emoji-item-smaller emoji-category-active'
  emojiCat1.id = `emojiMenuCat_${id}_1`
  emojiCatMenu.appendChild(emojiCat1)

  const emojiCat2 = document.createElement('DIV')
  emojiCat2.innerHTML = emojiMap.get(':frog:')
  emojiCat2.classList = 'emoji-item-smaller'
  emojiCat2.id = `emojiMenuCat_${id}_2`
  emojiCatMenu.appendChild(emojiCat2)

  const emojiCat3 = document.createElement('DIV')
  emojiCat3.innerHTML = emojiMap.get(':poultry-leg:')
  emojiCat3.classList = 'emoji-item-smaller'
  emojiCat3.id = `emojiMenuCat_${id}_3`
  emojiCatMenu.appendChild(emojiCat3)

  const emojiCat4 = document.createElement('DIV')
  emojiCat4.innerHTML = emojiMap.get(':globe-showing-Europe-Africa:')
  emojiCat4.classList = 'emoji-item-smaller'
  emojiCat4.id = `emojiMenuCat_${id}_4`
  emojiCatMenu.appendChild(emojiCat4)

  const emojiCat5 = document.createElement('DIV')
  emojiCat5.innerHTML = emojiMap.get(':american-football:')
  emojiCat5.classList = 'emoji-item-smaller'
  emojiCat5.id = `emojiMenuCat_${id}_5`
  emojiCatMenu.appendChild(emojiCat5)

  const emojiCat6 = document.createElement('DIV')
  emojiCat6.innerHTML = emojiMap.get(':AB-button-blood-type:')
  emojiCat6.classList = 'emoji-item-smaller'
  emojiCat6.id = `emojiMenuCat_${id}_6`
  emojiCatMenu.appendChild(emojiCat6)

  const scrollPos1 = 2650
  const scrollPos2 = 3425
  const scrollPos3 = 4610
  const scrollPos4 = 5385
  const scrollPos5 = 7185

  const catElements = [emojiCat1, emojiCat2, emojiCat3, emojiCat4, emojiCat5, emojiCat6]

  // Update the category select items to display where in the menu you are currently
  emojiMenu.addEventListener('scroll', () => {
    catElements.forEach((e) => {
      e.classList.remove('emoji-category-active')
    })
    const scrollPos = emojiMenu.scrollTop
    if (scrollPos < scrollPos1 - 1) {
      catElements[0].classList.add('emoji-category-active')
    } else if (scrollPos > scrollPos1 - 1 && scrollPos < scrollPos2 - 1) {
      catElements[1].classList.add('emoji-category-active')
    } else if (scrollPos > scrollPos2 - 1 && scrollPos < scrollPos3 - 1) {
      catElements[2].classList.add('emoji-category-active')
    } else if (scrollPos > scrollPos3 - 1 && scrollPos < scrollPos4 - 1) {
      catElements[3].classList.add('emoji-category-active')
    } else if (scrollPos > scrollPos4 - 1 && scrollPos < scrollPos5 - 1) {
      catElements[4].classList.add('emoji-category-active')
    } else {
      catElements[5].classList.add('emoji-category-active')
    }
  })

  // Make the menu scroll to where the selected category of emojis start
  emojiCatMenu.addEventListener('click', (e) => {
    const clickId = e.target.id
    const num = clickId.substring(clickId.length - 1, clickId.length)

    let scrollTo = 0
    switch (num) {
      case '1':
        scrollTo = 0
        break
      case '2':
        scrollTo = scrollPos1
        break
      case '3':
        scrollTo = scrollPos2
        break
      case '4':
        scrollTo = scrollPos3
        break
      case '5':
        scrollTo = scrollPos4
        break
      case '6':
        scrollTo = scrollPos5
        break
    }
    emojiMenu.scroll({
      top: scrollTo,
      left: 0,
      behavior: 'smooth'
    })
  })

  // Add ALL the emojis to the menu, as well as some category titles
  for (let i = 0; i < emojiArr.length; i++) {
    // Category titles after a certain amount of emoji have been added
    if (i === 0 || i === 458 || i === 585 || i === 785 || i === 916 || i === 1226) {
      const category = document.createElement('H5')
      category.classList = 'emoji-category-title'
      switch (i) {
        case 0:
          category.innerHTML = 'Smileys & People'
          break
        case 458:
          category.innerHTML = 'Animals & Nature'
          break
        case 585:
          category.innerHTML = 'Food & Drinks'
          break
        case 785:
          category.innerHTML = 'Travel & Places'
          break
        case 916:
          category.innerHTML = 'Activities & Objects'
          break
        case 1226:
          category.innerHTML = 'Symbols & Flags'
          break
      }
      emojiMenu.appendChild(category)
    }

    // Add the next emoji to the menu
    const element = emojiArr[i]

    const emojiItem = document.createElement('DIV')
    emojiItem.innerHTML = element.code
    emojiItem.classList = 'emoji-item'
    emojiMenu.appendChild(emojiItem)

    // Clicking on an emoji adds it to the chat box
    emojiItem.addEventListener('click', () => {
      chatInput.value = chatInput.value + element.name
      emojiMenu.classList.add('hidden')
    })
  }

  // Show/hide the emoji pop-up menu
  emojiButton.addEventListener('click', () => {
    emojiMenu.classList.toggle('hidden')
  })

  chatInputCont.appendChild(emojiButton)
  chatInputCont.appendChild(emojiMenu)
  parent.appendChild(chatInputCont)

  Chat.newChat(id, chatInput, channelChangeInput, userChangeInput, chatBox)

  // Expand the chat settings menu
  menuExpCont.addEventListener('click', () => {
    var div = menuBox
    var div2 = chatBox
    if (div.clientHeight) {
      div.style.height = 0
      div2.style.height = '450px'
    } else {
      div.style.height = div.scrollHeight + 'px'
      div2.style.height = 450 - div.scrollHeight + 'px'
    }
  })
}

const name = 'Chat'
const svg =
  '<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="84.630463mm" height="74.28167mm" viewBox="0 0 84.630463 74.28167" version="1.1" id="svg6737" inkscape:version="0.92.5 (2060ec1f9f, 2020-04-08)" sodipodi:docname="chat-icon.svg"> <defs id="defs6731"> <inkscape:path-effect effect="bspline" id="path-effect7296" is_visible="true" weight="33.333333" steps="2" helper_size="0" apply_no_weight="true" apply_with_weight="true" only_selected="false" /> </defs> <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666" borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2" inkscape:zoom="0.7" inkscape:cx="110.49857" inkscape:cy="104.50306" inkscape:document-units="mm" inkscape:current-layer="layer1" showgrid="false" inkscape:window-width="1920" inkscape:window-height="1017" inkscape:window-x="-8" inkscape:window-y="-8" inkscape:window-maximized="1" /> <metadata id="metadata6734"> <rdf:RDF> <cc:Work rdf:about=""> <dc:format>image/svg+xml</dc:format> <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /> <dc:title></dc:title> </cc:Work> </rdf:RDF> </metadata> <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1" transform="translate(-2.9936419,-5.4378991)"> <path style="fill:none; stroke-width:10;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" class="app-shortcut-path" d="m 7.9936419,43.824428 c 0,-22.292291 12.3999181,-33.9336542 39.6592271,-33.36669 27.259309,0.566964 39.738228,24.617095 33.122882,44.705976 -3.934081,11.946661 1.856511,19.567542 1.856511,19.567542 0,0 -6.334713,-9.546844 -23.82909,-6.563603 C 31.397831,72.840966 7.9936419,65.523387 7.9936419,43.824428 Z" id="path7300" inkscape:connector-curvature="0" sodipodi:nodetypes="szscss" /> </g> </svg> '
const channelSvg =
  '<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="117.35798mm" height="107.43583mm" viewBox="0 0 117.35798 107.43583" version="1.1" id="svg8" inkscape:version="0.92.5 (2060ec1f9f, 2020-04-08)" sodipodi:docname="channel-icon.svg"> <defs id="defs2" /> <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666" borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2" inkscape:zoom="0.35" inkscape:cx="256.09438" inkscape:cy="241.30176" inkscape:document-units="mm" inkscape:current-layer="layer1" showgrid="false" inkscape:window-width="1920" inkscape:window-height="1017" inkscape:window-x="-8" inkscape:window-y="-8" inkscape:window-maximized="1" /> <metadata id="metadata5"> <rdf:RDF> <cc:Work rdf:about=""> <dc:format>image/svg+xml</dc:format> <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /> <dc:title></dc:title> </cc:Work> </rdf:RDF> </metadata> <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1" transform="translate(-36.130848,-72.436843)"> <path style="fill:none;stroke-width:16;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="M 78.619048,80.041667 60.47619,172.26785" id="path815" inkscape:connector-curvature="0" /> <path style="fill:none;stroke-width:16;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="M 126.24406,80.041667 108.1012,172.26785" id="path815-5" inkscape:connector-curvature="0" /> <path style="fill:none;stroke-width:16;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="M 145.88201,106.35976 H 49.029334" id="path815-8" inkscape:connector-curvature="0" sodipodi:nodetypes="cc" /> <path style="fill:none;stroke-width:16;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="M 140.59035,143.40145 H 43.737667" id="path815-8-4" inkscape:connector-curvature="0" sodipodi:nodetypes="cc" /> </g> </svg>'
const userSvg =
  '<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="121.79096mm" height="142.10597mm" viewBox="0 0 121.79096 142.10597" version="1.1" id="svg895" inkscape:version="0.92.5 (2060ec1f9f, 2020-04-08)" sodipodi:docname="user-icon.svg"> <defs id="defs889" /> <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666" borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2" inkscape:zoom="0.49497475" inkscape:cx="-582.60678" inkscape:cy="-88.91328" inkscape:document-units="mm" inkscape:current-layer="layer1" showgrid="false" inkscape:window-width="1920" inkscape:window-height="1017" inkscape:window-x="-8" inkscape:window-y="-8" inkscape:window-maximized="1" /> <metadata id="metadata892"> <rdf:RDF> <cc:Work rdf:about=""> <dc:format>image/svg+xml</dc:format> <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /> <dc:title></dc:title> </cc:Work> </rdf:RDF> </metadata> <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1" transform="translate(-32.465121,-49.857529)"> <circle style="fill:none;fill-opacity:1; stroke-width:22;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;paint-order:markers stroke fill" id="path1442" cx="92.741722" cy="88.729553" r="32.931606" /> <path style="fill:none; stroke-width:22;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="M 37.797618,186.631 H 148.92262 c 0,0 0.77869,-63.53804 -58.051773,-63.53804 -52.749329,0 -53.073229,63.53804 -53.073229,63.53804 z" id="path1444" inkscape:connector-curvature="0" sodipodi:nodetypes="ccsc" /> </g> </svg>'
const settingsSvg =
  '<svg xmlns:osb="http://www.openswatchbook.org/uri/2009/osb" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="107.24085mm" height="102.42187mm" viewBox="0 0 107.24085 102.42187" version="1.1" id="svg7308" inkscape:version="0.92.5 (2060ec1f9f, 2020-04-08)" sodipodi:docname="settings-icon.svg"> <defs id="defs7302"> <linearGradient id="linearGradient8216" osb:paint="solid"> <stop style="stop-color:#000000;stop-opacity:1;" offset="0" id="stop8214" /> </linearGradient> <marker inkscape:stockid="Arrow1Lstart" orient="auto" refY="0" refX="0" id="Arrow1Lstart" style="overflow:visible" inkscape:isstock="true"> <path id="path7908" d="M 0,0 5,-5 -12.5,0 5,5 Z" style="fill:#000000;fill-opacity:1;fill-rule:evenodd; stroke-width:1.00000003pt;stroke-opacity:1" class="app-shortcut-path" transform="matrix(0.8,0,0,0.8,10,0)" inkscape:connector-curvature="0" /> </marker> </defs> <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666" borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2" inkscape:zoom="0.24748737" inkscape:cx="-493.44249" inkscape:cy="293.49607" inkscape:document-units="mm" inkscape:current-layer="layer1" showgrid="false" inkscape:window-width="1920" inkscape:window-height="1017" inkscape:window-x="-8" inkscape:window-y="-8" inkscape:window-maximized="1" /> <metadata id="metadata7305"> <rdf:RDF> <cc:Work rdf:about=""> <dc:format>image/svg+xml</dc:format> <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /> <dc:title></dc:title> </cc:Work> </rdf:RDF> </metadata> <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1" transform="translate(-58.891018,-59.109408)"> <ellipse style="fill:none;fill-opacity:1; stroke-width:18.20607376;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:18.2060721, 36.41214419;stroke-dashoffset:0;stroke-opacity:1;paint-order:normal" class="app-shortcut-path" id="path7868" cy="143.3322" cx="65.899155" rx="45.528831" ry="42.696896" transform="rotate(-20.448359)" /> <path style="fill:none;fill-opacity:1; stroke-width:10;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;paint-order:normal" class="app-shortcut-path" id="path7868-7" r="31.1369" cy="85.723442" cx="151.14091" d="" inkscape:connector-curvature="0" /> <path style="fill:none;fill-opacity:1; stroke-width:10;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;paint-order:normal" class="app-shortcut-path" id="path7868-2" r="31.1369" cy="85.723442" cx="151.14091" d="" inkscape:connector-curvature="0" /> <circle style="fill:none;fill-opacity:1; stroke-width:21.99300003;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;paint-order:markers fill stroke" class="app-shortcut-path" id="path8352" cx="110.74668" cy="111.20183" r="32.543846" /> </g> </svg>'

export default {
  template,
  name,
  svg
}

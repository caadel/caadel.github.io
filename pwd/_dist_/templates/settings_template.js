/**
 * Template module: creates the html elements for the Settings app.
 *
 * A bit messy and inefficient, might revisit at a later date.
 */

import Settings from '../modules/settings.js'

/**
 * Fills the window with this template's content.
 *
 * @param {HTMLElement} parent - parent element.
 * @param {number} id - window id suffix.
 * @returns {void}.
 */
function template (parent, id) {
  parent.classList.remove('window-content')

  const menuBox = document.createElement('DIV')
  menuBox.id = `settingLeft_${id}`
  menuBox.classList = 'settings-left-menu left-menu wrapper'

  const settingsContent = document.createElement('DIV')
  settingsContent.id = `settingRight_${id}`
  settingsContent.classList = 'settings-right-content'

  parent.appendChild(menuBox)
  parent.appendChild(settingsContent)

  menu(id, settingsContent, menuBox)

  updateContent(Settings.SettingCategory.GENERAL, id, settingsContent)
}

/**
 * Adds the menu to the left side of the settings window.
 *
 * @param {number} id - window id suffix.
 * @param {HTMLElement} contentParent - parent element of the right side window area.
 * @param {HTMLElement} parent - parent element.
 * @returns {void}.
 */
function menu (id, contentParent, parent) {
  parent.innerHTML = ''

  // MENU ITEM 1 (GENERAL)
  const menuItem1 = document.createElement('DIV')
  menuItem1.classList = 'wrapper settings-left-menu-active'
  parent.appendChild(menuItem1)

  const menuIcon1 = document.createElement('DIV')
  menuIcon1.classList = 'app-shortcut'
  menuIcon1.innerHTML = svg
  menuItem1.appendChild(menuIcon1)

  const menuOption1 = document.createElement('H4')
  menuOption1.innerHTML = Settings.SettingCategory.GENERAL
  menuOption1.classList = 'no-select'
  menuItem1.appendChild(menuOption1)

  // MENU ITEM 2 (DATE & TIME)
  const menuItem2 = document.createElement('DIV')
  menuItem2.classList = 'wrapper'
  parent.appendChild(menuItem2)

  const menuIcon2 = document.createElement('DIV')
  menuIcon2.classList = 'app-shortcut'
  menuIcon2.innerHTML = svgTime
  menuItem2.appendChild(menuIcon2)

  const menuOption2 = document.createElement('H4')
  menuOption2.innerHTML = Settings.SettingCategory.DATE_TIME
  menuOption2.classList = 'no-select'
  menuItem2.appendChild(menuOption2)

  // MENU ITEM 3 (DESKTOP)
  const menuItem3 = document.createElement('DIV')
  menuItem3.classList = 'wrapper'
  parent.appendChild(menuItem3)

  const menuIcon3 = document.createElement('DIV')
  menuIcon3.classList = 'app-shortcut'
  menuIcon3.innerHTML = svgDesktop
  menuItem3.appendChild(menuIcon3)

  const menuOption3 = document.createElement('H4')
  menuOption3.innerHTML = Settings.SettingCategory.DESKTOP
  menuOption3.classList = 'no-select'
  menuItem3.appendChild(menuOption3)

  // Add click events to each menu item
  menuItem1.addEventListener('click', () => {
    menuItem1.classList.add('settings-left-menu-active')
    menuItem2.classList.remove('settings-left-menu-active')
    menuItem3.classList.remove('settings-left-menu-active')
    updateContent(Settings.SettingCategory.GENERAL, id, contentParent)
  })
  menuItem2.addEventListener('click', () => {
    menuItem1.classList.remove('settings-left-menu-active')
    menuItem2.classList.add('settings-left-menu-active')
    menuItem3.classList.remove('settings-left-menu-active')
    updateContent(Settings.SettingCategory.DATE_TIME, id, contentParent)
  })
  menuItem3.addEventListener('click', () => {
    menuItem1.classList.remove('settings-left-menu-active')
    menuItem2.classList.remove('settings-left-menu-active')
    menuItem3.classList.add('settings-left-menu-active')
    updateContent(Settings.SettingCategory.DESKTOP, id, contentParent)
  })
}

/**
 * Displays the available settings in the right area of the settings window.
 *
 * @param {string} category - the Settings.SettingCategory.
 * @param {number} id - window id suffix.
 * @param {HTMLElement} parent - parent element.
 * @returns {void}.
 */
function updateContent (category, id, parent) {
  parent.innerHTML = ''

  const contentTitle1 = document.createElement('H2')
  contentTitle1.innerHTML = category
  parent.appendChild(contentTitle1)

  switch (category) {
    case Settings.SettingCategory.DESKTOP: {
      // TOPIC 1 (Background image)
      const topic1 = document.createElement('H3')
      topic1.innerHTML = 'Background image'
      parent.appendChild(topic1)

      const fileInputLabel = document.createElement('LABEL')
      fileInputLabel.classList = 'settings-background-label no-select'
      fileInputLabel.innerHTML = 'Choose file'
      fileInputLabel.setAttribute('for', `backgroundUploader_${id}`)
      parent.appendChild(fileInputLabel)

      const fileInput = document.createElement('INPUT')
      fileInput.classList = 'settings-background-input'
      fileInput.type = 'file'
      fileInput.id = `backgroundUploader_${id}`

      parent.appendChild(fileInput)

      fileInput.addEventListener('change', () => {
        Settings.uploadBackgroundImage(fileInput.id)
      })

      const clearButton = document.createElement('Button')
      clearButton.classList = 'settings-clear no-select'
      clearButton.innerHTML = 'Clear image'
      clearButton.addEventListener('click', () => {
        Settings.clearBackgroundImage()
      })

      parent.appendChild(clearButton)

      // TOPIC 2 (Background repeating style)
      const topic2 = document.createElement('H3')
      topic2.innerHTML = 'Background style'
      parent.appendChild(topic2)

      const radioContainer1 = document.createElement('LABEL')
      radioContainer1.classList = 'radio-container'
      radioContainer1.innerHTML = 'Fill screen'
      parent.appendChild(radioContainer1)

      const radio1 = document.createElement('INPUT')
      radio1.type = 'radio'
      radio1.name = `radioGroup_${id}`
      radio1.classList = 'radio-fill'

      radio1.addEventListener('change', () => {
        Settings.setBackgroundStyle(Settings.BackgroundStyle.COVER)

        const radios = document.getElementsByClassName('radio-fill')
        for (let index = 0; index < radios.length; index++) radios[index].checked = true
      })
      radioContainer1.appendChild(radio1)

      const radioCheck1 = document.createElement('SPAN')
      radioCheck1.classList = 'checkmark'
      radioContainer1.appendChild(radioCheck1)

      const radioContainer2 = document.createElement('LABEL')
      radioContainer2.classList = 'radio-container'
      radioContainer2.innerHTML = 'Repeating '
      parent.appendChild(radioContainer2)

      const radio2 = document.createElement('INPUT')
      radio2.type = 'radio'
      radio2.name = `radioGroup_${id}`
      radio2.classList = 'radio-repeat'
      radio2.addEventListener('change', () => {
        Settings.setBackgroundStyle(Settings.BackgroundStyle.REPEAT)

        const radios = document.getElementsByClassName('radio-repeat')
        for (let index = 0; index < radios.length; index++) radios[index].checked = true
      })
      radioContainer2.appendChild(radio2)

      const radioCheck2 = document.createElement('SPAN')
      radioCheck2.classList = 'checkmark'
      radioContainer2.appendChild(radioCheck2)

      if (Settings.getBackgroundStyle() === Settings.BackgroundStyle.COVER) {
        radio1.setAttribute('checked', 'checked')
        Settings.setBackgroundStyle(Settings.BackgroundStyle.COVER)
      } else if (Settings.getBackgroundStyle() === Settings.BackgroundStyle.REPEAT) {
        radio2.setAttribute('checked', 'checked')
        Settings.setBackgroundStyle(Settings.BackgroundStyle.REPEAT)
      }

      break
    }
    case Settings.SettingCategory.GENERAL: {
      // TOPIC 1 (App shortcuts)
      const topic1 = document.createElement('H3')
      topic1.innerHTML = 'App shortcuts'
      parent.appendChild(topic1)

      const switchContainer1 = document.createElement('DIV')
      switchContainer1.classList = 'wrapper switch-container'

      const switch1 = document.createElement('LABEL')
      switch1.classList = 'switch'
      switchContainer1.appendChild(switch1)

      const switch1checkbox = document.createElement('INPUT')
      switch1checkbox.type = 'checkbox'
      switch1checkbox.classList = 'switch-borders'
      if (Settings.getShortcutStyle().default === Settings.ShortcutStyle.BORDER) { switch1checkbox.checked = true }

      switch1.appendChild(switch1checkbox)

      switch1checkbox.addEventListener('change', () => {
        const switches = document.getElementsByClassName('switch-borders')

        if (switch1checkbox.checked) {
          Settings.setShortcutStyle(Settings.ShortcutStyle.BORDER)
          for (let index = 0; index < switches.length; index++) switches[index].checked = true
        } else {
          Settings.setShortcutStyle(Settings.ShortcutStyle.NO_BORDER)
          for (let index = 0; index < switches.length; index++) switches[index].checked = false
        }
      })

      const switch1span = document.createElement('SPAN')
      switch1span.classList = 'slider'
      switch1.appendChild(switch1span)

      const switch1text = document.createElement('p')
      switch1text.innerHTML = 'Display borders'
      switchContainer1.appendChild(switch1text)

      parent.appendChild(switchContainer1)

      // TOPIC 2 (Reset settings)
      const topic2 = document.createElement('H3')
      topic2.innerHTML = 'Saved data'
      parent.appendChild(topic2)

      const clearButton = document.createElement('Button')
      clearButton.classList = 'settings-clear settings-clear-general no-select'
      clearButton.innerHTML = 'Reset settings'
      clearButton.addEventListener('click', () => {
        Settings.clearSettings()

        // Reset all settings in all open windows, without this no visual change in the app can be seen
        const radiosF = document.getElementsByClassName('radio-fill')
        const radiosR = document.getElementsByClassName('radio-repeat')
        const switchesB = document.getElementsByClassName('switch-borders')
        const switchesM = document.getElementsByClassName('switch-month')
        const switchesD = document.getElementsByClassName('switch-dashes')
        const switchesS = document.getElementsByClassName('switch-seconds')

        for (let index = 0; index < radiosF.length; index++) {
          radiosF[index].checked = true
          radiosR[index].checked = false
        }

        for (let index = 0; index < switchesB.length; index++) switchesB[index].checked = false

        for (let index = 0; index < switchesM.length; index++) {
          switchesM[index].checked = false
          switchesD[index].checked = true
          switchesS[index].checked = true
        }
      })
      parent.appendChild(clearButton)

      const clearButton2 = document.createElement('Button')
      clearButton2.classList = 'settings-clear settings-clear-general no-select'
      clearButton2.innerHTML = 'Clear local storage'
      clearButton2.addEventListener('click', () => {
        Settings.clearStorage()
      })
      parent.appendChild(clearButton2)

      break
    }
    case Settings.SettingCategory.DATE_TIME: {
      // TOPIC 1 (date format)
      const topic1 = document.createElement('H3')
      topic1.innerHTML = 'Date format'
      parent.appendChild(topic1)

      // SWITCH 1_1 (month format)
      const switchContainer11 = document.createElement('DIV')
      switchContainer11.classList = 'wrapper switch-container'

      const switch11 = document.createElement('LABEL')
      switch11.classList = 'switch'
      switchContainer11.appendChild(switch11)

      const switchCheckbox11 = document.createElement('INPUT')
      switchCheckbox11.type = 'checkbox'
      switchCheckbox11.classList = 'switch-month'
      if (
        Settings.getDateFormat() === Settings.DateFormat.MONTH_FIRST ||
        Settings.getDateFormat() === Settings.DateFormat.MONTH_FIRST_DASH
      ) { switchCheckbox11.checked = true }

      switch11.appendChild(switchCheckbox11)

      const switchSpan11 = document.createElement('SPAN')
      switchSpan11.classList = 'slider'
      switch11.appendChild(switchSpan11)

      const switchText11 = document.createElement('p')
      switchText11.innerHTML = 'Use month/day/year'
      switchContainer11.appendChild(switchText11)

      parent.appendChild(switchContainer11)

      // SWITCH 1_2 (dashes or slashes)
      const switchContainer12 = document.createElement('DIV')
      switchContainer12.classList = 'wrapper switch-container'

      const switch12 = document.createElement('LABEL')
      switch12.classList = 'switch'
      switchContainer12.appendChild(switch12)

      const switchCheckbox12 = document.createElement('INPUT')
      switchCheckbox12.type = 'checkbox'
      switchCheckbox12.classList = 'switch-dashes'
      if (
        Settings.getDateFormat() === Settings.DateFormat.MONTH_FIRST ||
        Settings.getDateFormat() === Settings.DateFormat.STANDARD
      ) { switchCheckbox12.checked = true }

      switch12.appendChild(switchCheckbox12)

      const switchSpan12 = document.createElement('SPAN')
      switchSpan12.classList = 'slider'
      switch12.appendChild(switchSpan12)

      const switchText12 = document.createElement('p')
      switchText12.innerHTML = 'Separate using "/"'
      switchContainer12.appendChild(switchText12)

      // Topic 1 event listeners
      const checkBoxArr = [switchCheckbox11, switchCheckbox12]

      // This could be done much more efficiently
      checkBoxArr.forEach(function (e) {
        e.addEventListener('change', () => {
          const switchesMonth = document.getElementsByClassName('switch-month')
          const switchesDashes = document.getElementsByClassName('switch-dashes')

          if (switchCheckbox11.checked) {
            for (let index = 0; index < switchesMonth.length; index++) { switchesMonth[index].checked = true }

            if (switchCheckbox12.checked) {
              Settings.setDateFormat(Settings.DateFormat.MONTH_FIRST)
              for (let index = 0; index < switchesDashes.length; index++) { switchesDashes[index].checked = true }
            } else {
              Settings.setDateFormat(Settings.DateFormat.MONTH_FIRST_DASH)

              for (let index = 0; index < switchesMonth.length; index++) { switchesMonth[index].checked = true }

              for (let index = 0; index < switchesDashes.length; index++) { switchesDashes[index].checked = false }
            }
          } else if (switchCheckbox12.checked) {
            Settings.setDateFormat(Settings.DateFormat.STANDARD)
            for (let index = 0; index < switchesMonth.length; index++) { switchesMonth[index].checked = false }

            for (let index = 0; index < switchesDashes.length; index++) { switchesDashes[index].checked = true }
          } else {
            Settings.setDateFormat(Settings.DateFormat.STANDARD_DASH)
            for (let index = 0; index < switchesMonth.length; index++) { switchesMonth[index].checked = false }

            for (let index = 0; index < switchesDashes.length; index++) { switchesDashes[index].checked = false }
          }
        })
      })

      parent.appendChild(switchContainer11)
      parent.appendChild(switchContainer12)

      // TOPIC 2 (time format)
      const topic2 = document.createElement('H3')
      topic2.innerHTML = 'Time format'
      parent.appendChild(topic2)

      const switchContainer2 = document.createElement('DIV')
      switchContainer2.classList = 'wrapper switch-container'

      const switch2 = document.createElement('LABEL')
      switch2.classList = 'switch'
      switchContainer2.appendChild(switch2)

      const switch2checkbox = document.createElement('INPUT')
      switch2checkbox.type = 'checkbox'
      switch2checkbox.classList = 'switch-seconds'
      if (Settings.getClockUsesSeconds()) switch2checkbox.checked = true
      switch2.appendChild(switch2checkbox)

      switch2checkbox.addEventListener('change', () => {
        const switches = document.getElementsByClassName('switch-seconds')
        if (switch2checkbox.checked) {
          Settings.setClockUsesSeconds(true)
          for (let index = 0; index < switches.length; index++) switches[index].checked = true
        } else {
          Settings.setClockUsesSeconds(false)
          for (let index = 0; index < switches.length; index++) switches[index].checked = false
        }
      })

      const switch2span = document.createElement('SPAN')
      switch2span.classList = 'slider'
      switch2.appendChild(switch2span)

      const switch2text = document.createElement('p')
      switch2text.innerHTML = 'Clock displays seconds'
      switchContainer2.appendChild(switch2text)

      parent.appendChild(switchContainer2)

      break
    }
  }
}

const name = 'Settings'

const svg =
  '<svg xmlns:osb="http://www.openswatchbook.org/uri/2009/osb" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="107.24085mm" height="102.42187mm" viewBox="0 0 107.24085 102.42187" version="1.1" id="svg7308" inkscape:version="0.92.5 (2060ec1f9f, 2020-04-08)" sodipodi:docname="settings-icon.svg"> <defs id="defs7302"> <linearGradient id="linearGradient8216" osb:paint="solid"> <stop style="stop-color:#000000;stop-opacity:1;" offset="0" id="stop8214" /> </linearGradient> <marker inkscape:stockid="Arrow1Lstart" orient="auto" refY="0" refX="0" id="Arrow1Lstart" style="overflow:visible" inkscape:isstock="true"> <path id="path7908" d="M 0,0 5,-5 -12.5,0 5,5 Z" style="fill:#000000;fill-opacity:1;fill-rule:evenodd; stroke-width:1.00000003pt;stroke-opacity:1" class="app-shortcut-path" transform="matrix(0.8,0,0,0.8,10,0)" inkscape:connector-curvature="0" /> </marker> </defs> <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666" borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2" inkscape:zoom="0.24748737" inkscape:cx="-493.44249" inkscape:cy="293.49607" inkscape:document-units="mm" inkscape:current-layer="layer1" showgrid="false" inkscape:window-width="1920" inkscape:window-height="1017" inkscape:window-x="-8" inkscape:window-y="-8" inkscape:window-maximized="1" /> <metadata id="metadata7305"> <rdf:RDF> <cc:Work rdf:about=""> <dc:format>image/svg+xml</dc:format> <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /> <dc:title></dc:title> </cc:Work> </rdf:RDF> </metadata> <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1" transform="translate(-58.891018,-59.109408)"> <ellipse style="fill:none;fill-opacity:1; stroke-width:18.20607376;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:18.2060721, 36.41214419;stroke-dashoffset:0;stroke-opacity:1;paint-order:normal" class="app-shortcut-path" id="path7868" cy="143.3322" cx="65.899155" rx="45.528831" ry="42.696896" transform="rotate(-20.448359)" /> <path style="fill:none;fill-opacity:1; stroke-width:10;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;paint-order:normal" class="app-shortcut-path" id="path7868-7" r="31.1369" cy="85.723442" cx="151.14091" d="" inkscape:connector-curvature="0" /> <path style="fill:none;fill-opacity:1; stroke-width:10;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;paint-order:normal" class="app-shortcut-path" id="path7868-2" r="31.1369" cy="85.723442" cx="151.14091" d="" inkscape:connector-curvature="0" /> <circle style="fill:none;fill-opacity:1; stroke-width:21.99300003;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;paint-order:markers fill stroke" class="app-shortcut-path" id="path8352" cx="110.74668" cy="111.20183" r="32.543846" /> </g> </svg> '

// Settings category icons
const svgDesktop =
  '<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="100.06954mm" height="83.870354mm" viewBox="0 0 100.06954 83.870354" version="1.1" id="svg10043" inkscape:version="0.92.5 (2060ec1f9f, 2020-04-08)" sodipodi:docname="dekstop-icon.svg"> <defs id="defs10037" /> <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666" borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2" inkscape:zoom="0.98994949" inkscape:cx="-53.924072" inkscape:cy="176.27281" inkscape:document-units="mm" inkscape:current-layer="layer1" showgrid="false" inkscape:window-width="1920" inkscape:window-height="1017" inkscape:window-x="-8" inkscape:window-y="-8" inkscape:window-maximized="1" /> <metadata id="metadata10040"> <rdf:RDF> <cc:Work rdf:about=""> <dc:format>image/svg+xml</dc:format> <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /> <dc:title></dc:title> </cc:Work> </rdf:RDF> </metadata> <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1" transform="translate(-49.256,-52.793773)"> <path style="fill:none;  stroke-width:10;stroke-linecap:square;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" class="app-shortcut-path" d="m 54.256,57.793773 h 90.06954 V 112.04948 H 54.256 Z" id="path10590" inkscape:connector-curvature="0" sodipodi:nodetypes="ccccc" /> <path style="fill:none;  stroke-width:7;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" class="app-shortcut-path" d="M 71.093694,133.16378 H 124.28033" id="path10592" inkscape:connector-curvature="0" /> <path style="fill:none;  stroke-width:7;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" class="app-shortcut-path" d="M 97.018836,133.16378 V 114.98945" id="path10594" inkscape:connector-curvature="0" /> </g> </svg>'
const svgTime =
  '<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="129.52679mm" height="129.52679mm" viewBox="0 0 129.52679 129.52679" version="1.1" id="svg9488" inkscape:version="0.92.5 (2060ec1f9f, 2020-04-08)" sodipodi:docname="time-icon.svg"> <defs id="defs9482" /> <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666" borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2" inkscape:zoom="0.7" inkscape:cx="-70.852024" inkscape:cy="274.2699" inkscape:document-units="mm" inkscape:current-layer="layer1" showgrid="false" inkscape:window-width="1920" inkscape:window-height="1017" inkscape:window-x="-8" inkscape:window-y="-8" inkscape:window-maximized="1" /> <metadata id="metadata9485"> <rdf:RDF> <cc:Work rdf:about=""> <dc:format>image/svg+xml</dc:format> <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /> <dc:title></dc:title> </cc:Work> </rdf:RDF> </metadata> <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1" transform="translate(-32.565479,-80.47916)"> <circle style="fill:none;fill-opacity:1;  stroke-width:15;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;paint-order:markers fill stroke" class="app-shortcut-path" id="path10033" cx="97.328873" cy="145.24255" r="57.263393" /> <path style="fill:none;  stroke-width:10;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" class="app-shortcut-path" d="m 96.383926,110.65774 v 41.57738 l 20.788694,10.96131" id="path10035" inkscape:connector-curvature="0" sodipodi:nodetypes="ccc" /> </g> </svg>'

export default {
  template,
  name,
  svg
}

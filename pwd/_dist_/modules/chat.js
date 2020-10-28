/**
 * Chat application logic.
 *
 */

import Storage from './storage.js'
import DateTime from './datetime.js'
import Emojis from './emoji.js'

/**
 * Chat constructor.
 *
 * @param {number} id - The id of the window.
 * @returns {void}.
 */
function Chat (id) {
  this.id = id
  this.channel = 'my, not so secret, channel'
  this.previousChannel = 'my, not so secret, channel'
  this.username = 'User'
  this.previousUsername = 'User'
  this.msgInput = ''
  this.chnInput = ''
  this.usrInput = ''
  this.chatLog = ''
  this.socket = null
  this.apiKey = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
  this.previousSentMsg = ''
  this.emojiArr = Emojis.getEmojiArray()
  this.emojiMap = Emojis.getEmojiMap()
}

Chat.prototype = {
  setIO: function (chatInput, channelInput, userInput, chatLog) {
    this.msgInput = chatInput
    this.msgInput.placeholder = `Message #${this.channel}`

    this.chnInput = channelInput
    this.chnInput.value = this.channel

    this.usrInput = userInput

    this.chatLog = chatLog

    const savedName = Storage.getChatUsername()

    if (savedName === null) this.setUsername(' ')
    else this.setUsername(savedName)

    this.setListeners()
  },

  /**
   * Initializes the event listeners for all input fields.
   *
   * @returns {void}.
   */
  setListeners: function () {
    this.chnInput.addEventListener('focusin', () => {
      this.previousChannel = this.chnInput.value
      this.chnInput.value = ''
    })
    this.chnInput.addEventListener('focusout', () => {
      this.setChannel(this.chnInput.value)
    })
    this.chnInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.chnInput.blur()
    })

    this.usrInput.addEventListener('focusin', () => {
      this.previousUsername = this.usrInput.value
      this.usrInput.value = ''
    })
    this.usrInput.addEventListener('focusout', () => {
      this.setUsername(this.usrInput.value)
    })
    this.usrInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.usrInput.blur()
    })

    this.msgInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        if (this.msgInput.value.length > 0 && this.msgInput.value !== ' ') {
          this.outgoingMessage(this.msgInput.value)
        }

        this.msgInput.value = ''
      }
    })
  },

  /**
   * Disables the chatbox if the name is not allowed.
   *
   * @param {*} name - The chosen username.
   * @returns {void}.
   */
  displayUserNameValidity: function (name) {
    if (name === 'User') {
      this.msgInput.disabled = true
      this.msgInput.placeholder = 'You must enter a username before you can start to chat!'
      this.msgInput.style.cursor = 'not-allowed'
    } else {
      this.msgInput.disabled = false
      this.msgInput.placeholder = `Message #${this.channel}`
      this.msgInput.style.cursor = 'text'
    }
  },

  /**
   * Handles any incoming message from the server. Ignores messages from other
   * channels, and also ignores the echo from the server after sending a message.
   *
   * @param {string} event - The event data.
   * @returns {void}.
   */
  incomingMessage: function (event) {
    const jsonEvent = JSON.parse(event)

    if (
      (jsonEvent.type === 'message' || jsonEvent.type === 'notification') &&
      jsonEvent.data.length > 0 &&
      this.previousSentMsg !== event
    ) {
      const name = jsonEvent.username
      const text = jsonEvent.data
      const chn = jsonEvent.channel

      // Only listen to the current channel, and server notifications
      if (chn !== this.channel && jsonEvent.type !== 'notification') return

      const message = document.createElement('DIV')
      message.classList = 'chat-message-left'

      const messageBubble = document.createElement('DIV')
      messageBubble.classList = 'chat-bubble-left'
      messageBubble.innerHTML = text

      message.appendChild(messageBubble)

      const messageTimestamp = document.createElement('SPAN')
      messageTimestamp.innerHTML = `${DateTime.getHours()}:${DateTime.getMinutes()}`
      message.appendChild(messageTimestamp)

      const messageUsername = document.createElement('SPAN')
      messageUsername.innerHTML = `${name} at `
      message.appendChild(messageUsername)

      this.chatLog.appendChild(message)

      const lineBreak = document.createElement('DIV')
      lineBreak.style.width = '100%'
      lineBreak.style.height = '1px'
      lineBreak.style.float = 'left'
      this.chatLog.appendChild(lineBreak)

      this.chatLog.scrollTop = this.chatLog.scrollHeight - this.chatLog.clientHeight
    }
  },

  /**
   * Replaces the human-readable emoji string with their corresponding hex unicode.
   *
   * @param {string} text - The original message text.
   * @returns {string} the new message.
   */
  replaceEmoji: function (text) {
    let newText = ''
    for (let i = 0; i < text.length; i++) {
      const element = text[i]

      if (element === ':') {
        let emojiLength = 0
        let string = ':'
        for (let j = i + 1; j < text.length; j++) {
          const element2 = text[j]
          string += element2
          emojiLength++

          if (element2 === ':') {
            const replacment = this.emojiMap.get(string)

            if (this.replaceEmoji !== null) newText += replacment

            break
          }

          if (j === text.length - 1) {
            emojiLength = 0
          }
        }

        // Skip forward in the message
        i += emojiLength
      } else {
        newText += element
      }
    }

    return newText
  },

  /**
   * Handles any outgoing messages (sent from this client).
   *
   * @param {string} text - The message text.
   * @returns {void}.
   */
  outgoingMessage: function (text) {
    text = this.replaceEmoji(text)

    if (!this.socket || this.socket.readyState === 3) {
      console.log('Socket not connected!')
    } else {
      const message = document.createElement('DIV')
      message.classList = 'chat-message-right'
      this.chatLog.appendChild(message)

      const messageBubble = document.createElement('DIV')
      messageBubble.classList = 'chat-bubble-right'
      messageBubble.innerHTML = text
      message.appendChild(messageBubble)

      const messageUsername = document.createElement('SPAN')
      messageUsername.innerHTML = 'You at'
      message.appendChild(messageUsername)

      const messageTimestamp = document.createElement('SPAN')
      messageTimestamp.innerHTML = `${DateTime.getHours()}:${DateTime.getMinutes()}`

      message.appendChild(messageTimestamp)

      this.chatLog.appendChild(message)

      const lineBreak = document.createElement('DIV')
      lineBreak.style.width = '100%'
      lineBreak.style.height = '1px'
      lineBreak.style.float = 'left'
      this.chatLog.appendChild(lineBreak)

      this.chatLog.scrollTop = this.chatLog.scrollHeight - this.chatLog.clientHeight

      const msgToServer = {
        type: 'message',
        data: text,
        username: this.username,
        channel: this.channel,
        key: this.apiKey
      }

      this.previousSentMsg = JSON.stringify({
        type: 'message',
        data: text,
        username: this.username,
        channel: this.channel
      })

      //this.socket.send(JSON.stringify(msgToServer))
    }
  },

  /**
   * Switches to a new channel for communication with the server.
   *
   * @param {string} channelName - The name of the channel to switch to.
   * @returns {void}.
   */
  setChannel: function (channelName) {
    this.channel = channelName

    if (channelName === ' ' || channelName.length < 1) {
      this.channel = this.previousChannel
      this.chnInput.value = this.channel
      this.msgInput.placeholder = `Message #${this.channel}`
    } else {
      this.channel = channelName
      this.chnInput.value = channelName
      this.msgInput.placeholder = `Message #${this.channel}`
    }
  },

  /**
   * Switches to a new username.
   *
   * @param {string} userName - The new username.
   * @returns {void}.
   */
  setUsername: function (userName) {
    if (userName === ' ' || userName.length < 1) {
      this.username = this.previousUsername
      this.usrInput.value = this.username
    } else {
      this.username = userName
      this.usrInput.value = userName
      Storage.setChatUsername(userName)
    }
    this.displayUserNameValidity(this.username)
  },

  /**
   * Connects to the web server.
   *
   * @returns {void}.
   */
  connect: function () {
    // this.socket = new WebSocket('ws://vhost3.lnu.se:20080/socket/')
    console.log('Chat not opened: no https')

    const parent = this
    /* 
    this.socket.onopen = () => {
      console.log('The websocket is now open.')
    }

    this.socket.onmessage = (event) => {
      parent.incomingMessage(event.data)
    }

    this.socket.onclose = () => {
      console.log('The websocket is now closed.')
    }
    */
  }
}

const chats = new Map()
/**
 * Creates a new Chat instance.
 *
 * @param {number} id - The id suffix of the game's window
 * @param {HTMLElement} chatInput - The message input.
 * @param {HTMLElement} channelInput - The channel change input.
 * @param {HTMLElement} userInput - The user change input.
 * @param {HTMLElement} chatLog - The chatlog element.
 * @returns {void}.
 */
function newChat (id, chatInput, channelInput, userInput, chatLog) {
  const chat = new Chat(id)
  chat.setIO(chatInput, channelInput, userInput, chatLog)
  chat.connect()

  chats.set(id, chat)
}

export default {
  newChat
}

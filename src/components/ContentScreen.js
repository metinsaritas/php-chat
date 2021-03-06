import React, { Component } from 'react'

import './ContentScreen.scss'

import axios from 'axios'
window.axios = axios
import $ from 'jquery'
window.$ = $

export default class ContentScreen extends Component {

    constructor (props) {
        super(props)

        let audio = new Audio()
        audio.autoplay = false
        audio.src = '/api/ringtone'

        this.state = {
            users: [],
            me: {},
            filterUl: '',
            emojis: this.getEmojis(),
            isShowingEmojiPanel: false,
            audio,
            isWindowFocused: true,
            unreadMessageCount: 0,
            fileModifyTime: 0,
            ofileModifyTime: 0,
        }

        this.handleLogOut = this.handleLogOut.bind(this)
        this.handleSetFilter = this.handleSetFilter.bind(this)
        this.handleSendMessage = this.handleSendMessage.bind(this)
        this.handleChatKeyDown = this.handleChatKeyDown.bind(this)
    }

    componentDidMount () {
        $(window).on('focus', () => {
            this.setState({
                isWindowFocused: true,
                unreadMessageCount: 0
            })

            $('head title').text('Chat | SZTEChat')
        })

        $(window).on('blur', () => {
            this.setState({
                isWindowFocused: false
            })
        })

        axios({
            method: 'GET',
            url: '/api/users'
        }).then(result => result.data)
        .then(json => {
            if (json.error) return console.warn(json.message);
            let {me, users} = json.details
            this.setState({
                users: users.filter(user => {
                    if (user.email != me.email)
                    return true
                    json.details.me = user
                    return false
                }),
                me: json.details.me
            })

            this.polling.bind(this).call()
        })
        .catch(err => console.warn(err))
        .then(() => {
            $('#react-loading').remove()
            $('#pleaseWait').remove()
        })
    }

    render () {
        return (
            <div id="ContentScreen">
                
                <div className="rightSide">

                    <div className="gradient"></div>
                    
                    <div className={this.state.isShowingEmojiPanel ? 'messagesContainer open': 'messagesContainer'}>
                        <div ref="messagesArea" className="messagesArea">
                        </div>
                    </div>

                    <div className={this.state.isShowingEmojiPanel ? 'chatContainer open': 'chatContainer'}>

                        <div className="emojiContainer">
                            <div className="emojis">
                                {
                                    this.state.emojis
                                    .map((emoji, i) => {
                                        let em = emoji
                                        let isObj = typeof em === 'object'
                                        let css = isObj ? em.css : em
                                        let title = isObj ? (em.title || em.css) : em
                                        return (
                                        <div onClick={this.handleSetEmoji.bind(this, i)} key={i} className="emoji" title={`:${title}:`}>
                                            <i className={`em em-${css}`}></i>
                                        </div>)
                                        })
                                }
                            </div>
                        </div>

                        <div className="container">
                            <div className="emoji-opener" data-icon={`emoji${this.state.isShowingEmojiPanel?'-arrow':''}`} title="Emojis"
                            onClick={this.toggleEmojiPanel.bind(this)}
                            ></div>

                            <div className="chattextContainer">
                                <span className="ph">Text a message</span>
                                <div className="chattext" ref="chattext" onKeyDown={this.handleChatKeyDown} contentEditable={true}></div>
                            </div>

                            <div className="send" onClick={this.handleSendMessage} data-icon="send" title="Send the message"></div>
                        </div>
                    </div>
                </div>

                <div className="leftSide">
                    
                    <div className="header">

                        <div className="title">
                            <div className="imageContainer" style={{backgroundImage: `url(/api/photo/${this.state.me.id})`}}>
                                {/*<div className="status"></div>*/}
                            </div>

                            <div className="nickName">{this.state.me.nickname}</div>
                        </div>

                        <div className="settingsContainer">
                            <div className="setting" onClick={this.handleLogOut} data-icon="shutdown" title="Log out"></div>
                        </div>

                    </div>
                    <div className="middle">
                        <div className="searchContainer">
                            <input type="search" data-icon="search" onChange={this.handleSetFilter} placeholder="Search user" className="searchInput"/>
                        </div>
                        
                        <div className="usersContainer">
                            <ul className="userUlList">
                                {
                                [...this.state.users]
                                    .sort((a, b) => b.online || 0 - a.online || 0)
                                    .map((user, i) => {

                                    let show = user.nickname.indexOf(this.state.filterUl) != -1 ||
                                                 user.email.indexOf(this.state.filterUl) != -1
                                        
                                    return (
                                    <li key={i} className="userLi" style={{display: show || 'none'}}>
                                        <div style={{backgroundImage: `url(/api/photo/${user.id})`}} className="imageContainer">
                                            <div className={user.online ? 'status online' : 'status'}></div>
                                        </div>
                                        <div className="infoContainer">
                                            <div className="nickName">{user.nickname}</div>
                                            <div className="email">{user.email}</div>
                                        </div>
                                    </li>)
                                    })
                                }
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        )
    }

    handleSetFilter (event) {
        let value = event.target.value

        this.setState({
            filterUl: value
        })
    }

    handleLogOut () {

        axios({
            method: 'DELETE',
            url: '/api/logout'
        }).then(result => result.data)
        .then(json => {
            window.location.reload()
        })
        .catch(err => console.log(err))
    }

    handleSetEmoji (i) {
        let chattext = this.refs.chattext
        let em = this.state.emojis[i]
        let isObj = typeof em === 'object'
        let css = isObj ? em.css : em
        let title = isObj ? (em.title || em.css) : em

        let emojiEl = `<span contenteditable="false" data-type="emoji" class="${`em em-${css}`} emoji" title=":${title}:">:${css}:</span>`
        chattext.innerHTML += emojiEl
        /*
        let sel, range, html;
        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();
                range.insertNode( document.createTextNode(emojiEl) );
            }
        } else if (document.selection && document.selection.createRange) {
            document.selection.createRange().text = emojiEl;
        }*/
        
    }

    getEmojis () {
        //{css: 'smiley', title: 'Smiley'}
        return ['smiley', 'mosque','flag-tr','flag-hu','innocent',
        
        ]
    }

    toggleEmojiPanel () {
        this.setState(state => {
            return {isShowingEmojiPanel: !state.isShowingEmojiPanel}
        })
    }

    polling () {

        let timestamp = Math.floor(new Date().getTime() / 1000)
        let params = new FormData()
        params.append("fileModifyTime", this.state.fileModifyTime || timestamp);
        params.append("ofileModifyTime", this.state.ofileModifyTime || timestamp);

        axios({
            method: 'POST',
            //url: '/api/polling.php'
            url: '/test/online.php',
            data: params
        })
        .then(result => result.data)
        .then(json => {
            if (!json.hasOwnProperty('error')) return /*throw*/ new Error('not a json')
            if (json.error === true) throw new Error(json.message || 'An undefined error')
            if (!json.content) throw new Error('content is empty')
            
            if (json.type == 'online') {
                let onlineUsers = json.content;
                let users = [...this.state.users]

                let ofileModifyTime = json.ofileModifyTime || 0
                users.forEach((user, i) => {
                    users[i].online = onlineUsers.hasOwnProperty(user.email) ? 1 : 0
                })
                
                this.setState({
                    users,
                    ofileModifyTime
                })
                return;
            }

            /* else json.type == "messages" */
            let { fileModifyTime } = json
            debugger
            this.setState({
                fileModifyTime
            })

            let {isWindowFocused, audio} = this.state
            
            if (!isWindowFocused) {                
                audio.pause(); audio.currentTime = 0; audio.play()
            }

            let { messagesArea } = this.refs 
            let { messages } = json.content

            let isScrollBottom = messagesArea.scrollHeight - messagesArea.scrollTop === messagesArea.clientHeight

            Object.keys(messages).forEach(keytime => {
                let { message, sender, time } = messages[keytime]
                
                let me = sender == localStorage.getItem('email')
                let classMe = me ? ' me':''
                let classSame = ''
                
                let lastMessageSender = $(messagesArea).find('.messageContainer:last .sender')
                
                
                if (lastMessageSender.length) {
                    classSame = lastMessageSender.html() == sender ? ' same': ''
                }

                let avatar = classSame ? '' : `<div class="avatar"></div>`

                let tempMessage = message
                let editedMessage = message

                let regex = /:(.*?):/gmi
                let i
                let objIcons = []
                do {
                    i = regex.exec(message)
                    if (!i || i[0].indexOf(' ') != -1)
                        continue

                    if (objIcons.hasOwnProperty(i[1]))
                        continue
                    let title
                    let css = title = i[1]
                    
                    let bigClass = i.input.trim() == i[0] ? " big" : ""
                    let emojiTemplate = `<span contenteditable="false" data-type="emoji" class="${`em em-${css}`} emoji${bigClass}" title=":${title}:">:${css}:</span>`
                    
                    objIcons[i[1]] = emojiTemplate
                } while (i)

                Object.keys(objIcons).forEach((key, i) => {
                    if (this.state.emojis.indexOf(key) == -1) {
                        return
                    }
                    editedMessage = editedMessage.replace(new RegExp(`:${key}:`, 'g'), objIcons[key])
                })

                let date = new Date(time * 1000)
                let hours = date.getHours()
                hours = hours < 10 ? `0${hours}` : hours
                
                let minutes = date.getMinutes()
                minutes = minutes < 10 ? `0${minutes}` : minutes

                $(messagesArea).append(
                `<div class="messageContainer">
                    <div class="messageHolder${classMe + classSame}">
                        ${avatar}
                        <div class="name">${sender}</div>
                        <div class="sender hidden">${sender}</div>
                        <span>${editedMessage}</span>
                        <div class="time" title="${date.toString()}">${hours+":"+minutes}</div>
                    </div>
                </div>`
                )

                if (!isWindowFocused) { 
                    this.setState(state => {
                        return {
                            unreadMessageCount: state.unreadMessageCount + 1
                        }
                    })

                    let count = this.state.unreadMessageCount
                    let countText = count <= 0 ? '' : `(${count}) `
                    $('head title').text(`${countText}Chat | SZTEChat`)
                }
            })

            if (isScrollBottom) {
                messagesArea.scrollTop = messagesArea.scrollHeight
            }
        })
        .catch(err => console.log(err.message))
        .then(() => this.polling())
    }

    handleSendMessage () {
        let { chattext } = this.refs
        let message = chattext.innerHTML.trim()
        if (!message.length) return
        
        setTimeout(() => {
            chattext.innerHTML = null
        }, 1)

        let params = new FormData()
        params.append("message", message);

        axios({
            method: 'POST',
            url: '/api/sendmessage',
            data: params
        })
        .then(response => response.data)
        .then(json => {
            if (json.error) return setTimeout(alert.bind(null, json.message), 1);
            
        })
        .catch(err => console.log(err.message))
    }

    handleChatKeyDown (event) {
        if (event.which === 13 && !event.shiftKey) {
            this.setState({isShowingEmojiPanel: false})
            this.handleSendMessage()
        }
    }
}
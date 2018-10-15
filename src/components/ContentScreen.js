import React, { Component } from 'react'

import './ContentScreen.scss'

import axios from 'axios'
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
            unreadMessageCount: 0
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

                            <div className="messageContainer">
                                <div className="messageHolder">
                                    <div className="name">Metin</div>
                                    <span>Selamlar</span>
                                </div>
                            </div>

                            <div className="messageContainer">
                                <div className="messageHolder me">
                                    <div className="name">Metin</div>
                                    <span>Selamlar</span>
                                </div>
                            </div>

                            <div className="messageContainer">
                                <div className="messageHolder me">
                                    <div className="name">Metin</div>
                                    <span>Selamlar</span>
                                </div>
                            </div>

                            <div className="messageContainer">
                                <div className="messageHolder">
                                    <div className="name">Metin</div>
                                    <span>Selamlar</span>
                                </div>
                            </div>

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
                                        <div onClick={this.handleSetEmoji.bind(this, i)} key={i} className="emoji" title={title}>
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
                            <div className="imageContainer" style={{backgroundImage: `url(/api/photo/${this.state.me.id})`}}></div>
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
                                    this.state.users.map((user, i) => {
                                    let show = user.nickname.indexOf(this.state.filterUl) != -1 ||
                                                 user.email.indexOf(this.state.filterUl) != -1
                                        
                                    return (<li key={i} className="userLi" style={{display: show || 'none'}}>
                                        <div style={{backgroundImage: `url(/api/photo/${user.id})`}} className="imageContainer"></div>
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

        let emojiEl = `<span contenteditable="false" class="${`em em-${css}`} emoji" title="${title}"></span>`
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
        return [{css: 'smiley', title: 'Smiley'}, 'mosque','flag-tr','flag-hu','innocent',
        
            'mosque','flag-tr','flag-hu','innocent',
            'mosque','flag-tr','flag-hu','innocent',
            'mosque','flag-tr','flag-hu','innocent',
            'mosque','flag-tr','flag-hu','innocent',
            'mosque','flag-tr','flag-hu','innocent',
            'mosque','flag-tr','flag-hu','innocent',
            'mosque','flag-tr','flag-hu','innocent',
            'mosque','flag-tr','flag-hu','innocent',
            'mosque','flag-tr','flag-hu','innocent',
            'mosque','flag-tr','flag-hu','innocent',
            'mosque','flag-tr','flag-hu','innocent',
            'mosque','flag-tr','flag-hu','innocent',
            'mosque','flag-tr','flag-hu','innocent',
            'mosque','flag-tr','flag-hu','innocent',
            'mosque','flag-tr','flag-hu','innocent',
            'mosque','flag-tr','flag-hu','innocent',

        ]
    }

    toggleEmojiPanel () {
        this.setState(state => {
            return {isShowingEmojiPanel: !state.isShowingEmojiPanel}
        })
    }

    polling () {
        axios({
            method: 'GET',
            url: '/api/polling.php'
        })
        .then(result => result.data)
        .then(json => {
            if (!json.hasOwnProperty('error')) return /*throw*/ new Error('not a json')
            if (json.error === true) throw new Error(json.message || 'An undefined error')
            if (!json.content) throw new Error('content is empty')
            
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

                $(messagesArea).append(
                `<div class="messageContainer">
                    <div class="messageHolder${classMe + classSame}">
                        <div class="name">${sender}</div>
                        <div class="sender hidden">${sender}</div>
                        <span>${message}</span>
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
            this.handleSendMessage()
        }
    }
}
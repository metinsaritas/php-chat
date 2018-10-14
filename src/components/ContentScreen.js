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
        audio.src = '/message-ringtone.mp3'

        this.state = {
            users: [],
            me: {},
            filterUl: '',
            emojis: this.getEmojis(),
            isShowingEmojiPanel: false,
            audio
        }

        //audio.pause(); audio.currentTime = 0; audio.play()

        this.handleLogOut = this.handleLogOut.bind(this)
        this.handleSetFilter = this.handleSetFilter.bind(this)
    }

    componentDidMount () {

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
                        <div className="messagesArea">

                            <div className="messageContainer">
                                <div className="messageHolder">Hello!</div>
                            </div>

                            <div className="messageContainer">
                                <div className="messageHolder me">Szia!</div>
                            </div>

                            <div className="messageContainer">
                                <div className="messageHolder me">Szia!</div>
                            </div>

                            <div className="messageContainer">
                                <div className="messageHolder me">Szia!</div>
                            </div>

                            <div className="messageContainer">
                                <div className="messageHolder me">Szia!</div>
                            </div>

                            <div className="messageContainer">
                                <div className="messageHolder me">Szia!</div>
                            </div>

                            <div className="messageContainer">
                                <div className="messageHolder me">Szia!</div>
                            </div>

                            <div className="messageContainer">
                                <div className="messageHolder me">Szia!</div>
                            </div>

                            <div className="messageContainer">
                                <div className="messageHolder me">Szia!</div>
                            </div>

                            <div className="messageContainer">
                                <div className="messageHolder">
                                    <div className="name">Metin</div>
                                    <span>Selamlar</span>
                                </div>
                            </div>

                            <div className="messageContainer">
                                <div className="messageHolder">
                                    <div className="name">Metin</div>
                                    <span>Merhaba</span>
                                </div>
                            </div>

                            <div className="messageContainer">
                                <div className="messageHolder me">Szia!</div>
                            </div>

                            <div className="messageContainer">
                                <div className="messageHolder me">Szia!</div>
                            </div>

                            <div className="messageContainer">
                                <div className="messageHolder me">Szia!</div>
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
                                <div className="chattext" ref="chattext" contentEditable={true}></div>
                            </div>

                            <div className="send" data-icon="send" title="Send the message"></div>
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
}
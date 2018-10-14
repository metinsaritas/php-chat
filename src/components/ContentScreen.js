import React, { Component } from 'react'

import './ContentScreen.scss'

import axios from 'axios'
import $ from 'jquery'

export default class ContentScreen extends Component {

    constructor (props) {
        super(props)

        this.state = {
            users: [],
            me: {},
            filterUl: '',
            emojis: this.getEmojis()
        }

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
                    <div className="messagesContainer">
                    
                    </div>

                    <div className="chatContainer">

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
                                        <div key={i} className="emoji" title={title}>
                                            <i className={`em em-${css}`}></i>
                                        </div>)
                                        })
                                }
                            </div>
                        </div>

                        <div className="container">
                            <div className="emoji-opener" data-icon="emoji" title="Emojis"></div>

                            <input type="text" placeholder="Text a message" className="chattext"/>

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

    getEmojis () {
        return [{css: 'smiley', name: 'Smiley'}, 'mosque']
    }
}
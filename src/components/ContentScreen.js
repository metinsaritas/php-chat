import React, { Component } from 'react'

import './ContentScreen.scss'

import axios from 'axios'
import $ from 'jquery'

export default class ContentScreen extends Component {

    constructor (props) {
        super(props)

        this.state = {
            users: []
        }

        this.handleLogOut = this.handleLogOut.bind(this)
    }

    componentDidMount () {

        axios({
            method: 'GET',
            url: '/api/users'
        }).then(result => result.data)
        .then(json => {
            if (json.error) return console.warn(json.message);

            this.setState({
                users: [...json.details[0]]
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
                </div>

                <div className="leftSide">
                    
                    <div className="header">
                        <a href="#" onClick={this.handleLogOut}>Log out</a>
                    </div>
                    <div className="middle">
                        <div className="searchContainer">
                            <input type="search" placeholder="Search user" className="searchInput"/>
                        </div>
                        
                        <div className="usersContainer">
                            <ul className="userUlList">
                                {
                                    //Array(20).fill(1)
                                    
                                    this.state.users.map((user, i) =>
                                    <li key={i} className="userLi">
                                    
                                        {console.log(user)}
                                        <div style={{backgroundImage: `url(/api/photo/${user.id})`}} className="imageContainer"></div>
                                        <div className="infoContainer">
                                            <div className="nickName">{user.nickname}</div>
                                            <div className="email">{user.email}</div>
                                        </div>
                                    </li>
                                    )
                                }
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        )
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
}
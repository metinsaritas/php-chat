import React, { Component } from 'react'

import './ContentScreen.scss'

import axios from 'axios'

export default class ContentScreen extends Component {

    constructor (props) {
        super(props)

        this.handleLogOut = this.handleLogOut.bind(this)
    }

    render () {
        return (
            <div id="ContentScreen">
                <a href="#" onClick={this.handleLogOut}>Log out</a>
            </div>
        )
    }

    handleLogOut () {

        axios({
            method: 'delete',
            url: '/api/logout'
        }).then(result => result.data)
        .then(json => {
            window.location.reload()
        })
        .catch(err => console.log(err))
    }
}
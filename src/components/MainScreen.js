import React, { Component } from 'react'

import './MainScreen.scss'

import axios from 'axios'
import $ from 'jquery'

export default class MainScreen extends Component {

    constructor (props) {
        super(props)
        this.state = {
            signUpValue: ''
        }

        this.handleSignUp = this.handleSignUp.bind(this)
        this.onSubmitForm = this.onSubmitForm.bind(this)
    }

    componentDidMount () {
        this.setState({
            section: 'signin',
            signUpValue: 'Sign Up'
        })
    }

    render () {
        return (
            <div id="MainScreen">
                <div className="title">
                    <b>SZTE</b>Chat
                </div>

                <div className="signInContainer">
                    <div className="profilePicture"></div>
                    <form onSubmit={this.onSubmitForm}>
                        <input type="text" placeholder="E-mail" ref="email" data-icon="email"/>
                        <input type="password" placeholder="Password" ref="password" data-icon="key"/>
                        {
                            this.state.section == 'signup' &&
                             <input type="password" placeholder="Password Repeat" ref="passwordr" data-icon="key"/>
                        }
                        
                        {this.state.section == 'signin' && <input type="submit" ref="login" value="Log In"/>}
                        {this.state.section == 'signup' && <input type="button" value="Back" onClick={() => this.changeSection('signin')}/>}
                        
                        <input type="button" value={this.state.signUpValue} className="signUp" onClick={this.handleSignUp}/>
                    </form>

                    <div className="clear"></div>

                </div>
            </div>
        )
    }

    changeSection (section) {
        this.setState({
            section,
            signUpValue: section == 'signin' ? 'Sign Up': 'Register!'
        })
    }

    handleSignUp () {
        this.changeSection('signup')
    }

    onSubmitForm (event) {
        event.preventDefault()

        let params = new FormData();
        let {email, password, login} = this.refs

        params.append('email', email.value)
        params.append('password', password.value)
        
        $(login).addClass('loading-bg')

        axios({
            method: 'POST',
            url:'/api/login',
            data: params
        })
        .then(result => result.data)
        .then(json => {
            if (json.error) 
                return setTimeout(alert.bind(null, json.message), 1)
            window.location.reload()
        })
        .catch(err => console.log(err))
        .then(() => {
            $(login).removeClass('loading-bg')
        })
    }
}
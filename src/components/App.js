import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import './App.scss'

import MainScreen from './MainScreen'
import ContentScreen from './ContentScreen'

export default class App extends Component {

    constructor (props) {
        super(props)
    }

    render () {
        return (
            <div>
                {this.props.section == 'login' && <MainScreen/>}
                {this.props.section != 'login' && <ContentScreen/>}
            </div>
        )
    }
}

let root = document.getElementById('root')

ReactDOM.render(<App section={root.getAttribute('data-section')}/>, root)
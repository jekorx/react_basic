import React, { Component } from 'react'
import { render } from 'react-dom'

import Main from '@views/main/main'

export default class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: ' react!'
    }
  }
  componentDidMount () {
    setTimeout(() => {
      this.setState({
        name: ' react! 666'
      })
    }, 5000);
  }
  render () {
    return (
      <Main name={this.state.name}/>
    )
  }
}

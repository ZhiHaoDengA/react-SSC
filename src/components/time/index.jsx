import React, {Component} from 'react';

export default class Time extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentDate: new Date().format("yyyy-MM-dd hh:mm:ss"),
      dateTimer: null,
    }
  }
  componentDidMount() {
    this.setState({
      dateTimer: setInterval(() => {
        this.setState({
          currentDate: new Date().format("yyyy-MM-dd hh:mm:ss")
        })
      }, 1000)
    })
  }

  onDestroyed() {
    window.clearInterval(this.state.dateTimer)
  }



  render() {
    const {currentDate} = this.state
    return (
      <span>{currentDate}</span>
    )
  }
}
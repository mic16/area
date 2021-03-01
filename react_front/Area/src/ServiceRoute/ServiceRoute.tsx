import React from "react"
import {Route} from "react-router-dom"

export default class ServiceRoute extends React.Component {
  render() {
    console.log(this.props)
    return <Route {...this.props} />
  }
}
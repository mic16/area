import { WebView } from 'react-native-webview';
import React from "react"
import {Route} from "react-router-dom"
import Navigation from '../Navigation/Navigation';
import { mobileIP } from '../Login/Login';

export default class ServiceRoute extends React.Component {

    constructor(props:any) {
        super(props);
        this.state = {
          navigation: this.props.navigation
        }
    }

    webview = null;

    render() {
      if (this.webview === null) {
        console.log("LES PARAMETRE:")
        console.log(this.props.route)
        console.log(`L'URL DE LA REDIR EST = ${this.props.route.params.data.result}`)
      }
      else
        this.webview.getSettings().setUserAgentString("Android");
      return (
        <WebView
          ref={(ref:any) => (this.webview = ref)}
          source={{uri: this.props.route.params.data.result}}
          userAgent={"chrome"}
          onNavigationStateChange={this.handleWebViewNavigationStateChange}
        />
      );
    }
  
    handleWebViewNavigationStateChange = (newNavState:any) => {

      const { url } = newNavState;
      if (!url) return;
  
      console.log(`CONSOLE LOG ACT URL IS: ${url}`)
      console.log(`http://${mobileIP}:8081/oauth/${this.props.route.params.service}`)
      if (url.includes(`http://localhost:8081/oauth/${this.props.route.params.service}`))
        this.state.navigation.navigate("Connection", {data:url, service:this.props.route.params.service})
    };
  }
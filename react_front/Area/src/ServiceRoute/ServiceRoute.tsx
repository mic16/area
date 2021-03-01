import { WebView } from 'react-native-webview';
import React from "react"
import {Route} from "react-router-dom"
import Navigation from '../Navigation/Navigation';

export default class ServiceRoute extends React.Component {

    constructor(props:any) {
        super(props);
        this.state = {
          navigation: this.props.navigation
        }
    }

    webview = null;

    render() {
      return (
        <WebView
          ref={(ref:any) => (this.webview = ref)}
          source={{uri: this.props.route.params.data.result}}
          onNavigationStateChange={this.handleWebViewNavigationStateChange}
        />
      );
    }
  
    handleWebViewNavigationStateChange = (newNavState:any) => {

      const { url } = newNavState;
      if (!url) return;
  
      console.log("CONSOLE LOG STP :")
      console.log(url)
      if (url.includes(":8081/oauth/" + this.props.route.params.service))
        this.state.navigation.navigate("Connection", {data:url, service:this.props.route.params.service})
    };
  }
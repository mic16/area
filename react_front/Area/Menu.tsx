import React, { Component } from 'react';
import { ImageBackground, Platform, View } from "react-native";
import { Footer, FooterTab, Text, Container, Header, Content, Form, Item, Input, Label, Title, Icon, Button, Left, Right } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import LoginComponent from './Login';


export default class MenuComponent extends Component {

  state = {
    loading: true
  }

  async componentDidMount() {
      await Font.loadAsync({
          Roboto: require('native-base/Fonts/Roboto.ttf'),
          Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
          ...Ionicons.font,
      });
      this.setState({ loading: false });
  }

  render() {
       if (this.state.loading) {
         return (
           <View></View>
         );
       }
       if (Platform.OS == "web")
        return (
            <Container style= {{ position: "relative"}}>
            <Header>
            
            </Header>
            <Content style= {{ position: "relative" }}>

            </Content>
          </Container>
        );

        return (
          <Container>
          <Header />
          <Content />
          <Footer>
            <FooterTab>
              <Button vertical>
                <Icon name="apps" />
                <Text>Apps</Text>
              </Button>
              <Button vertical>
                <Icon name="camera" />
                <Text>Create Area</Text>
              </Button>
              <Button vertical>
                <Icon name="person" />
                <Text>My Area</Text>
              </Button>
            </FooterTab>
          </Footer>
        </Container>
      );
   }
}


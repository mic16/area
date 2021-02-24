import React, { Component } from 'react';
import { ImageBackground, Platform, View, } from "react-native";
import { Footer, FooterTab, Text, Button, Container, Header, Content, Form, Item, Input, Label, Title, Icon, Toast } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { mobileIP } from '../../Login';
import { userToken } from '../../Login';

export default class MyArea extends Component {

  constructor(props:any) {
    super(props);
    this.state = {
      navigation: this.props.navigation,
      loading: true,
      set: false,
      allArea: []
    }
  }

  public logout() {
    return fetch('http://' + mobileIP + ':8080/logout', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "token":userToken,
          })
        })
        .then((response) => response.json()).then((json) => {
          // let mapAREA:Map<String, Array<Object>> = new Map()
          // mapAREA.set("Action", json.result.actions)
          // mapAREA.set("Reaction", json.result.reactions)
          // console.log(mapAREA.get("Action"))
          // mapAREA.set(this.state.actionReaction)
          // this.setState({actionReaction:mapAREA})
          if (json.result === undefined) {
            Toast.show({
              text: 'Logout failed',
              buttonText: 'Sad'
            })
            return
          }
          Toast.show({
            text: 'Logout Success',
            buttonText: 'Sad'
          })
          this.state.navigation.navigate("LoginComponent")
        })
        .catch((error) => {
          console.error(error)
          
        })
  }

  public getAREA() {
    return fetch('http://' + mobileIP + ':8080/area/list', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "token":userToken,
          })
        })
        .then((response) => response.json()).then((json) => {
          let arraya:Array<Object> = new Array()
          // mapAREA.set("Action", json.result.actions)
          // mapAREA.set("Reaction", json.result.reactions)
          // console.log(mapAREA.get("Action"))
          // mapAREA.set(this.state.actionReaction)
          // this.setState({actionReaction:mapAREA})
          console.log("LE RES EST")
          console.log(json)
          if (json.result === undefined) {
            Toast.show({
              text: 'List Area Failed',
              buttonText: 'Sad'
            })
            return
          }
          this.setState({allArea:json.result})
        })
        .catch((error) => {
          console.error(error)
        })
  }

  public listArea() {
    let allReact:Array<any> = []
    if (this.state.set != true) {
      this.getAREA().then(_ => {
        this.state.allArea.forEach((element:Object) => {
          console.log("LES ELEMENTS SONT")
          console.log(element)
          allReact.push({
          })
        });
      });
      this.setState({set:true})
    }
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
        this.listArea()
       if (this.state.loading) {
         return (
           <View></View>
         );
       }
       if (Platform.OS == "web")
        return (
            <Container>
                <ImageBackground source={require('../../assets/login.png')} style={{ width: '100%', height: '100%' }} >
            <Content>
                
            </Content>
            </ImageBackground>
          </Container>
        );

        return (
            <Container style= {{ position: "relative"}}>
            <Header >
                <Button iconLeft transparent style={{ position:"absolute", paddingRight:340 }} onPress={() => this.logout()}>
                  <Icon name="log-out-outline" />
                </Button>
              <Title style={{  marginRight:0, color: "white", fontSize:22, alignSelf:"center" }} >My Area Page</Title>
            </Header>
            <Content style= {{ position: "relative" }}>
            </Content>
            <Footer>
            <FooterTab>
              <Button vertical onPress={ () =>  this.state.navigation.navigate('MyApps')}>
                <Icon name="apps" />
                <Text>Apps</Text>
              </Button>
              <Button vertical onPress={ () =>  this.state.navigation.navigate('CreateArea')}>
                <Icon name="add-outline" />
                <Text>Create Area</Text>
              </Button>
              <Button vertical onPress={ () =>  this.state.navigation.navigate('MyArea')}>
                <Icon name="person" />
                <Text>My Area</Text>
              </Button>
            </FooterTab>
          </Footer>
          </Container>
                )
   }
}


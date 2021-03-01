import React, { Component } from 'react';
import { Alert, ImageBackground, Platform, View } from "react-native";
import { Spinner, Root, Text, Accordion, FooterTab, Footer, Button, Container, Header, Content, Form, Item, Input, Label, Title, Icon, Grid, Col, Left, Right, Body, Toast, CheckBox, ListItem, List } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from "react-navigation";
import { TextInput } from 'react-native-gesture-handler';

export default class Connection extends Component<{}, any> {

  constructor(props:any) {
    super(props);
    this.state = {
      navigation: this.props.navigation,
      loading: true,
      connections: new Map()
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

  public fillDataConnection() {
      let array:Array<String> = []
      let mapTmp = new Map()

      array.forEach((string:String) => {
        mapTmp.set(string, "TOKEN")
      })
  }


  render() {
    if (this.state.loading) {
         return (
          <View>
            <Spinner color="blue" />
          </View>
         );
       }

        return (
            <Root>
            <Container style= {{ position: "relative"}}>
            <Header >
                {
                  <Button iconLeft transparent style={{ position:"absolute", paddingRight:340 }} onPress={() => this.state.navigation.navigate("MyArea", { action: this.state.connections})}>
                    <Icon name="chevron-back-outline" />
                  </Button>
                }
              <Title style={{  marginRight:0, color: "white", fontSize:22, alignSelf:"center" }} >{ this.state.headerReact + " configuration"}</Title>
            </Header>
            <Content style= {{ position: "relative" }}>
             {
             this.state.reactData
             }
            </Content>
          </Container>
          </Root>
                )
   }
}


import React, { Component } from 'react';
import { ImageBackground, Platform, View, StyleSheet } from "react-native";
import { Footer, FooterTab, Text, Button, Container, Content, Form, Item, Input, Label, Title, Icon, Drawer } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { any } from 'prop-types';
import Navigation from '../Navigation/Navigation';
import Header from '../Header/Header'
import CreateArea from '../CreateArea/CreateArea';

const getServices = () => {
  return fetch('localhost:8080/services')
    .then((response) => response.json())
    .then((json) => {
      return json.result;
    })
    .catch((error) => {
      console.error(error);
      return null
    });
};

type MyProps = { navigation: any };
type MyState = { navigation: any, loading: boolean, drawer: any, drawerState: boolean, token: string };

export default class MyApps extends Component<MyProps, MyState> {

  constructor(props:any) {
    super(props);
    this.state = {
      navigation: this.props.navigation,
      loading: true,
      drawer: any,
      drawerState: false,
      token: '',
    }
    this.getServices();
  }

  async componentDidMount() {
      await Font.loadAsync({
          Roboto: require('native-base/Fonts/Roboto.ttf'),
          Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
          ...Ionicons.font,
      });
      this.setState({ loading: false });
  }

  openCloseDrawer = () => {
    if (!this.state.drawerState)
      this.state.drawer._root.open();
    else
      this.state.drawer._root.close();
    this.setState({
      drawerState: !this.state.drawerState,
    })
  }

  public getServices = async () => {
    await fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'mail': 'test',
        'password': 'test',
      }),
    }).then((response) => response.json()).then((json) => {
      this.setState({token: json.result});
      return json.result;
    })
    .catch((error) => {
      console.error(error)
      return null;
    })
  }

  createArea = async () => {
    await fetch('http://localhost:8080/area/create', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'action': {
          'service': 'Twitter',
          'name': 'OnTweet',
          'config': {
            'match': 'yeet',
            'with image': false,
          }
        },
        'reaction':  {
          'service': 'Twitter',
          'name': 'Direct_message',
          'config': {
            'userId': 'yolo'
          }
        },
      'token': this.state.token}),
    }).then((response) => response.json()).then((json) => {
      console.log(json);
      return json.result;
    })
    .catch((error) => {
      console.error(error)
      return null;
    })
  }

  render() {
       if (this.state.loading) {
         return (
           <View></View>
         );
       }
       if (Platform.OS == "web")
        return (
          <Container>
            <Header onPressButton={() => this.openCloseDrawer()}/>
            <ImageBackground source={require('../../assets/login.png')} style={{ width: '100%', height: '100%' }} >
              <View style={styles.navigation}>
                <View style={{flexDirection: 'row', height: '100%'}}>
                  <Drawer
                    ref={(ref) => { this.state.drawer = ref }}
                    content={<Navigation navigation={this.state.navigation}/>}>
                    <View style={{height: '90%', width: '78%', right: 0, position: 'absolute'}}>
                      <View style={styles.container}>
                        <Text style={{
                          marginLeft: 'auto',
                          marginRight: 'auto',
                          fontSize: 30,
                          fontWeight: 'bold',
                          marginBottom: 10,
                          marginTop: 10,
                        }}>
                          Area
                        </Text>
                        <View style={styles.smallContainer}>
                          <Text style={{marginLeft: 'auto', marginRight: 'auto', marginTop: 10, marginBottom: 10}}>
                            Select the apps you want to link!
                          </Text>
                          <Form>
                            <Input
                              style={{width: "30%", marginLeft: 10, marginBottom: 10, borderWidth: 1, borderRadius: 5}}
                              />
                          </Form>
                          <Button onPress={() => this.createArea()}></Button>
                        </View>
                      </View>
                    </View>
                  </Drawer>
                </View>
              </View>
            </ImageBackground>
          </Container>
        );

        return (
            <Container style= {{ position: "relative"}}>
            <Header>
            <Text style={{ color: "white", fontSize:22, alignSelf:"center" }}>
                My Apps Page
            </Text>
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

const styles = StyleSheet.create({
  navigation: {
    height: '100%',
  },
  container: {
    width: '100%',
    margin: 5,
    marginRight: 10,
    borderRadius: 20,
    height: '100%',
    position: 'absolute',
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.5)'
  },
  smallContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
    width: '60%',
    borderRadius: 25,
    height: '20%',
  }
});
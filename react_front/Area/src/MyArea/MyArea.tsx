import React, { Component } from 'react';
import { ImageBackground, Platform, View, StyleSheet} from "react-native";
import { Footer, FooterTab, Text, Button, Container, Header, Content, Form, Item, Input, Label, Title, Icon, Toast } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { mobileIP } from '../Login/Login';
import { userToken } from '../Login/Login';
import Navigation from '../Navigation/Navigation';
import CustomHeader from '../CustomHeader/CustomHeader';

export default class MyArea extends Component {

  constructor(props:any) {
    super(props);
    this.state = {
      navigation: this.props.navigation,
      loading: true,
      set: false,
      allArea: [],
      displayAllAreas: [],
      stockAllAreas: [],
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

  public deleteArea = (key: number) => {
    console.log(this.state.stockAllAreas[key])
    console.log(userToken)
    fetch('http://' + mobileIP + ':8080/area/delete', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'token': userToken,
        'uuid': this.state.stockAllAreas[key]
      })
    })
    .then((response) => response.json()).then((json) => {
      console.log(json)
    }).catch((error) => {
      console.error(error)
    })
  }

  public async getAREA() {
    fetch('http://' + mobileIP + ':8080/area/list', {
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
      if (json.result === undefined) {
        if (Platform.OS === "web") {
          alert('List Area Failed')
        } else {
          Toast.show({
            text: 'List Area Failed',
            buttonText: 'Sad'
          })
        }
        return;
      }
      console.log(json.result)
      let tmpDisplayAllAreas: Array<Object> = [];
      let tmpStockAllAreas: Array<string> = [];
      
      json.result.forEach((element: any, key: number) => {
      //   fetch('http://' + mobileIP + `:8080/services/${element.service}`, {
      //   method: 'POST',
      //   headers: {
      //     Accept: 'application/json',
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     "token":userToken,
      //   })
      // })
      // .then((response) => response.json()).then((json) => {
  
      // })
        tmpStockAllAreas.push(element.uuid)
        console.log(element)
        tmpDisplayAllAreas.push(
          <View style={{marginTop: 10, width: '100%'}}>
            <View style={{marginLeft: 'auto', marginRight: 'auto'}}>
              <View style={{display: 'flex', flexDirection: 'row', height: '100%'}}>
                <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                  <Text>{element.action.service}</Text>
                  <Text>{element.action.name}</Text>
                </View>
                <Icon name="arrow-forward-sharp"></Icon>
                <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                  <Text>{element.reaction.service}</Text>
                  <Text>{element.reaction.name}</Text>
                </View>
              </View>
            </View>
            <Button style={{right: 10, position: 'absolute'}} onPress={() => this.deleteArea(key)}>
              <Icon name="trash"></Icon>
            </Button>
          </View>
        )
      });
      this.setState({allArea: json.result, displayAllAreas: tmpDisplayAllAreas, stockAllAreas: tmpStockAllAreas})
    })
    .catch((error) => {
      console.error(error)
    })
  }

  public async listArea() {
    if (this.state.set != true) {
      this.getAREA();
      this.setState({set: true})
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
       if (Platform.OS === "web")
        return (
          <Container>
            <CustomHeader/>
            <ImageBackground source={require('../../assets/login.png')} style={{ width: '100%', height: '100%' }}>
                <Navigation navigation={this.state.navigation}/>
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
                      My Areas
                    </Text>
                    <View>
                      {
                        this.state.displayAllAreas
                      }
                      {/* <Text>{this.state.allArea.action}</Text> */}
                    </View>
                  </View>
                </View>
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

const styles = StyleSheet.create({
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
    height: '40%',
  }
});
import React, { Component } from 'react';
import { ImageBackground, Platform, View, StyleSheet} from "react-native";
import { Footer, FooterTab, Text, Button, Container, Header, Content, Form, Item, Input, Label, Title, Icon, Toast, Left, Body, Right, Card, CardItem } from 'native-base';
// import * as Font from 'expo-font';
// import { Ionicons } from '@expo/vector-icons';
import { Ionicons } from "react-icons/io"
import { mobileIP } from '../Login/Login';
import { userToken } from '../Login/Login';
import Navigation from '../Navigation/Navigation';
import CustomHeader from '../CustomHeader/CustomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  public async logout() {
    console.log("Je vais me logout")
    let token = userToken;
    if (Platform.OS === 'web') {
      token = await this.getData();
    }
    return fetch('http://' + mobileIP + ':8080/logout', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "token": token,
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
              buttonText: 'Ok'
            })
            return
          }
          Toast.show({
            text: 'Logout Success',
            buttonText: 'Ok'
          })
          this.state.navigation.navigate("LoginComponent")
        })
        .catch((error) => {
          console.error(error)
        })
  }

  public getData = async () => {
    try {
      const value = await AsyncStorage.getItem('userToken')
      if (value !== null) {
        return (value)
      }
      return ('')
    } catch(e) {
      console.log(e);
      return ('');
    }
  }

  public deleteArea = async (key: number) => {
    let otherTmp:Array<Object> = []
    let i = 0
    let token = userToken;
    if (Platform.OS === 'web') {
      token = await this.getData();
    }
    this.state.displayAllAreas.forEach((obj:Object) => {
      if (key !== i) {
        otherTmp.push(obj)
      }
      i = i + 1
    })
    this.setState({displayAllAreas:otherTmp})
    fetch('http://' + mobileIP + ':8080/area/delete', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'token': token,
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
    let token = userToken;
    if (Platform.OS === 'web') {
      token = await this.getData();
    }

    
    fetch('http://' + mobileIP + ':8080/area/list', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "token":token,
      })
    })
    .then((response) => response.json()).then(async(json) => {
      console.log(json)
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
      let tmpDisplayAllAreas: Array<Object> = [];
      let tmpStockAllAreas: Array<string> = [];
      let actionDescription: Array<Object> = [];
      let reactionDescription: string = '';
      
      let promiseTab: Array<Promise<any>> = [];
      json.result.forEach((element: any, key: number) => {
        let promise = fetch('http://' + mobileIP + ':8080/services/' + element.action.service, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
        })
        .then((response) => response.json()).then((json) => {
          json.result.actions.forEach((action: any) => {
            if (action.name === element.action.name) {
              actionDescription.push({service: element.action.service, description: action.description});
            }
          });
          return fetch('http://' + mobileIP + ':8080/services/' + element.reaction.service, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
          })
          .then((response) => response.json()).then((json) => {
            console.log(actionDescription)
            json.result.reactions.forEach((reaction: any) => {
              if (reaction.name === element.reaction.name) {
                reactionDescription = reaction.description;
              }
            });
          tmpStockAllAreas.push(element.uuid)
          
          if (Platform.OS === "web") {
            tmpDisplayAllAreas.push(
              <View style={{marginTop: 10, width: '100%'}}>
                <View style={{marginLeft: 'auto', marginRight: 'auto', width: '100%'}}>
                  <View style={{display: 'flex', flexDirection: 'row', width: '100%'}}>
                    <View style={{width: '50%', alignItems: 'flex-end'}}>
                      <View style={{width: '50%', backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: 10, padding: 10}}>      
                        <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                          <Text style={{fontWeight: 'bold', fontSize: 20}}>{actionDescription[key].service}</Text>
                          <Text style={{textAlign: 'center'}}>{actionDescription[key].description}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={{top: '25%'}}>
                      <Icon name="arrow-forward-sharp"></Icon>
                    </View>
                    <View style={{width: '50%', alignItems: 'flex-start'}}>
                      <View style={{width: '50%', backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: 10, padding: 10, minHeight: '100%'}}>   
                        <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                          <Text style={{fontWeight: 'bold', fontSize: 20}}>{element.reaction.service}</Text>
                          <Text style={{textAlign: 'center'}}>{reactionDescription}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
                <Button style={{right: 10, position: 'absolute'}} onPress={() => this.deleteArea(key)}>
                  <Icon name="trash"></Icon>
                </Button>
              </View>
            )
          } else {
            tmpDisplayAllAreas.push(
              <Card style={{ borderColor:"blue" }} key={key}>
              <CardItem>
                <Text style={{ fontWeight: 'bold', textDecorationLine: 'underline' }} >Service: </Text>
                <Text>{element.action.service}</Text>
              </CardItem>
              <CardItem>
                <Text style={{ fontWeight: 'bold', textDecorationLine: 'underline' }} >Action: </Text>
                <Text>{actionDescription}</Text>
              </CardItem>
              <Icon style={{ alignSelf:'center' }} name="arrow-down-outline" />
              <CardItem>
                <Text style={{ fontWeight: 'bold', textDecorationLine: 'underline' }} >Service: </Text>
                <Text>{element.reaction.service}</Text>
              </CardItem>
              <CardItem>
                <Text style={{ fontWeight: 'bold', textDecorationLine: 'underline' }} >Reaction: </Text>
                <Text>{reactionDescription}</Text>
              </CardItem>
                <Button style={{ alignSelf:'center' }} onPress={() => this.deleteArea(key)}>
                  <Icon name="trash"></Icon>
                </Button>
            </Card>
            )
          }
        })
      })
      promiseTab.push(promise);
      });
      await Promise.all(promiseTab);
      return ([json.result, tmpDisplayAllAreas, tmpStockAllAreas])
    }).then(([result, displayAllAreas, stockAllAreas]: any) => {
      if (result && displayAllAreas && stockAllAreas) {
        this.setState({allArea: result, displayAllAreas: displayAllAreas, stockAllAreas: stockAllAreas})
      }
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
      // await Font.loadAsync({
      //     Roboto: require('native-base/Fonts/Roboto.ttf'),
      //     Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      //     ...Ionicons.font,
      // });
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
            <CustomHeader navigation={this.state.navigation}/>
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
                <Button transparent style={{ width:85, marginLeft:-10 }} onPress={() => this.logout()}>
                  <Icon name="log-out-outline" />
                </Button>
              <Body>
              <Title style={{ color: "white", fontSize:22, alignSelf:"center" }} >My Area Page</Title>
              </Body>
              <Button transparent onPress={() => this.state.navigation.navigate("Connection")}>
                  <Icon name="globe-outline" />
                </Button>
            </Header>
            <Content style= {{ position: "relative" }}>
              <View>
                {
                  this.state.displayAllAreas.length !== 0?this.state.displayAllAreas:
                  <View style={{ alignItems:"center", alignSelf:'center', marginTop:50 }}>
                    <Text style={{ color:"gray" }} >No AREA created</Text>
                    <Text style={{ marginTop:20, color:"gray", alignSelf:'center', alignItems:"center", flex:1 }}>Use the top left button to disconnect or the top</Text>
                    <Text style={{ color:"gray", alignSelf:'center', alignItems:"center", flex:1 }}>right button to connect your account</Text>
                    <Text style={{ color:"gray", alignSelf:'center', alignItems:"center", flex:1 }}>to service accounts</Text>
                  </View>
                }
              </View>
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
import React, { Component } from 'react';
import { ImageBackground, Platform, View, StyleSheet } from "react-native";
import { Footer, FooterTab, Text, Button, Container, Content, Form, Item, Input, Label, Title, Icon, Drawer, Accordion, Spinner, Picker, Header, Card, CardItem, Body, Left, Right } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { any } from 'prop-types';
import Navigation from '../Navigation/Navigation';
import CustomHeader from '../CustomHeader/CustomHeader';
import { mobileIP } from '../Login/Login';


export default class MyApps extends Component<{}, any> {

  constructor(props:any) {
    super(props);
    this.state = {
      navigation: this.props.navigation,
      loading: true,
      drawer: any,
      drawerState: false,
      token: '',
      servicesData: [],
      reactListData: [],
      showState: [],
      logoArray: [],
      actionReaction: [],
      arrayAREA: new Map()
    }
    this.getServices();
  }

  public getServices() {
    return fetch('http://' + mobileIP + ':8080/services/', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
      })
      .then((response) => response.json()).then((json) => {
        let varaa:Map<number, String> = new Map()
        let i:number = 0
        let arrayBool:Array<Boolean> = []
        console.log(json.result);
        json.result.forEach((element:String) => {
          varaa.set(i, element)
          arrayBool.push(false)
          i += 1
        });
        this.setState({showState:arrayBool})
        this.setState({servicesData:varaa})
      })
      .catch((error) => {
        console.error(error)
        alert("I GET DON'T IT, ITS " + error)
      })
    }

    public getActionReaction(service:String) {
      return fetch('http://' + mobileIP + ':8080/services/' + service, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
        })
        .then((response) => response.json()).then((json) => {
          let mapAREA:Map<String, Array<Object>> = new Map()
          mapAREA.set("Action", json.result.actions)
          mapAREA.set("Reaction", json.result.reactions)
          // console.log(mapAREA.get("Action"))
          // mapAREA.set(this.state.actionReaction)
          this.setState({actionReaction:mapAREA})
        })
        .catch((error) => {
          console.error(error)
          alert("I GET DON'T IT, ITS " + error)
        })
      }

    public listActionReaction(service:String) {
      let reactAREA = new Array()
      let i = 0
      if (this.state.actionReaction.length === 0) {
        this.getActionReaction(service)
        .then((_) => {
          reactAREA.push(
            <Text style={{ fontSize:25, fontWeight:"bold", marginBottom:20 }}>Actions</Text>
          )
          
          this.state.actionReaction.get("Action").forEach((obj:any) => {
            reactAREA.push(
              <View style={{ flex:1, height:50, marginBottom:20 }} key>
                <Text>Name: {obj["name"]}</Text>
                <Text>Description: {obj["description"]}</Text>
              </View>
            )
            i += 1
          });
          i = 0
          reactAREA.push(
            <Text style={{ fontSize:25, fontWeight:"bold", marginBottom:20}}>Reactions</Text>
          )
          this.state.actionReaction.get("Reaction").forEach((obj:any) => {
            reactAREA.push(
              <View style={{ flex:1, height:50, marginBottom:20 }}>
                <Text>Name: {obj["name"]}</Text>
                <Text>Description: {obj["description"]}</Text>
              </View>
            )
            i += 1
          });
        }).catch((error) => {
          console.error(error)
        })
        let tmpMap:Map<String, any> = new Map([...Array.from(this.state.arrayAREA.entries())]);

        tmpMap.set(service, reactAREA)
        console.log(tmpMap)
        this.setState({arrayAREA:tmpMap});
      }
    }

    public update(clef:number) {
      let arrayBool = this.state.showState
      // console.log(clef)
      arrayBool[clef] = !arrayBool[clef]
      this.setState({showState:arrayBool})
      let reactList:Array<any> = []
      let i = 0
      this.state.servicesData.forEach((elem:string, key:number) => {
        reactList.push(
          <Card style={{ borderColor:"blue" }} key={key}>
            <CardItem header button onPress={ () => this.update(key)}>
            { this.state.logoArray[key] }
              <Text>{elem}</Text>
            </CardItem>
            {
              this.state.showState[key] ?
              <CardItem button onPress={() => this.update(key)}>
              <Body>
                {
                this.state.arrayAREA.get(elem) || <Text>NOTHINGEEEE</Text>
                }
                </Body>
              </CardItem>
              :
              <CardItem button onPress={() => this.update(key)}>
              </CardItem>
            }
          </Card>
        )
        i += 1
      })
      this.setState({reactListData:reactList})
    }

    public iconServicePush() {
      // style={{color:"#1da1f2"}}



    }

    public listElem() {
      let reactList:Array<any> = []
      let iconList:Array<any> = [<Icon name="logo-twitter" style={{color:"#1da1f2"}}/>, <Icon name="logo-github" />]
      let i = 0
      if (this.state.servicesData.length === 0) {
        this.getServices()
        .then((_) => {
          
          this.state.servicesData.forEach((elem:string, key:number) => {
            this.listActionReaction(elem)
            reactList.push(
              <Card style={{ borderColor:"blue" }} key={key}>
                <CardItem header button onPress={ () => this.update(key)}>
                  { iconList[key] }
                  <Text>{elem}</Text>
                </CardItem>
                {
                  this.state.showState[i] ?
                  <CardItem button onPress={() => this.update(key)}>
                  <Body>{ this.state.arrayAREA.get(elem) || <Text> NADAAAA FRERITO </Text> }</Body>
                  </CardItem>
                  :
                  <CardItem button onPress={() => this.update(key)}>
                  </CardItem>
                }
              </Card>
            )
            i += 1
          })
          this.setState({reactListData:reactList})
          this.setState({logoArray:iconList})
        });
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
        this.listElem()
        return (
          <View>
             <Spinner color="blue" />
           </View>
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
                          {/* <Button onPress={() => this.createArea()}></Button> */}
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
              {
                this.state.reactListData || <Card style={{ borderColor:"red", borderWidth:2 }} ><CardItem header>HEADER</CardItem></Card>
              }
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
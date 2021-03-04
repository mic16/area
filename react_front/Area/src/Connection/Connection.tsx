import React, { Component } from 'react';
import { ImageBackground, Platform, View, StyleSheet } from "react-native";
import { Footer, FooterTab, Text, Button, Container, Content, Form, Item, Input, Label, Title, Icon, Drawer, Accordion, Spinner, Picker, Header, Card, CardItem, Body, Left, Right, Thumbnail, Toast } from 'native-base';
// import * as Font from 'expo-font';
// import { Ionicons } from '@expo/vector-icons';
import { Ionicons } from "react-icons/io"
import { any } from 'prop-types';
import Navigation from '../Navigation/Navigation';
import CustomHeader from '../CustomHeader/CustomHeader';
import ServiceRoute from "../ServiceRoute/ServiceRoute";
import { mobileIP, userToken } from '../Login/Login';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useLocation,
    StaticRouter,
  } from "react-router-dom";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default class Connection extends Component<{}, any> {

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
      actionReaction: [],
      arrayAREA: new Map(),
      connectMap: new Map(),
      urlRed: "",
      set: true,
      service: "",
      not_finished: true
    }
  }

  public getServices() {
    return fetch('http://' + mobileIP + ':8080/oauth/list', {
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
        
      })
    }

    public async serviceLogin(service:string) {
      let token = await this.getData();
        return fetch('http://' + mobileIP + ':8080/oauth/login/' + service, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                "User-Agent": 'chrome'
              },
            redirect: "follow",
            body: JSON.stringify({'token': token})
          })
          .then((response) => response.json()).then((json) => {
            console.log(json)
            if (json.result != undefined) {
                if (Platform.OS === "web") {
                  this.setState({not_finished:false})
                  window.location.replace(json.result)
                }
            } else {
                Toast.show({
                    text: json.error,
                    buttonText:"ok"
                })
            }
            return json
        })
          .catch((error) => {
            console.error(error)
            
          })
        }

        public listElem() {
          let reactList:Array<any> = []
          let i = 0
          if (this.state.servicesData.length === 0) {
            this.getServices()
            .then((_) => {
              let mapStyle = new Map()
              let connectMap = new Map()
              if (Platform.OS === 'web') {
                mapStyle.set("Twitter", { backgroundColor:"#1da1f2", borderRadius: 15 })
                mapStyle.set("Google", { backgroundColor:"#FF0000", borderRadius: 15 })
                mapStyle.set("Github", { backgroundColor:"black", borderRadius: 15 })
                mapStyle.set("Imgur", { backgroundColor:"#89c623", borderRadius: 15 })
              } else {
                mapStyle.set("Twitter", { backgroundColor:"#1da1f2" })
                mapStyle.set("Google", { backgroundColor:"#FF0000" })
                mapStyle.set("Github", { backgroundColor:"black" })
                mapStyle.set("Imgur", { backgroundColor:"#89c623" })
              }
              this.state.servicesData.forEach((elem:string, key:number) => {
                connectMap.set(elem, "Press to connect")
                if (this.state.connectMap.get(elem) === undefined)
                    this.setState({connectMap:connectMap})
                if (Platform.OS === 'web') {
                  reactList.push(
                    <Card style={mapStyle.get(elem)} key={key}>
                      <CardItem style={ mapStyle.get(elem)} header button onPress={ () => this.connect(elem)}>
                        <Text style={{ color:"white" }}>{elem}</Text>
                      </CardItem>
                      <CardItem style={ mapStyle.get(elem)} header button onPress={ () => this.connect(elem)}>
                        <Text style={{ color:"white" }}>{this.state.connectMap.get(elem)}</Text>
                      </CardItem>
                    </Card>
                  )
                } else {
                  reactList.push(
                    <Card style={mapStyle.get(elem)} key={key}>
                      <CardItem style={ mapStyle.get(elem)} header button onPress={ () => this.connect(elem)}>
                        <Text style={{ color:"white" }}>{elem}</Text>
                      </CardItem>
                      <CardItem style={ mapStyle.get(elem)} header button onPress={ () => this.connect(elem)}>
                        <Text style={{ color:"white" }}>{this.state.connectMap.get(elem)}</Text>
                      </CardItem>
                    </Card>
                  )
                }
                i += 1
              })
              this.setState({reactListData:reactList})
            });
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

    public getLinks() {
        return fetch('http://' + mobileIP + ':8080/oauth/links/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"token":userToken})
            })
            .then((response) => response.json()).then((json) => {
            console.log(json)
        })
            .catch((error) => {
            console.error(error)
            })
        }

    public async sendCallBack(service:string, data:any) {
        console.log("J'ENVOI DONC AU TRUC ")
        console.log(`http://${mobileIP}:8080/oauth/callback/${service}?${data}`)
        console.log(service)
        console.log(userToken)
        let token = userToken;
        if (Platform.OS === 'web') {
          token = await this.getData();
        }
        
        return fetch(`http://${mobileIP}:8080/oauth/callback/${service}?${data}` , {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              token: token
            })
            })
            .then((response) => response.json()).then((json) => {
            console.log("C4EST GOOD")
            console.log(json)
        })
            .catch((error) => {
            console.log("C4EST PAS GOOD")
            console.log(JSON.stringify({
              token: token
            }))
            console.error(error)
            })
        }
    
    public connect(service:string) {
        console.log("START TO CONNECT")
        let routetmp = <Route exact={true} path={"/oauth/" + service} component={ServiceRoute}/>
        this.setState({route:routetmp})
        this.setState({service:service})
        this.serviceLogin(service).then((response) => {
            console.log("CALL TO URL DONE")
            if (Platform.OS === "web") {
                let params = window.location.pathname.match('^https?:\/\/[^:]+:[0-9]+\/oauth\/([^\/#?]+)[\/#?](.+)$')
                if (params === null)
                  return
                if (params.length !== 3) {
                    return
                }
                console.log("QUERY IS")
                console.log(window.location.search)
                this.setState({query:window.location.search})
                this.sendCallBack(params[1], window.location.search).then(() => {
                    console.log("SEND DATA TO URL DONE")
                })
                this.setState({set:true})
            } else if (Platform.OS === "android") {
                console.log("LE SERVICE QUI EST APPELER EST " + service)
                this.state.navigation.navigate("ServiceRoute", {data:response, service:service})
                this.setState({set:true})
            }
        })
    }

  public finishOauth() {
    let params = window.location.pathname.match('^https?:\/\/[^:]+:[0-9]+\/oauth\/([^\/#?]+)[\/#?](.+)$')
    if (params === null)
      return
    if (params.length !== 3) {
        return
    }
    console.log("QUERY IS")
    console.log(window.location.search)
    this.setState({query:window.location.search})
    this.sendCallBack(params[1], window.location.search).then(() => {
        console.log("SEND DATA TO URL DONE")
    })
    this.setState({set:true})
  }


  public sendToBack(data:string) {
    let params = data.match('^https?:\/\/[^:]+:[0-9]+\/oauth\/([^\/#?]+)[\/#?](.+)$')

    if (params === null)
      return false

    console.log(`LES  ${params.length} PARAMETRE AVANT LE CALL BACK = ${params}`)

    if (params.length !== 3)
      return false

    console.log("CE QUE J4ENVOI")
    console.log(params)
    this.sendCallBack(params[1], params[2]).then(() => {
        console.log("SEND DATA TO URL FINISH")
    })
    return true
  }

  private getData = async () => {
    try {
      const value = await AsyncStorage.getItem('userToken')
      if (value !== null) {
        return (value);
      }
      return ('');
    } catch(e) {
      console.log(e);
      return ('');
    }
  }

  render() {
    if (window.location.pathname.includes("/oauth/") && this.state.not_finished) {
      this.setState({not_finished:false})
      this.finishOauth()
    }
    let service = window.location.pathname.match('^/oauth/(.+)$');

    if (service) {
      // console.log(`LES SERVICE SONT -${service[1]}- et -${this.state.service}-`)
      // console.log(`ET LES PARAMETRES SONT -${this.state.set}-`)
      if (this.state.set ) {//&& service[1] === this.state.service) {
        // console.log("DONC JE FAIS LE CALL CALLBACK")
        if (this.sendToBack(window.location.href))
          this.setState({set:false})
      }
    }
    if (this.state.loading) {
      this.listElem()
      return (
        <View>
            <Spinner color="blue" />
          </View>
      );
    }
    if (Platform.OS === 'web') {
      return (
          <Container>
            <CustomHeader/>
            <ImageBackground source={require('../../assets/login.png')} style={{ width: '100%', height: '100%' }}>
              <Navigation navigation={this.state.navigation}/>
              <View style={{height: '90%', width: '78%', right: 0, position: 'absolute'}}>
                <View style={styles.container}>
                  <View style= {{ position: "relative" }}>
                    {
                      this.state.reactListData
                    }
                  </View>
                </View>
              </View>
            </ImageBackground>
          </Container>
      )
    }
        return (
            <Container style= {{ position: "relative"}}>
            <Header>
                <Button iconLeft transparent style={{ position:"absolute", paddingRight:340 }} onPress={() => this.state.navigation.navigate("MyArea", { action: this.state.connections})}>
                <Icon name="chevron-back-outline" />
                </Button>
            <Text style={{ color: "white", fontSize:22, alignSelf:"center" }}>
                Services Connection
            </Text>
            </Header>
            <Content style= {{ position: "relative" }}>
              {
                this.state.reactListData || <Card style={{ borderColor:"red", borderWidth:2 }} ><CardItem header>HEADER</CardItem></Card>
              }
            </Content>
          {/* <StaticRouter>
            { this.state.route }
          </StaticRouter> */}
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
});
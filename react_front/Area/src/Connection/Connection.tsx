import React, { Component } from 'react';
import { ImageBackground, Platform, View, StyleSheet } from "react-native";
import { Footer, FooterTab, Text, Button, Container, Content, Form, Item, Input, Label, Title, Icon, Drawer, Accordion, Spinner, Picker, Header, Card, CardItem, Body, Left, Right, Thumbnail, Toast } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
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
  import { WebView } from 'react-native-webview';


// function AppRouter(service:string, data:JSON) {
//     return (
//         <Router>
//             <View>
//                 { data }
//             </View>
//             <Route path={"/oauth/" + service}/>
//         </Router>
//     );
// }


export default class MyApps extends Component<{}, any> {

    webview = null

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
      set: false
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

    public serviceLogin(service:string) {
        return fetch('http://' + mobileIP + ':8080/oauth/login/' + service, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
            redirect: "follow"
          })
          .then((response) => response.json()).then((json) => {
            console.log(json)
            if (json.result != undefined && Platform.OS === "web") {
                window.location.replace(json.result)
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

    public sendCallBack(service:string, data:any) {
        console.log("J'ENVOI DONC AU TRUC ")
        console.log(data)
        console.log(service)
        return fetch('http://' + mobileIP + ':8080/oauth/callback/' + service, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: data
            })
            .then((response) => response.json()).then((json) => {
            console.log("C4EST GOOD")
            console.log(json)
        })
            .catch((error) => {
            console.log("C4EST PAS GOOD")
            console.error(error)
            })
        }
    
    public connect(service:string) {
        console.log("START TO CONNECT")
        this.setState({set:false})
        let routetmp = <Route exact={true} path={"/oauth/" + service} component={ServiceRoute}/>
        this.setState({route:routetmp})
        this.serviceLogin(service).then((response) => {
            console.log("CALL TO URL DONE")
            if (Platform.OS === "web") {
                let params = window.location.pathname.match('^https?://[^:]+:[0-9]+/oauth/([^/#?]+)[/#?](.+)$')
                if (params?.length !== 2) {
                    return
                }
                let good_params = params[1] + window.location.search
                console.log("QUERY IS")
                console.log(good_params)
                this.setState({query:good_params})
                let json = JSON.stringify({
                    data:good_params,
                    token: userToken
                })
                this.sendCallBack(service, json).then(() => {
                    console.log("SEND DATA TO URL DONE")
                })
            } else if (Platform.OS === "android") {
                this.state.navigation.navigate("ServiceRoute", {data:response, service:service})
            }
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
          mapStyle.set("Twitter", { backgroundColor:"#1da1f2" })
          mapStyle.set("Google", { backgroundColor:"#FF0000" })
          mapStyle.set("Github", { backgroundColor:"black" })
          mapStyle.set("Imgur", { backgroundColor:"#89c623" })
          this.state.servicesData.forEach((elem:string, key:number) => {
            connectMap.set(elem, "Press to connect")
            if (this.state.connectMap.get(elem) === undefined)
                this.setState({connectMap:connectMap})
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
            i += 1
          })
          this.setState({reactListData:reactList})
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

  public sendToBack(data:string) {
    data = data.replace("http://localhost:8081/oauth/", "")
    data = data.replace("#", "?")

    let params = data.split("?")

    if (params.length !== 2) {
        return
    }
    console.log("CE QUE J4ENVOI")
    console.log(params)
    let json = JSON.stringify({
        data: params[1],
        token: userToken
    })
    this.sendCallBack(params[0], json).then(() => {
        console.log("SEND DATA TO URL DONE")
    })
  }

  render() {
      if (this.props.route.params !== undefined && this.state.set === false) {
          this.setState({set:true})
          this.sendToBack(this.props.route.params.data)
      }
       if (this.state.loading) {
        this.listElem()
        return (
          <View>
             <Spinner color="blue" />
           </View>
        );
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
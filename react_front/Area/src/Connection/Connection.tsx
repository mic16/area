import React, { Component } from 'react';
import { ImageBackground, Platform, View, StyleSheet } from "react-native";
import { Footer, FooterTab, Text, Button, Container, Content, Form, Item, Input, Label, Title, Icon, Drawer, Accordion, Spinner, Picker, Header, Card, CardItem, Body, Left, Right, Thumbnail } from 'native-base';
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

export function myRoute() {

}


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
      actionReaction: [],
      arrayAREA: new Map(),
      connectMap: new Map(),
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
        
      })
    }

    public serviceLogin(service:string) {
        return fetch('http://' + mobileIP + ':8080/oauth/login/' + service, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
          })
          .then(() => {
              console.log("DONE ?")
        })
          .catch((error) => {
            console.error(error)
            
          })
        }


    public myRoute(service:string) {

    }

    public sendCallBack(service:string, data:any) {
        console.log("JE LUI ENVOI DONC")
        console.log(data.concat({"token":userToken}))
        console.log("ET JE RECOIS: ")
        return fetch('http://' + mobileIP + ':8080/oauth/callback/' + service, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data.concat({"token":userToken}))
            })
            .then((response) => response.json()).then((json) => {
            console.log(json)
        })
            .catch((error) => {
            console.error(error)
            })
        }

    public useQuery() {
        return new URLSearchParams(useLocation().search);
        }
    
    public connect(service:string) {
        let routetmp = <Route exact={true} path={"/oauth/" + service} component={ServiceRoute}/>
        this.setState({route:routetmp})
        this.serviceLogin(service).then(() => {
            console.log("CALL TO URL DONE")
        })
        // let query = this.useQuery()
        // query.forEach((obj:any) => {
        //     console.log(obj)
        // })
        return
        // this.myRoute(service)
        this.serviceLogin(service).then(() => {
            console.log("CALL TO URL DONE")
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
          mapStyle.set("Youtube", { backgroundColor:"#FF0000" })
          mapStyle.set("Gmail", { backgroundColor:"#F4B400" })
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

  openCloseDrawer = () => {
    if (!this.state.drawerState)
      this.state.drawer._root.open();
    else
      this.state.drawer._root.close();
    this.setState({
      drawerState: !this.state.drawerState,
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
          <StaticRouter>
            { this.state.route }
          </StaticRouter>
          </Container>
                )
   }
}
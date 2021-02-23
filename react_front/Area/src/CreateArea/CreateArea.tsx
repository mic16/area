import React, { Component } from 'react';
import { ImageBackground, Platform, View, } from "react-native";
import { Footer, FooterTab, Text, Button, Container, Header, Content, Form, Item, Input, Label, Title, Icon, Picker, Spinner } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { mobileIP } from '../../Login';
import ConfigComponent from '../Configfield/Configfield';

export default class CreateArea extends Component<{}, any> {

  constructor(props:any) {
    super(props);
    this.state = {
      navigation: this.props.navigation,
      loading: true,
      servicesData: [],
      reactListData: [],
      reactListDataSecond: [],
      actionReact: [],
      reactionReact: [],
      areact: [],
      rreact: [],
      actionApp: "",
      action: "",
      reaction: ""
    }
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
        let var_tmp:Array<String> = []
        json.result.forEach((element:String) => {
          var_tmp.push(element);
        });
        this.setState({servicesData:var_tmp})
      })
      .catch((error) => {
        console.error(error)
        alert("I GET DON'T IT, ITS " + error)
      })
    }

    public getReaction(service:String, action:String, config:Object) {
      return fetch('http://' + mobileIP + ':8080/services/' + service + '/' + action, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            config
          })
        })
        .then((response) => response.json()).then((json) => {
          let mapAREA:Map<String, Array<Object>> = new Map(Object.entries(json.result))
          this.setState({reactionReact:mapAREA})
        })
        .catch((error) => {
          console.error(error)
          alert("I GET DON'T IT, ITS " + error)
        })
      }

    public pickerReactionService(action:String) {
      let reactReaction = new Array()
      let config:Object = new Object()
      this.getReaction(this.state.actionApp, action, config)
      .then((_) => {
      this.state.reactionReact.forEach((obj:any, name:string) => {
        obj.forEach((objs:any) => {
          this.setState({action:objs})
          reactReaction.push(
            <Picker.Item label={name} value={name} key={name}/>
          )
      });
      });
      this.setState({reactListDataSecond:reactReaction})
    });
    }

    public getAction(service:String) {
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
          this.setState({actionReact:mapAREA})
        })
        .catch((error) => {
          console.error(error)
          alert("I GET DON'T IT, ITS " + error)
        })
      }

    public pickerAction(service:String) {
      let reactAction = new Array()
      this.getAction(service)
      .then((_) => {
      this.state.actionReact.get("Action").forEach((obj:any) => {
        console.log(obj)
        reactAction.push(
          <Picker.Item label={obj["description"]} value={obj["name"]} key={obj["name"]}/>
        )
      });
      this.setState({areact:reactAction})
    });
    }

    public pickerReaction(service:string) {
      let reactReaction = new Array()
      this.getAction(service)
      .then((_) => {
        this.state.reactionReact.get(service).forEach((objs:any) => {
          reactReaction.push(
            <Picker.Item label={objs["description"]} value={objs["name"]} key={objs["name"]}/>
          )
          });
      this.setState({rreact:reactReaction})
    });
    }

    public listElem():Array<any> {
      let reactList:Array<any> = []
      if (this.state.servicesData.length === 0) {
        this.getServices()
        .then((_) => {
          
          this.state.servicesData.forEach((elem:string, key:number) => {
            reactList.push(
              <Picker.Item label={elem} value={elem} key={key}/>
            )
          })
          this.setState({reactListData:reactList})
        });
        return reactList
        }
      return reactList;
    }


  onValueChangeAppOne(value: string) {
    this.setState({
      selectedAppOne: value
    });
    console.log("Action service selected is " + value)
    if (value.length != 0)
      this.setState({actionApp:value})
    if (value.length > 2)
      this.pickerAction(value)
  }

  onValueChangeAction(value: string) {
    this.setState({
      selectedAction: value
    });
    console.log("Action of the service selected is " + value)
    if (value.length != 0) {
      this.pickerReactionService(value)
    }
  }

  onValueChangeAppTwo(value: string) {
    this.setState({
      selectedAppTwo: value
    });
    console.log("The other service selected is " + value)
    if (value === undefined)
      return
    if (value.length != 0) {
      this.setState({reactionApp:value})
      this.pickerReaction(value)
    }
  }

  onValueChangeReaction(value: string) {
    this.setState({
      selectedReaction: value
    });
    console.log("Reaction of the other service selected is " + value)
    if (value.length != 0) {
      this.setState({reaction:value})
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
                <ImageBackground source={require('../../assets/login.png')} style={{ width: '100%', height: '100%' }}>
            <Content>

            <Item style={{ alignSelf:'center', justifyContent:'center', flex: 1 }} picker>
              <Picker placeholder="Select your Service for the Action" placeholderStyle={{ color: "#bfc6ea" }} placeholderIconColor="#007aff" iosIcon={<Icon name="arrow-down" />}>
                {
                  this.state.reactListData || <Picker.Item label="No Service Available now" value="None" color="grey" />
                }
              </Picker>
            </Item>

            </Content>
            </ImageBackground>
          </Container>
        );

        return (
            <Container style= {{ position: "relative"}}>
            <Header>
            <Text style={{ color: "white", fontSize:22, alignSelf:"center" }}>
                My Create Area Page
            </Text>
            </Header>
            <Content style= {{ position: "relative" }}>
              <Text style= {{ alignSelf:'center', color:'rgba(0, 0, 0, 0.5)', marginTop:5 }} >Select the Service you want to use as Action:</Text>
            <Item style= {{ marginBottom: 10 }} >
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                placeholder="Select your SIM"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                style={{ width: undefined }}
                selectedValue={this.state.selectedAppOne}
                onValueChange={this.onValueChangeAppOne.bind(this)}
              >
                  {
                    this.state.reactListData || <Picker.Item label="Loading, please wait" value="None" color="grey" />
                  }
                </Picker>
              </Item>
              <Text style= {{ alignSelf:'center', color:'rgba(0, 0, 0, 0.5)', marginTop:5 }} >Then select the action:</Text>
              <Item style= {{ marginBottom: 10 }} >
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                placeholder="Select your SIM"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                style={{ width: undefined }}
                selectedValue={this.state.selectedAction}
                onValueChange={this.onValueChangeAction.bind(this)}
              >
                  {
                    this.state.areact || <Picker.Item label="Loading, please wait" value="None" color="grey" />
                  }
                </Picker>
                {
                  this.state.areact.length != 0 ? <Button icon style={{ marginRight:10 }} onPress={() => this.state.navigation.navigate("Config", this.state.action)} ><Icon name='settings-outline' /></Button>: <Text></Text>
                }
              </Item>
              <Icon name="arrow-down-outline" style={{ alignSelf:'center' }} />
              <Text style= {{ alignSelf:'center', color:'rgba(0, 0, 0, 0.5)', marginTop:5 }} >Select the Service to use as Reaction:</Text>
              <Item style= {{ marginBottom: 10 }} >
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                placeholder="Select your SIM"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                style={{ width: undefined }}
                selectedValue={this.state.selectedAppTwo}
                onValueChange={this.onValueChangeAppTwo.bind(this)}
              >
                  {
                    this.state.reactListDataSecond || <Picker.Item label="Loading, please wait" value="None" color="grey" />
                  }
                </Picker>
              </Item>
              <Text style= {{ alignSelf:'center', color:'rgba(0, 0, 0, 0.5)', marginTop:5 }} >Then select the reaction:</Text>
              <Item style= {{ marginBottom: 10 }} >
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                placeholder="Select your SIM"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.selectedReaction}
                onValueChange={this.onValueChangeReaction.bind(this)}
              >
                  {
                    this.state.rreact || <Picker.Item label="Loading, please wait" value="None" color="grey" />
                  }
                </Picker>
                {
                  this.state.rreact.length != 0 ? <Button icon style={{ marginRight:10 }} ><Icon name='settings-outline' /></Button>: <Text></Text>
                }
              </Item>
            <Button style={{ alignSelf:'center', marginTop:"40%" }}>
              <Text>
              Create the AREA !
              </Text>
            </Button>
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


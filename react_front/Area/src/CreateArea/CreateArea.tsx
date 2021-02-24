import React, { Component } from 'react';
import { ImageBackground, Platform, View, StyleSheet} from "react-native";
import { Footer, FooterTab, Text, Button, Container, Header, Content, Form, Item, Input, Title, Icon, Picker, Drawer, ListItem, CheckBox, Spinner } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import MyApps from '../MyApps/MyApps';
import Navigation from '../Navigation/Navigation';
import CustomHeader from '../CustomHeader/CustomHeader';
import { any } from 'prop-types';
import { mobileIP } from '../Login/Login';

export default class CreateArea extends Component<{}, any> {

  constructor(props:any) {
    super(props);
    this.state = {
      navigation: this.props.navigation,
      loading: true,
      servicesData: [],
      actionServiceList: [],
      reactionServiceList: [],
      drawer: any,
      drawerState: false,
      actionList: [],
      reactionList: {['']: any},
      actionService: '',
      reactionService: '',
      serviceAction: '',
      serviceReaction: '',
      actionNameList: [],
      reactionNameList: [],
      confirmButton: true,
      actionFieldList: [],
      reactionFieldList: [],
      isChecked: false,
      field: [],
      fieldText: '',
      token: this.props.route.params.token,
      actionFieldName: [],
      reactionFieldName: [],
      reactListData: [],
      reactListDataSecond: [],
      actionReaction: [],
      areact: [],
      actionApp: "",
      action: "",
      reactionApp: "",
      reaction: "",
      actionValue: '',
      reactionValue: '',
    }

    let reactList: Array<any> = [<Picker.Item label={''} value={0} key={0}/>];

    if (this.state.servicesData.length === 0) {
      this.getServices()
      .then((_) => {
        this.state.servicesData.forEach((elem: string, key: number) => {
          reactList.push(
            <Picker.Item label={elem} value={key + 1} key={key + 1}/>
          )
        })
        this.setState({actionServiceList: reactList});
      });
    } else {
      this.state.servicesData.forEach((elem: string, key: number) => {
        reactList.push(
          <Picker.Item label={elem} value={key + 1} key={key + 1}/>
        )
      })
      this.setState({actionServiceList: reactList});
    }
    console.log(this.state.token)
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
      })
    }

  public listElemWeb(): Array<any> {
    let reactList: Array<any> = [];

    if (this.state.servicesData.length === 0) {
      this.getServices()
      .then((_) => {
        this.state.servicesData.forEach((elem: string, key: number) => {
          reactList.push(
            <Picker.Item label={elem} value={key + 1}/>
          )
        })
        this.setState({actionServiceList: reactList})
      });
      return reactList
    } else {
      this.state.servicesData.forEach((elem: string, key: number) => {
        reactList.push(
          <Picker.Item label={elem} value={key + 1}/>
        )
      })
      this.setState({actionServiceList: reactList})
    }
    return reactList;
  }
    
  public listApp():Array<any> {
    let reactList:Array<any> = []
    if (this.state.servicesData.length === 0) {
      this.getServices()
      .then((_) => {
        this.state.servicesData.forEach((elem:string, key:number) => {
          reactList.push(
            <Picker.Item label={elem} value={elem} key={key}/>
          )
        })
        this.setState({reactListDataSecond:reactList})
      });
      return reactList
      }
    return reactList;
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
        let mapAREA:Map<String, Array<Object>> = new Map()
        console.log(json)
        Array(json.result).forEach((obj:any) => {
          console.log(obj)
        });
        // mapAREA.set("ServicesReaction", json.result)
        // mapAREA.set("Reaction", json.result.reactions)
        // this.setState({actionReaction:mapAREA})
      })
      .catch((error) => {
        console.error(error)
        alert("I GET DON'T IT, ITS " + error)
      })
    }

  public pickerReaction(action:String) {
    let reactReaction = new Array()
    let config:Object = new Object()
    // if (this.state.actionReaction.length === 0) {
    this.getReaction(this.state.actionApp, action, config)
    .then((_) => {
    // this.state.actionReaction.get("Action").forEach((obj:any) => {
    //   reactAction.push(
    //     <Picker.Item label={obj["description"]} value={obj["name"]} key={obj["name"]}/>
    //   )
    // });
    this.state.actionReaction.get("Reaction").forEach((obj:any) => {
      reactReaction.push(
        <Picker.Item label={obj["description"]} value={obj["name"]} key={obj["name"]}/>
      )
    });
    // this.setState({areact:reactAction})
    this.setState({rreact:reactReaction})
  });
  // }
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
        // mapAREA.set("Reaction", json.result.reactions)
        this.setState({actionReaction:mapAREA})
      })
      .catch((error) => {
        console.error(error)
        alert("I GET DON'T IT, ITS " + error)
      })
    }

    public pickerAction(service:String) {
      let reactAction = new Array()
      let reactReaction = new Array()
      // if (this.state.actionReaction.length === 0) {
      this.getAction(service)
      .then((_) => {
      this.state.actionReaction.get("Action").forEach((obj:any) => {
        reactAction.push(
          <Picker.Item label={obj["description"]} value={obj["name"]} key={obj["name"]}/>
        )
      });
      // this.state.actionReaction.get("Reaction").forEach((obj:any) => {
      //   reactReaction.push(
      //     <Picker.Item label={obj["description"]} value={obj["name"]} key={obj["name"]}/>
      //   )
      // });
      this.setState({areact:reactAction})
      // this.setState({rreact:reactReaction})
    });
    // }
    }

    public listElem():Array<any> {
      this.listApp()
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
      this.setState({action:value})
      this.pickerReaction(value)
    }
  }

  onValueChangeAppTwo(value: string) {
    this.setState({
      selectedAppTwo: value
    });
    console.log("The other service selected is " + value)
    if (value.length != 0) {
      this.setState({reactionApp:value})
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

  createArea = async () => {
    let test = {
      action: {
        service: this.state.actionService,
        name: this.state.serviceAction,
        config: {

        }
      },
      reaction:  {
        service: this.state.reactionService,
        name: this.state.serviceReaction,
        config: {
          
        }
      },
    token: this.state.token};
    console.log(this.state.actionFieldName)
    this.state.actionFieldName.forEach(element => {
      if (element.type === 'string')
        test.action.config[element.name] = this.state.fieldText;
      if (element.type === 'boolean')
        test.action.config[element.name] = this.state.isChecked;
    });
    // this.state.reactionFieldName
    console.log(test)
    // await fetch('http://localhost:8080/area/create', {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(test),
    // }).then((response) => response.json()).then((json) => {
    //   console.log(json.result);
    // })
    // .catch((error) => {
    //   console.error(error);
    // })
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

  changeService = async (value: any, type: string) => {
    let service = '';

    if (type === 'action') {
      this.setState({actionValue: 0, actionFieldList: [], reactionServiceList: [], actionList: [], reactionList: []});
      service = this.state.actionServiceList[value].props.label;
      this.setState({actionService: service});
      await fetch('http://localhost:8080/services/' + service, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }).then((response) => response.json()).then((json) => {
        console.log(json.result)
        let tmpActionList: Array<any> = [<Picker.Item label={''} value={0} key={0}/>];
        let tmpActionNameList: Array<any> = [];
        json.result.actions.forEach((elem: any, key: number) => {
          tmpActionList.push(
            <Picker.Item label={elem.description} value={key + 1} key={key + 1}/>
          )
          tmpActionNameList.push(json.result.actions[key])
        })
        this.setState({actionList: tmpActionList, actionNameList: tmpActionNameList});
      }).catch((error) => {
        console.error(error)
      })
    } else if (type === 'reaction') {
      service = this.state.reactionServiceList[value].props.label;
      this.setState({reactionService: service, reactionValue: 0});
      if (value === '0') {
        this.setState({reactionService: ''});
      }
    }
  }

  updateField = (key: number) => {
    this.setState({isChecked: !this.state.isChecked});
    let tmpField = this.state.field;

    tmpField[key] = <CheckBox checked={this.state.isChecked} onPress={() => this.updateField(key)}/>
    this.setState({field: tmpField});
  }

  generateField = (element: any, key: number) => {
    if (element.type === 'boolean') {
      let tmpField = this.state.field;

      tmpField.push(
        <CheckBox style={{marginTop: '10px'}} color='black' checked={this.state.isChecked} onPress={() => this.updateField(key)}/>
      )
      this.setState({field: tmpField});
    }
    if (element.type === 'string') {
      let tmpField = this.state.field;

      tmpField.push(
        <Form style={{height: '25%', marginTop: '10px'}}>
          <Input onChangeText={(text) => this.setState({fieldText: text})}/>
        </Form>
      )
    }
  }
  
  changeAction = async (value: number) => {
    this.setState({actionFieldList: [], actionValue: value, reactionServiceList: [], reactionList: []})
    if (value === '0') {
      return;
    }
    this.setState({serviceAction: this.state.actionNameList[value - 1].name})
    await fetch('http://localhost:8080/services/' + this.state.actionService + '/' + this.state.actionNameList[value - 1].name, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'with image': false,
        'string': '',
      })
    }).then((response) => response.json()).then((json) => {
      console.log(json.result)
      let tmpReactionList: {[k: string]: any} = {};
      let tmpReactionNameList = '';
      let tmpReactionServiceList = [<Picker.Item label={''} value={0} key={0}/>];
      let serviceKey = 1;
      let tmpReactionFieldList = [];
      
      for (let service in json.result) {
        if (json.result.hasOwnProperty(service)) {
          tmpReactionList[service] = [<Picker.Item label={''} value={0} key={0}/>];
          tmpReactionServiceList.push(
            <Picker.Item label={service} value={serviceKey} key={serviceKey}/>
          )
          json.result[service].forEach((reaction: any, key: number) => {
            tmpReactionList[service].push(
              <Picker.Item label={reaction.description} value={key + 1} key={key + 1}/>
            )
            tmpReactionNameList = reaction.name;
            tmpReactionFieldList.push(reaction)
          })
          serviceKey += 1;
        }
      }
      this.setState({actionFieldName: this.state.actionNameList[value - 1].fields, reactionServiceList: tmpReactionServiceList})
      let tmpActionFieldList: Array<any> = [<View key={0}></View>];

      this.state.actionNameList[value - 1].fields.forEach((element: any, key: number) => {
        this.generateField(element, key);
        tmpActionFieldList.push(
          <View key={key + 1}>
            {element.style === 'boolean' ?
              <View style={{flexDirection: "row"}}>
                {this.state.field[key]}
                <Text>
                  {element.description}
                </Text>
              </View>
            :
              <View>
                {this.state.field[key]}
                <Text style={{fontSize: 12, marginTop: '10px'}}>
                  {element.description}
                </Text>
              </View>
            }
          </View>
        )
      });
      this.setState({reactionList: tmpReactionList, reactionNameList: tmpReactionNameList, actionFieldList: tmpActionFieldList});
    }).catch((error) => {
      console.error(error)
    })
  }

  changeReaction = (value: any) => {
    if (value !== '0')
      this.setState({confirmButton: false})
    else
      this.setState({confirmButton: true});
    this.setState({serviceReaction: this.state.reactionNameList, reactionValue: value})
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
            <CustomHeader onPressButton={() => this.openCloseDrawer()}/>
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
                          <View style={{display: 'flex', flexDirection: 'row', height: '100%'}}>
                            <View style={{width: '50%', left: 0, backgroundColor: 'rgba(255, 255, 255, 0.5)', height: '100%', borderRadius: 20 }}>
                              <Form style={{ width: '90%', alignSelf:'center', marginTop: 10, height: '25%' }}>
                                <Picker style={{borderRadius: 5}} onValueChange={(value) => this.changeService(value, 'action')}>
                                  {
                                    this.state.actionServiceList
                                  }
                                </Picker>
                                <Picker style={{borderRadius: 5, marginTop: 10}} selectedValue={this.state.actionValue} onValueChange={(value) => this.changeAction(value)}>
                                  {
                                    this.state.actionList
                                  }
                                </Picker>
                                {
                                  this.state.actionFieldList
                                }
                              </Form>
                            </View>
                            <Icon style={{marginTop: 10, }} name="arrow-forward-sharp"/>
                            <View style={{width: '50%', right: 0, backgroundColor: 'rgba(255, 255, 255, 0.5)', height: '100%', borderRadius: 20 }}>
                              <Form style={{ width: '90%', alignSelf:'center', marginTop: 10, height: '25%' }}>
                                <Picker style={{borderRadius: 5}} onValueChange={(value) => this.changeService(value, 'reaction')}>
                                  {
                                    this.state.reactionServiceList
                                  }
                                </Picker>
                                <Picker style={{borderRadius: 5, marginTop: 10}} selectedValue={this.state.reactionValue} onValueChange={(value) => this.changeReaction(value)}>
                                  {
                                    this.state.reactionList[this.state.reactionService]
                                  }
                                </Picker>
                                {
                                  this.state.reactionFieldList
                                }
                              </Form>
                            </View>
                          </View>
                          <Button disabled={this.state.confirmButton} onPress={() => this.createArea()}><Text>Confirm</Text></Button>
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
          //   <Container>
          //       <ImageBackground source={require('../../assets/login.png')} style={{ width: '100%', height: '100%' }} >
          //   <Content>

          //   <Item onPress={ () => this.listElem()} style={{ alignSelf:'center', justifyContent:'center', flex: 1 }} picker>
          //     <Picker placeholder="Select your Service for the Action" placeholderStyle={{ color: "#bfc6ea" }} placeholderIconColor="#007aff" iosIcon={<Icon name="arrow-down" />}>
          //       {
          //         this.state.actionServiceList || <Picker.Item label="No Service Available now" value="None" />
          //       }
          //     </Picker>
          //   </Item>

          //   </Content>
          //   </ImageBackground>
          // </Container>
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
                    this.state.reactListData || <Picker.Item label="No Service Available now" value="None" />
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
                    this.state.areact || <Picker.Item label="No Service Available now" value="None" />
                  }
                </Picker>
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
                    this.state.reactListDataSecond || <Picker.Item label="No Service Available now" value="None" />
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
                    this.state.rreact || <Picker.Item label="No Service Available now" value="None" />
                  }
                </Picker>
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
    height: '40%',
  }
});
import React, { Component } from 'react';
import { any } from 'prop-types';
import { ImageBackground, Platform, View, StyleSheet} from "react-native";
import { Footer, FooterTab, Text, Button, Container, Header, Content, Form, Item, Input, Label, Title, Icon, Picker, Spinner, Toast, Drawer, ListItem, CheckBox, Root } from 'native-base';
// import * as Font from 'expo-font';
// import { Ionicons } from '@expo/vector-icons';
import { Ionicons } from "react-icons/io"
import { mobileIP } from '../Login/Login';
import ConfigComponent from '../Configfield/Configfield';
import Navigation from '../Navigation/Navigation';
import CustomHeader from '../CustomHeader/CustomHeader';
import { userToken } from '../Login/Login';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      responseActionField: [],
      responseReactionField: [],
      actionField: [],
      reactionField: [],
      actionFieldName: [],
      reactionFieldName: [],
      reactListData: [],
      reactListDataSecond: [],
      actionReact: [],
      reactionReact: [],
      areact: [],
      rreact: [],
      actionApp: "",
      // action: "",
      reactionApp: "",
      reaction: "",
      actionValue: '',
      reactionValue: '',
      mreaction: "",
      mapAction: [],
      mapReaction: []
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
        if (json.error != undefined) {
          Toast.show({
            text:json.error,
            buttonText:"ok"
          })
          return
        }
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

          console.log("Voici la liste/map des services que je peux use:")
          console.log(json.result)

          this.setState({reactionReact:mapAREA})
        })
        .catch((error) => {
          console.error(error)
          
        })
    }

    public pickerReactionService(action:String) {
      let reactReaction = new Array()
      let config:Object = new Object()
      this.getReaction(this.state.actionApp, action, config)
      .then((_) => {
        console.log("Je vais print chaque obj dans l'array reactionReact")
      this.state.reactionReact.forEach((obj:any, name:string) => {
        console.log(`L'Object de nom ${name} -> `)
        console.log(obj)
        obj.forEach((objs:any) => {
          console.log(`Pour l'obj ${name}, mon objs est le suivant -> `)
          console.log(objs)
          // this.setState({action:objs}) // POURQUOI J4AI ECRIS CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA ?
        });
        reactReaction.push(
          <Picker.Item label={name} value={name} key={name}/>
        )
      });
      console.log(`La longueur de l'array d'object est de ${reactReaction.length}`)
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
          
        })
      }

      public createAreaFetch(json:any) {
        return fetch('http://' + mobileIP + ':8080/area/create', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: json
          })
          .then((response) => response.json()).then((json) => {
            if (json.result !== undefined) {
            console.log(`Area Created with UUID {${json.result}}`)
            } else if (json.error !== undefined) {
              Toast.show({
                text: json.error,
                buttonText: 'Ok',
                duration: 5
              })
            }
          })
          .catch((error) => {
            console.error(error)
            
          })
        }

    public pickerAction(service:String) {
      let reactAction = new Array()
      let mapAction:Map<String, any> = new Map()
      this.getAction(service)
      .then((_) => {
      this.state.actionReact.get("Action").forEach((obj:any) => {
        console.log(`PickerAction foreach object = `)
        console.log(obj)
        mapAction.set(obj["name"], obj)
        reactAction.push(
          <Picker.Item label={obj["description"]} value={obj["name"]} key={obj["name"]}/>
        )
      });
      this.setState({areact:reactAction})
      this.setState({mapAction:mapAction})
    });
    }

    public pickerReaction(service:string) {
      let reactReaction = new Array()
      let mapReaction:Map<String, any> = new Map()
      this.getAction(service)
      .then((_) => {
        this.state.reactionReact.get(service).forEach((objs:any) => {
          mapReaction.set(objs["name"], objs)
          // console.log("HERRRE IS THE SERVICE DATA:")
          // console.log(objs["name"])
          // console.log(objs["description"])
          reactReaction.push(
            <Picker.Item label={objs["description"]} value={objs["name"]} key={objs["name"]}/>
          )
          });
      this.setState({rreact:reactReaction})
      this.setState({mapReaction:mapReaction})

      console.log(`Les data: `)
      console.log(mapReaction)
      console.log(`et la reaction selectionner `)
      console.log(this.state.selectedReaction)
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
    console.log(`Action service selected is ${value}`)
    if (value.length != 0)
      this.setState({actionApp:value})
    if (value.length > 2)
      this.pickerAction(value)
  }

  onValueChangeAction(value: string) {
    this.setState({
      selectedAction: value
    });
    console.log(`Action of the service selected is ${value}`)
    if (value.length != 0) {
      this.pickerReactionService(value)
    }
  }

  onValueChangeAppTwo(value: string) {
    this.setState({
      selectedAppTwo: value
    });
    console.log(`The other service selected is ${value}`)
    if (value === undefined)
      return
    if (value.length != 0) {
      this.setState({rreact:[]})
      this.setState({reactionApp:value})
      this.pickerReaction(value)
    }
  }

  onValueChangeReaction(value: string) {
    if (value === null)
      return
    this.setState({
      selectedReaction: value
    });
    console.log(`Reaction of the other service selected is ${value}`)
    if (value.length != 0) {
      this.setState({reaction:value})
    }
  }


  public createAreaMobile() {
    let params = this.props.route.params
    let jsonSerial = {}
    let actionSerial = {}
    let reactionSerial = {}
    if (params) {
      console.log(`Les parametres pour L'Area a créer sont:`)
      console.log(params)

      params["action"].forEach((value:any, key:string) => {  
        actionSerial[key] = value
      });

      params["reaction"].forEach((value:any, key:string) => {  
        reactionSerial[key] = value
      });

      jsonSerial = {
        "action": {
          "service": this.state.selectedAppOne,
          "name": this.state.selectedAction,
          "config": actionSerial
        },
        "reaction": {
          "service": this.state.selectedAppTwo,
          "name": this.state.selectedReaction,
          "config": reactionSerial
        },
        "token":userToken
      }

      
      console.log(`Les donées transformer en json sont: ${JSON.stringify(jsonSerial)}`)
      this.createAreaFetch(JSON.stringify(jsonSerial))

    } else
      alert("Please have a look to the config before creating an Area")
  }

  async componentDidMount() {
      // await Font.loadAsync({
      //     Roboto: require('native-base/Fonts/Roboto.ttf'),
      //     Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      //     ...Ionicons.font,
      // });
      this.setState({ loading: false });
  }

  public getData = async () => {
    try {
      const value = await AsyncStorage.getItem('userToken')
      if (value !== null) {
        return (value)
      }
    } catch(e) {
      console.log(e);
      return (null);
    }
  }

  public createAreaWeb = async () => {
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
    token: await this.getData()};
    this.state.actionFieldName.forEach((element: any, key: number) => {
      if (element.type === 'string')
        test.action.config[element.name] = this.state.responseActionField[key];
      if (element.type === 'boolean')
        test.action.config[element.name] = this.state.responseActionField[key];
    });
    this.state.reactionFieldName[this.state.reactionService][this.state.reactionValue - 1].fields.forEach((element: any, key: number) => {
      if (element.type === 'string')
        test.reaction.config[element.name] = this.state.responseReactionField[key];
      if (element.type === 'boolean')
        test.reaction.config[element.name] = this.state.responseReactionField[key];
    });
    console.log(test)
    await fetch('http://localhost:8080/area/create', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(test),
    }).then((response) => response.json()).then((json) => {
      console.log(`La réponse JSON de la création d'un Area:`);
      console.log(json)
    })
    .catch((error) => {
      console.error(error);
    })
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

  private storeData = async (item: string, value: string) => {
    try {
      await AsyncStorage.setItem(item, value)
    } catch (e) {
      console.log(e);
    }
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
      }).then((response) => response.json()).then(async (json) => {
        let tmpActionList: Array<any> = [<Picker.Item label={''} value={0} key={0}/>];
        let tmpActionNameList: Array<any> = [];
        const jsonValue = JSON.stringify(json.result.actions);
        await this.storeData('actions', jsonValue);
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
      this.setState({reactionValue: 0, reactionFieldList: []})
      service = this.state.reactionServiceList[value].props.label;
      this.setState({reactionService: service, reactionValue: 0});
      if (value === '0') {
        this.setState({reactionService: ''});
      }
    }
  }

  updateFieldBoolean = (key: number, type: string, element: Array<Object>) => {
    if (type === 'action') {
      let tmpResponseActionField = this.state.responseActionField;

      tmpResponseActionField[key] = !this.state.responseActionField[key];
      this.setState({responseActionField: tmpResponseActionField});
      let tmpField = this.state.actionField;

      tmpField[key] = <CheckBox color='black' checked={this.state.responseActionField[key]} onPress={() => this.updateFieldBoolean(key, type, element)}/>
      this.setState({actionField: tmpField});
      let tmpActionFieldList: Array<any> = this.state.actionFieldList;

      tmpActionFieldList[key + 1] =
        <View key={key + 1} style={{marginTop: 10}}>
          <View style={{display: 'flex', flexDirection: "row"}}>
            {this.state.actionField[key]}
            <Text style={{fontSize: 12, marginLeft: 20}}>
              {element.description}
            </Text>
          </View>
        </View>
      
      this.setState({actionFieldList: tmpActionFieldList})
    } else if (type === 'reaction') {
      let tmpResponseReactionField = this.state.responseReactionField;

      tmpResponseReactionField[key] = !this.state.responseReactionField[key];
      this.setState({responseReactionField: tmpResponseReactionField});
      let tmpField = this.state.reactionField;

      tmpField[key] = <CheckBox color='black' checked={this.state.responseReactionField[key]} onPress={() => this.updateFieldBoolean(key, type, element)}/>
      this.setState({reactionField: tmpField});
      let tmpReactionFieldList: Array<any> = this.state.reactionFieldList;

      tmpReactionFieldList[key + 1] =
        <View key={key + 1} style={{marginTop: 10}}>
          <View style={{display: 'flex', flexDirection: 'row'}}>
            {this.state.actionField[key]}
            <Text style={{fontSize: 12, marginLeft: 20}}>
              {element.description}
            </Text>
          </View>
        </View>
      
      this.setState({reactionFieldList: tmpReactionFieldList})
    }
  }

  updateFieldString = (text: string, key: number, type: string) => {
    if (type === 'action') {
      let tmpResponseActionField = this.state.responseActionField;

      tmpResponseActionField[key] = text;
      this.setState({responseActionField: tmpResponseActionField});
    } else if (type === 'reaction') {
      let tmpResponseReactionField = this.state.responseReactionField;

      tmpResponseReactionField[key] = text;
      this.setState({responseReactionField: tmpResponseReactionField});
    }
  }

  generateField = (element: any, key: number, type: string) => {
    if (element.type === 'boolean') {
      if (type === 'action') {
        let tmpField = this.state.actionField;
        let tmpResponseActionField = this.state.responseActionField;

        tmpResponseActionField[key] = false;
        this.setState({responseActionField: tmpResponseActionField});

        tmpField.push(
          <CheckBox color='black' checked={this.state.responseActionField[key]} onPress={() => this.updateFieldBoolean(key, type, element)}/>
        )
        this.setState({actionField: tmpField});
      } else if (type === 'reaction') {
        let tmpField = this.state.reactionField;
        let tmpResponseReactionField = this.state.responseReactionField;

        tmpResponseReactionField[key] = false;
        this.setState({responseReactionField: tmpResponseReactionField});

        tmpField.push(
          <CheckBox color='black' checked={this.state.responseReactionField[key]} onPress={() => this.updateFieldBoolean(key, type, element)}/>
        )
        this.setState({reactionField: tmpField});
      }
    }
    if (element.type === 'string') {
      let tmpField = [];
      if (type === 'action') {
        tmpField = this.state.actionField;
        let tmpResponseActionField = this.state.responseActionField;
    
        tmpResponseActionField[key] = '';
        this.setState({responseActionField: tmpResponseActionField});
      } else if (type === 'reaction') {
        tmpField = this.state.reactionField;
        let tmpResponseReactionField = this.state.responseReactionField;
    
        tmpResponseReactionField[key] = '';
        this.setState({responseReactionField: tmpResponseReactionField});
      }

      tmpField.push(
        <Form style={{height: '25%', marginTop: '10px'}}>
          <Input style={{borderWidth: 1, borderRadius: 5}} onChangeText={(text) => this.updateFieldString(text, key, type)}/>
        </Form>
      )
      if (type === 'action') {
        this.setState({actionField: tmpField});
      } else if (type === 'reaction') {
        this.setState({reactionField: tmpField});
      }
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
    }).then((response) => response.json()).then(async(json) => {
      let tmpReactionList: {[k: string]: any} = {};
      let tmpReactionNameList: {[k: string]: any} = {};
      let tmpReactionServiceList = [<Picker.Item label={''} value={0} key={0}/>];
      let serviceKey = 1;
      
      const jsonValue = JSON.stringify(json.result)
      await this.storeData('reactions', jsonValue);
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
            if (!tmpReactionNameList[service])
              tmpReactionNameList[service] = [''];
            tmpReactionNameList[service].push(reaction.name);
          })
          serviceKey += 1;
        }
      }
      this.setState({actionFieldName: this.state.actionNameList[value - 1].fields, reactionServiceList: tmpReactionServiceList})
      let tmpActionFieldList: Array<any> = [<View key={0}></View>];

      this.state.actionNameList[value - 1].fields.forEach((element: any, key: number) => {
        this.generateField(element, key, 'action');

        tmpActionFieldList.push(
          <View key={key + 1} style={{marginTop: 10}}>
            {element.type === 'boolean' ?
            <View style={{display: 'flex', flexDirection: 'row'}}>
              {this.state.actionField[key]}
              <Text style={{fontSize: 12, marginLeft: 20}}>
                {element.description}
              </Text>
            </View>
            :
              <View>
                {this.state.actionField[key]}
                <Text style={{fontSize: 12, marginTop: '10px'}}>
                  {element.description}
                </Text>
              </View>
            }
          </View>
        )
      });
      this.setState({reactionList: tmpReactionList, reactionNameList: tmpReactionNameList, actionFieldList: tmpActionFieldList, reactionFieldName: json.result});
    }).catch((error) => {
      console.error(error)
    })
  }

  changeReaction = (value: any) => {
    if (value !== '0')
      this.setState({confirmButton: false})
    else
      this.setState({confirmButton: true});
    this.setState({serviceReaction: this.state.reactionNameList[this.state.reactionService][value], reactionValue: value, reactionFieldList: []});

    if (value === '0')
      return;
    let tmpReactionFieldList: Array<any> = [<View key={0}></View>];

    this.state.reactionFieldName[this.state.reactionService][this.state.reactionValue].fields.forEach((element: any, key: number) => {
      this.generateField(element, key, 'reaction');
      tmpReactionFieldList.push(
        <View key={key + 1}>
          {element.style === 'boolean' ?
            <View style={{display: 'flex', flexDirection: "row"}}>
              {this.state.reactionField[key]}
              <Text style={{fontSize: 12}}>
                {element.description}
              </Text>
            </View>
          :
            <View>
              {this.state.reactionField[key]}
              <Text style={{fontSize: 12, marginTop: '10px'}}>
                {element.description}
              </Text>
            </View>
          }
        </View>
      )
    });
    this.setState({reactionFieldList: tmpReactionFieldList});
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
            <CustomHeader navigation={this.state.navigation}/>
            <ImageBackground source={require('../../assets/login.png')} style={{ width: '100%', height: '100%' }}>
              <View style={{height: '100%'}}>
                <View style={{flexDirection: 'row', height: '100%'}}>
                  {/* <Drawer
                    ref={(ref) => { this.state.drawer = ref }}
                    content={<Navigation navigation={this.state.navigation}/>}> */}
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
                              </Form>
                              <View style={{margin: 10}}>
                                {
                                  this.state.actionFieldList
                                }
                              </View>
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
                              </Form>
                              <View style={{margin: 10}}>
                                {
                                  this.state.reactionFieldList
                                }
                              </View>
                            </View>
                          </View>
                          <Button style={{marginLeft: 'auto',  marginTop: 10, borderRadius: 10}} disabled={this.state.confirmButton} onPress={() => this.createAreaWeb()}><Text>Confirm</Text></Button>
                        </View>
                      </View>
                    </View>
                  {/* </Drawer> */}
                </View>
              </View>
            </ImageBackground>
          </Container>
        );

        return (
          <Root>
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
                this.state.areact.length != 0 ? <Button icon style={{ marginRight:10 }} onPress={() => this.state.navigation.navigate("Config", {data: this.state.mapAction.get(this.state.selectedAction), type:"action"})} ><Icon name='settings-outline' /></Button>: <Text></Text>
              }
            </Item>
            <Icon name="arrow-down-outline" style={{ alignSelf:'center' }} />
            <Text style= {{ alignSelf:'center', color:'rgba(0, 0, 0, 0.5)', marginTop:5 }} >Select the Service to use as Reaction:</Text>
            <Item style= {{ marginBottom: 10 }} >
            <Picker
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
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
              placeholderStyle={{ color: "#bfc6ea" }}
              placeholderIconColor="#007aff"
              style={{ width: undefined }}
              selectedValue={this.state.selectedReaction}
              onValueChange={this.onValueChangeReaction.bind(this)}
              key="reactionID"
            >
                {
                  this.state.rreact || <Picker.Item label="Loading, please wait" value="None" color="grey" />
                }
              </Picker>
              {
                this.state.rreact.length != 0 ? <Button icon style={{ marginRight:10 }} onPress={() => this.state.navigation.navigate("Config", {data:this.state.mapReaction.get(this.state.selectedReaction), type:"reaction"})}><Icon name='settings-outline' /></Button>: <Text></Text>
              }
            </Item>
          <Button style={{ alignSelf:'center', marginTop:"40%" }} onPress={() => this.createAreaMobile()} >
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
          </Root>
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
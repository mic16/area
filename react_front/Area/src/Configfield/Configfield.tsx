import React, { Component } from 'react';
import { Alert, ImageBackground, Platform, View } from "react-native";
import { Spinner, Root, Text, Accordion, FooterTab, Footer, Button, Container, Header, Content, Form, Item, Input, Label, Title, Icon, Grid, Col, Left, Right, Body, Toast, CheckBox, ListItem, List } from 'native-base';
// import * as Font from 'expo-font';
// import { Ionicons } from '@expo/vector-icons';
import { Ionicons } from "react-icons/io"
import { NavigationContainer } from "react-navigation";
import { TextInput } from 'react-native-gesture-handler';

export default class ConfigComponent extends Component<{}, any> {

  constructor(props:any) {
    super(props);
    this.state = {
      navigation: this.props.navigation,
      loading: true,
      set: false,
      first: false,
      headerReact: "",
      reactData: "",
      arrayValues: new Map(),
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

  public onChangeValueString(value:any, name:string) {
    let cpy = new Map([...Array.from(this.state.arrayValues.entries())]);
    cpy.set(name, value)
    this.setState({arrayValues:cpy})
    this.setState({set:false})
  }

  public onChangeValueInt(value:any, name:string) {
    let cpy = new Map([...Array.from(this.state.arrayValues.entries())]);
    if (!Number(value) && this.isInt(Number(value))) {
      cpy.set(name, "")
      this.setState({arrayValues:cpy})
      this.setState({set:false})
      return
    }
    cpy.set(name, value)
    this.setState({arrayValues:cpy})
    this.setState({set:false})
  }

  public onChangeValueFloat(value:any, name:string) {
    let cpy = new Map([...Array.from(this.state.arrayValues.entries())]);
    if (!Number(value)) {
      cpy.set(name, "")
      this.setState({arrayValues:cpy})
      this.setState({set:false})
      return
    }
    cpy.set(name, value)
    this.setState({arrayValues:cpy})
    this.setState({set:false})
  }

  public onChangeValueArray(value:any, name:string) {
    let cpy = new Map([...Array.from(this.state.arrayValues.entries())]);
    let arrayString = value.split(',');
    cpy.set(name, arrayString)
    this.setState({arrayValues:cpy})
    this.setState({set:false})
  }

  public onPressedCheckBox(name:string) {
    let cpy = new Map([...Array.from(this.state.arrayValues.entries())]);
    if (cpy.get(name)) {
      cpy.set(name, false)
      this.setState({ arrayValues: cpy });
    } else {
      cpy.set(name, true)
      this.setState({ arrayValues: cpy });
    }
    this.setState({set:false})
  }

  public isInt(n:number) {
    return n % 1 === 0;
  }


  public createFields(obj:any) {
    let arrayField:Array<Object> = []
    if (this.state.set != true) {
      console.log(obj)
      let mapCreate:Map<string, any> = new Map()
      if (this.state.first != true) {
        obj["fields"].forEach((element:any) => {
          if (element["type"] === "boolean")
            mapCreate.set(element["name"], false)
          if (element["type"] === "string")
            mapCreate.set(element["name"], "")
          if (element["type"] === "int")
            mapCreate.set(element["name"], 0)
          if (element["type"] === "float")
            mapCreate.set(element["name"], 0.0)
          if (element["type"] === "array")
            mapCreate.set(element["name"], [])
        });
        this.setState({arrayValues:mapCreate})
        this.setState({headerReact:obj["name"]})
      }
      this.setState({first:true})
      obj["fields"].forEach((element:any) => {
        if (element["type"] === "boolean") {
          arrayField.push(
            <ListItem key={element["name"]}>
            <CheckBox onPress={() => this.onPressedCheckBox(element["name"])} checked={this.state.arrayValues.get(element["name"])}/>
            <Body><Text>{element["description"]}</Text></Body>
            </ListItem>
          )
        }
        else if (element["type"] === "string") {
          arrayField.push(
            <ListItem key={element["name"]}>
            <Input placeholder="Ex: Hello world" value={this.state.arrayValues.get(element["name"])} onChangeText={(val) => this.onChangeValueString(val, element["name"])}/>
            <Body><Text>{element["description"]}</Text></Body>
            </ListItem>
          )
        }
        else if (element["type"] === "int") {
          arrayField.push(
            <ListItem key={element["name"]}>
            <Input placeholder="Ex: 4" value={this.state.arrayValues.get(element["name"])} onChangeText={(val) => this.onChangeValueInt(val, element["name"])}/>
            <Body><Text>{element["description"]}</Text></Body>
            </ListItem>
          )
        }
        else if (element["type"] === "float") {
          arrayField.push(
            <ListItem key={element["name"]}>
            <Input placeholder="Ex: 3.2" value={this.state.arrayValues.get(element["name"])} onChangeText={(val) => this.onChangeValueFloat(val, element["name"])}/>
            <Body><Text>{element["description"]}</Text></Body>
            </ListItem>
          )
        }
        else if (element["type"] === "array") {
          arrayField.push(
            <ListItem key={element["name"]}>
            <Input placeholder="Ex: Hello, World, !" value={this.state.arrayValues.get(element["name"])} onChangeText={(val) => this.onChangeValueArray(val, element["name"])}/>
            <Body><Text>{element["description"]}</Text></Body>
            </ListItem>
          )
        }
      });

      this.setState({reactData:arrayField})
      this.setState({set:true})
    }
  }

  render() {
    if (this.props.route.params.data === undefined)
      console.log(this.props.route)
    this.createFields(this.props.route.params.data)
    if (this.state.loading) {
        console.log("JE SUIS DANS LA CONFIG")
        // console.log(this.props)
         return (
          <View>
            <Spinner color="blue" />
          </View>
         );
       }

        return (
            <Root>
            <Container style= {{ position: "relative"}}>
            <Header >
                {
                  this.props.route.params.type === "action" ?
                  <Button iconLeft transparent style={{ position:"absolute", paddingRight:340 }} onPress={() => this.state.navigation.navigate("CreateArea", { action: this.state.arrayValues})}>
                    <Icon name="chevron-back-outline" />
                  </Button>:
                  <Button iconLeft transparent style={{ position:"absolute", paddingRight:340 }} onPress={() => this.state.navigation.navigate("CreateArea", { reaction: this.state.arrayValues})}>
                  <Icon name="chevron-back-outline" />
                </Button>
                }
              <Title style={{  marginRight:0, color: "white", fontSize:22, alignSelf:"center" }} >{ this.state.headerReact + " configuration"}</Title>
            </Header>
            <Content style= {{ position: "relative" }}>
             {
             this.state.reactData
             }
            </Content>
          </Container>
          </Root>
                )
   }
}


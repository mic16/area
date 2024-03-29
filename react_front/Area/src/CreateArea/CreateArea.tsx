import React, { Component } from 'react';
import { ImageBackground, Platform, View, } from "react-native";
import { Footer, FooterTab, Text, Button, Container, Header, Content, Form, Item, Input, Label, Title, Icon, Picker } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';


export default class CreateArea extends Component<{}, any> {

  constructor(props:any) {
    super(props);
    this.state = {
      navigation: this.props.navigation,
      loading: true,
      servicesData: [],
      reactListData: []
    }
  }

  public getServices() {
    return fetch('http://localhost:8080/services/', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
      })
      .then((response) => response.json()).then((json) => {
        let var_tmp:Array<String> = []
        console.log(json.result);
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

    public listElem():Array<any> {
      let reactList:Array<any> = []
      if (this.state.servicesData.length === 0) {
        this.getServices()
        .then((_) => {
          this.state.servicesData.forEach((elem:string, key:Number) => {
            reactList.push(
              <Picker.Item label={elem} value={key}/>
            )
          })
          this.setState({reactListData:reactList})
        });
        return reactList
        }
        else {
          this.state.servicesData.forEach((elem:string, key:Number) => {
            reactList.push(
              <Picker.Item label={elem} value={key}/>
            )
          })
        }
      return reactList;
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
         return (
           <View></View>
         );
       }
       if (Platform.OS == "web")
        return (
            <Container>
                <ImageBackground source={require('../../assets/login.png')} style={{ width: '100%', height: '100%' }} >
            <Content>

            <Item onPress={ () => this.listElem()} style={{ alignSelf:'center', justifyContent:'center', flex: 1 }} picker>
              <Picker placeholder="Select your Service for the Action" placeholderStyle={{ color: "#bfc6ea" }} placeholderIconColor="#007aff" iosIcon={<Icon name="arrow-down" />}>
                {
                  this.state.reactListData || <Picker.Item label="No Service Available now" value="None" />
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


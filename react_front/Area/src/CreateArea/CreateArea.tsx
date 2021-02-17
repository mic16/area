import React, { Component } from 'react';
import { ImageBackground, Platform, View, } from "react-native";
import { Footer, FooterTab, Text, Button, Container, Header, Content, Form, Item, Input, Label, Title, Icon, Picker, Spinner } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { mobileIP } from '../../Login';

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
    return fetch('http://' + mobileIP + ':8080/services/', {
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
          let i = 0
          this.state.servicesData.forEach((elem:string, key:Number) => {
            reactList.push(
              <Picker.Item label={elem} value={i}/>
            )
            i += 1
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


  onValueChange(value: string) {
    this.setState({
      selected: value
    });
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
              <Text style= {{ alignSelf:'center', color:'rgba(0, 0, 0, 0.5)', marginTop:5 }} >Select the Service you want to use as Action:</Text>
            <Item style= {{ marginBottom: 10 }} >
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                placeholder="Select your SIM"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                style={{ width: undefined }}
                selectedValue={this.state.selected}
                onValueChange={this.onValueChange.bind(this)}
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
                selectedValue={this.state.selected}
                onValueChange={this.onValueChange.bind(this)}
              >
                  {
                    this.state.reactListData || <Picker.Item label="No Service Available now" value="None" />
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
                selectedValue={this.state.selected}
                onValueChange={this.onValueChange.bind(this)}
              >
                  {
                    this.state.reactListData || <Picker.Item label="No Service Available now" value="None" />
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
                style={{ width: undefined }}
                selectedValue={this.state.selected}
                onValueChange={this.onValueChange.bind(this)}
              >
                  {
                    this.state.reactListData || <Picker.Item label="No Service Available now" value="None" />
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


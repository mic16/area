import React, { Component } from 'react';
import { ImageBackground, Platform, View, } from "react-native";
import { Text, Button, Container, Header, Content, Form, Item, Input, Label, Title, Icon } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';


export default class LoginComponent extends Component {

  state = {
    loading: true
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
                <ImageBackground source={require('./assets/login.png')} style={{ width: '100%', height: '100%' }} >
            <Content>
                
              <Text style={{ paddingTop:'10%', fontSize:48, alignSelf:"center" }}>
              Welcome to the Area !
              </Text>
              <View style= {{ flexDirection:'row', justifyContent:'space-evenly', alignItems:'center' }}>
              <Form style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', marginTop:'10%' , justifyContent:'center', alignSelf:'center', borderRadius: 20}}>
                <Text style={{ alignSelf:'center', fontSize:22 }}>
                    Login
                </Text>
                
                <Item last style={{ alignSelf:'center' }}>
                  <Icon name="person-outline"></Icon>
                  <Label>Username: </Label>
                  <Input />
                </Item>
                <Item last>
                <Icon name="lock-closed-outline"></Icon>
                  <Label>Password: </Label>
                  <Input secureTextEntry={true}/>
                </Item>
                <Button style={{ alignItems:"center", justifyContent:'center', marginTop: 20, marginBottom: 20, width:'100%'}}>
                  <Text>
                    Login
                  </Text>
                </Button>
              </Form>
              
              <Form style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', marginTop:'10%' , justifyContent:'center', alignSelf:'center', borderRadius: 20}}>
              <Text style={{ alignSelf:'center', fontSize:22 }}>
                  Sign Up
              </Text>
              <Item last>
                  <Icon name="mail-outline"></Icon>
                  <Label>Email: </Label>
                  <Input />
                </Item>
                <Item last>
                  <Icon name="person-outline"></Icon>
                  <Label>Username: </Label>
                  <Input />
                </Item>
                <Item last>
                <Icon name="lock-closed-outline"></Icon>
                  <Label>Password: </Label>
                  <Input secureTextEntry={true}/>
                </Item>
                <Item last>
                <Icon name="lock-closed-outline"></Icon>
                  <Label>Confirm Password: </Label>
                  <Input secureTextEntry={true}/>
                </Item>
                <Button style={{ alignItems:"center", justifyContent:'center', marginTop: 20, marginBottom: 20, width:'100%'}}>
                  <Text>
                    Login
                  </Text>
                </Button>
              </Form>
              </View>
            </Content>
            </ImageBackground>
          </Container>
        );

        return (
            <Container style= {{ position: "relative"}}>
            <Header>
            <Text style={{ color: "white", fontSize:22, alignSelf:"center" }}>
                Welcome to the Area !
            </Text>
            </Header>
            <Content style= {{ position: "relative" }}>
              <Form style= {{ height: 150, position: "relative", marginTop: 10 }}>
              
                <Item floatingLabel>
                <Icon name="person-outline"></Icon>
                  <Label>Username</Label>
                  <Input />
                </Item>
                <Item floatingLabel last>
                <Icon name="lock-closed-outline"></Icon>
                  <Label>Password</Label>
                  <Input secureTextEntry={true} />
                </Item>
                </Form>
                <Button style={{ backgroundColor: "darkblue", width: '90%', height: 50, justifyContent: 'center', alignSelf: "center", marginTop: 20 }}>
                  <Text>
                    Login
                  </Text>
                </Button>
                <Text style= {{ fontSize: 12, alignSelf: 'center', marginTop: 20 }}>
                    Don't have an account yet ?
                    Create one below !
                </Text>
                <Form style= {{ height: 300, position: "relative" }}>
                <Item floatingLabel>
                <Icon name="mail-outline"></Icon>
                  <Label>Email</Label>
                  <Input />
                </Item>
                <Item floatingLabel>
                <Icon name="person-outline"></Icon>
                  <Label>Username</Label>
                  <Input />
                </Item>
                <Item floatingLabel last>
                <Icon name="lock-closed-outline"></Icon>
                  <Label>Password</Label>
                  <Input />
                </Item>
                <Item floatingLabel last>
                <Icon name="lock-closed-outline"></Icon>
                  <Label>Confirm Password</Label>
                  <Input />
                </Item>
                </Form>
            </Content>
            <Button style={{ width: '90%', height: 50, backgroundColor: 'darkblue', justifyContent: 'center', alignSelf: 'center', marginBottom: 10, alignItems: 'center', position: 'relative', bottom: 0 }}>
                <Text>
                Sign In
                </Text>
            </Button>
          </Container>
                )
   }
}


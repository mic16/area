import React, { Component } from 'react';
import { Alert, ImageBackground, Platform, View } from "react-native";
import { Root, Text, Accordion, FooterTab, Footer, Button, Container, Header, Content, Form, Item, Input, Label, Title, Icon, Grid, Col, Left, Right, Body, Toast } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from "react-navigation";
import { TextInput } from 'react-native-gesture-handler';


export default class LoginComponent extends Component<{}, any> {

  constructor(props:any) {
    super(props);
    this.state = {
      navigation: this.props.navigation,
      loading: true,
      wMail: "",
      wPassword: "",
      wRegMail: "",
      wRegPassword: "",
      wRegConfPassword: "",
      Mail: "",
      Password: "",
      RegMail: "",
      RegPassword: "",
      RegConfPassword: "",
      mobileIP: "localhost"
    }
  }

  public postLog(mail:string, password:string) {
    if (mail.length === 0) {
      Toast.show({
        text: 'Please enter your Email',
        buttonText: 'Yeeaaaaah'
      })
      return;
    }
    if (password.length === 0) {
      Toast.show({
        text: 'Password need to be at least 4 character long',
        buttonText: 'Oh okay'
      })
      return;
    }
    if (this.state.mobileIP.length === 0 && Platform.OS == "android") {
      Toast.show({
        text: 'Please set the IP server',
        buttonText: 'Ahah I forgot'
      })
      return;
    }
    fetch('http://' + this.state.mobileIP + ':8080/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mail,
        password
      })
    }).then((response) => response.json()).then((json) => {
      alert("CONNECTED WITH TOKEN: {" + json.result + "}")
      this.state.navigation.navigate('CreateArea')
    })
    .catch((error) => {
      console.error(error)
      alert("I GET DON'T IT, ITS " + error)
      return error;
    })
  }
  
  public postRegister(mail:string, password:string, confPassword:string) {
    // if (mail.length === 0 || mail.includes("@") === false || mail.includes("."))
    //   return
    if (mail.length === 0) {
      Toast.show({
        text: 'Please enter your Email',
        buttonText: 'Yeeaaaaah'
      })
      return;
    }

    if (this.state.mobileIP.length === 0 && Platform.OS == "android") {
      Toast.show({
        text: 'Please set the IP server',
        buttonText: 'Ahah I forgot'
      })
      return;
    }
    if (password === confPassword) {
      if (password.length < 4) {
        Toast.show({
          text: 'Password need to be at least 4 character long',
          buttonText: 'Oh okay'
        })
        return;
      }
      let res = fetch('http://' + this.state.mobileIP + ':8080/register', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mail,
          password
        })
      }).then((response) => response.json()).then((json) => {
        if (json.error != undefined) {
          console.error(json.error)
          return null
        }
        console.log(json.result);
        alert("Connection Sucessfull = " + json.result)
        this.state.navigation.navigate('CreateArea')
        return json.result;
      })
      .catch((error) => {
        console.error(error)
        alert("I GET DON'T IT, ITS " + error)
        return error;
      })
    } else {
      Toast.show({
        text: 'Passwords does not match',
        buttonText: 'Sorry my bad'
      })
      return;
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
    // alert("type = " + this.)
    const dataArray = [
      { title: "First Element", content: "Lorem ipsum dolor sit amet" },
      { title: "Second Element", content: "Lorem ipsum dolor sit amet" },
      { title: "Third Element", content: "Lorem ipsum dolor sit amet" }
    ];

    if (this.state.loading) {
         return (
           <View></View>
         );
       }
      //  if (Platform.OS == "web")
      //   return (
      //       <Container>
      //           <ImageBackground source={require('./assets/login.png')} style={{ width: '100%', height: '100%' }} >
      //       <Content>
                
      //         <Text style={{ paddingTop:'10%', fontSize:48, alignSelf:"center" }}>
      //         Welcome to the Area !
      //         </Text>
      //         <View style= {{ flexDirection:'row', justifyContent:'space-evenly', alignItems:'center' }}>
      //         <Form style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', marginTop:'10%' , justifyContent:'center', alignSelf:'center', borderRadius: 20}}>
      //           <Text style={{ alignSelf:'center', fontSize:22 }}>
      //               Login
      //           </Text>
                
      //           <Item last>
      //             <Icon name="mail-outline"></Icon>
      //             <Label>Email: </Label>
      //             <Input onChangeText={(text) => this.setState({wMail:text})}/>
      //           </Item>
      //           <Item last>
      //           <Icon name="lock-closed-outline"></Icon>
      //             <Label>Password: </Label>
      //             <Input secureTextEntry={true} onChangeText={(text) => this.setState({wPassword:text})}/>
      //           </Item>
      //           <Button onPress={ () => this.postLog(this.state.wMail, this.state.wPassword, this.state) } style={{ alignItems:"center", justifyContent:'center', marginTop: 20, marginBottom: 20, width:'100%'}}>
      //             <Text>
      //               Login
      //             </Text>
      //           </Button>
      //         </Form>
              
      //         <Form style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', marginTop:'10%' , justifyContent:'center', alignSelf:'center', borderRadius: 20}}>
      //         <Text style={{ alignSelf:'center', fontSize:22 }}>
      //             Sign Up
      //         </Text>
      //         <Item last>
      //             <Icon name="mail-outline"></Icon>
      //             <Label>Email: </Label>
      //             <Input onChangeText={(text) => this.setState({wRegMail:text})}/>
      //           </Item>
      //           <Item last>
      //           <Icon name="lock-closed-outline"></Icon>
      //             <Label>Password: </Label>
      //             <Input secureTextEntry={true} onChangeText={(text) => this.setState({wRegPassword:text})}/>
      //           </Item>
      //           <Item last>
      //           <Icon name="lock-closed-outline"></Icon>
      //             <Label>Confirm Password: </Label>
      //             <Input secureTextEntry={true} onChangeText={(text) => this.setState({wRegConfPassword:text})}/>
      //           </Item>
      //           <Button onPress={ () => this.postRegister(this.state.wRegMail, this.state.wRegPassword, this.state.wRegConfPassword, this.state)} style={{ alignItems:"center", justifyContent:'center', marginTop: 20, marginBottom: 20, width:'100%'}}>
      //             <Text>
      //               Sign In
      //             </Text>
      //           </Button>
      //         </Form>
      //         </View>
      //       </Content>
      //       </ImageBackground>
      //     </Container>
      //   );


        return (
            <Root>
            <Container style= {{ position: "relative"}}>
            <Header>
              <Text style={{ color: "white", fontSize:22, alignSelf:"center" }}>
                  Welcome to the Area !
              </Text>
            </Header>
            <Content style= {{ position: "relative" }}>
              <Form style= {{ height: 150, position: "relative", marginTop: 10 }}>

                <Item inlineLabel>
                <Icon name="mail-outline"></Icon>
                  <Label>Email</Label>
                  <Input onChangeText={(text) => this.setState({mail:text})}/>
                </Item>
                <Item inlineLabel last>
                <Icon name="lock-closed-outline"></Icon>
                  <Label>Password</Label>
                  <Input secureTextEntry={true} onChangeText={(text) => this.setState({password:text})} />
                </Item>
                </Form>
                <Button onPress={ () => this.postLog(this.state.wMail, this.state.wPassword, this.state) } style={{ backgroundColor: "darkblue", width: '90%', height: 50, justifyContent: 'center', alignSelf: "center", marginTop: 20 }}>
                  <Text>
                    Login
                  </Text>
                </Button>
                <Text style= {{ fontSize: 12, alignSelf: 'center', marginTop: 20 }}>
                    Don't have an account yet ?
                    Create one below !
                </Text>
                <Form style= {{ height: 200, position: "relative" }}>
                <Item inlineLabel>
                <Icon name="mail-outline"></Icon>
                  <Label>Email</Label>
                  <Input onChangeText={(text) => this.setState({RegMail:text})}/>
                </Item>
                <Item inlineLabel last>
                <Icon name="lock-closed-outline"></Icon>
                  <Label>Password</Label>
                  <Input secureTextEntry={true} onChangeText={(text) => this.setState({RegPassword:text})} />
                </Item>
                <Item inlineLabel last>
                <Icon name="lock-closed-outline"></Icon>
                  <Label>Confirm Password</Label>
                  <Input secureTextEntry={true} onChangeText={(text) => this.setState({RegConfPassword:text})} />
                </Item>
                </Form>
                <View style= {{ position: "relative" }}>
                  <Item>
                    <Icon name="git-network-outline" ></Icon>
                    <Input placeholder="Enter the IP of the server" onChangeText={(text) => this.setState({mobileIP:text})} />
                  </Item>
                </View>

            </Content>
            <Button onPress={ () => this.postRegister(this.state.RegMail, this.state.RegPassword, this.state.RegConfPassword, this.state)} style={{ width: '90%', height: 50, backgroundColor: 'darkblue', justifyContent: 'center', alignSelf: 'center', marginBottom: 10, alignItems: 'center', position: 'relative', bottom: 0 }}>
                <Text>
                Sign In
                </Text>
            </Button>
          </Container>
          </Root>
                )
   }
}


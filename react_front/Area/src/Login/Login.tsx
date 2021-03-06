import React, { Component } from 'react';
import { ImageBackground, Platform, View } from 'react-native';
import { Spinner, Root, Text, Button, Container, Header, Content, Form, Item, Input, Label, Icon, Toast } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';

export let mobileIP = ''
export let userToken = ''

export default class LoginComponent extends Component<{}, any> {

  constructor(props:any) {
    super(props);
    this.state = {
      navigation: this.props.navigation,
      loading: true,
      wMail: '',
      wPassword: '',
      wRegMail: '',
      wRegPassword: '',
      wRegConfPassword: '',
      Mail: '',
      Password: '',
      RegMail: '',
      RegPassword: '',
      RegConfPassword: '',
      firstLoad: true
    }
  }

  public postLog(mail:string, password:string) {
    if (mail.length === 0) {
      this.popUpAlert('Please enter your email', 'Ok');
      return;
    }
    if (password.length === 0) {
      this.popUpAlert('Password needs to be at least 4 characters long', 'Ok');
      return;
    }
    if (mobileIP.length === 0 && Platform.OS == 'android') {
      this.popUpAlert('Please enter the IP of the server', 'Ok');
      return;
    }
    this.setState({loading: true});
    fetch('http://' + mobileIP + ':8080/login', {
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
      this.setState({loading: false});
      if (json.result === undefined) {
        this.popUpAlert('Bad user info, please create your account below', 'Ok');
        return
      }
      userToken = json.result
      this.storeData('userToken', userToken);
      this.setState({firstLoad: true})
      this.state.navigation.navigate('CreateArea')
    })
    .catch((error) => {
      this.setState({ loading: false });
      console.error(error)
      return error;
    })
  }

  private storeData = async (item: string, value: string) => {
    try {
      await AsyncStorage.setItem(item, value)
    } catch (e) {
      console.log(e);
    }
  }

  public popUpAlert(text: string, buttonText: string) {
    if (Platform.OS === 'web') {
      alert(text);
      return;
    }
    Toast.show({
      text: text,
      buttonText: buttonText
    })
  }
  
  public postRegister(mail: string, password: string, confPassword: string) {
    if (mail.length === 0) {
      this.popUpAlert('Please enter your email', 'Ok');
      return;
    }
    if (mobileIP.length === 0 && Platform.OS == 'android') {
      this.popUpAlert('Please enter the IP of the server', 'Ok');
      return;
    }
    if (password === confPassword) {
      if (password.length < 4) {
        this.popUpAlert('Password needs to be at least 4 characters long', 'Ok');
        return;
      }
      this.setState({ loading: true });
      fetch('http://' + mobileIP + ':8080/register', {
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
        this.setState({ loading: false });
        if (json.error != undefined) {
          console.error(json.error)
          this.popUpAlert(json.error, 'Ok');
          return null
        }
        userToken = json.result
        this.storeData('userToken', userToken);
        this.setState({firstLoad:true})
        this.state.navigation.navigate('CreateArea')
        return json.result;
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.error(error)
        return error;
      })
    } else {
      this.popUpAlert('Password does not match', 'Ok');
      return;
    }
  }

  async componentDidMount() {
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

  render() {
    if (Platform.OS === 'web' && window.location.pathname.includes('/oauth/') && this.getData()) {
      this.state.navigation.navigate('Connection')
    }

    if (this.state.firstLoad) {
      this.setState({
        wMail: '',
        wPassword: '',
        wRegMail: '',
        wRegPassword: '',
        wRegConfPassword: '',
        Mail: '',
        Password: '',
        RegMail: '',
        RegPassword: '',
        RegConfPassword: '',
        firstLoad: false
      });
    }
    if (this.state.loading) {
      return (
        <View>
          <Spinner color='blue'/>
        </View>
      );
    }
    if (Platform.OS == 'web') {
      mobileIP = 'localhost'
      return (
        <Container>
          <ImageBackground source={require('../../assets/login.png')} style={{width: '100%', height: '100%'}}>
            <Content>
              <Text style={{paddingTop:'10%', fontSize:48, alignSelf:'center'}}>
                Welcome to the Area !
              </Text>
              <View style= {{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center'}}>
                <Form style={{backgroundColor: 'rgba(255, 255, 255, 0.5)', marginTop: '10%', justifyContent: 'center', alignSelf: 'center', borderRadius: 20}}>
                  <Text style={{alignSelf: 'center', fontSize: 22}}>
                    Login
                  </Text>
                  <Item last>
                    <Icon name='mail-outline'></Icon>
                    <Label>Email:</Label>
                    <Input onChangeText={(text) => this.setState({wMail: text})}/>
                  </Item>
                  <Item last>
                    <Icon name='lock-closed-outline'></Icon>
                    <Label>Password:</Label>
                    <Input secureTextEntry={true} onChangeText={(text) => this.setState({wPassword: text})}/>
                  </Item>
                  <Button onPress={() => this.postLog(this.state.wMail, this.state.wPassword, this.state)} style={{alignItems:'center', justifyContent:'center', marginTop: 20, marginBottom: 20, width:'100%'}}>
                    <Text>
                      Login
                    </Text>
                  </Button>
                </Form>
                <Form style={{backgroundColor: 'rgba(255, 255, 255, 0.5)', marginTop: '10%', justifyContent: 'center', alignSelf: 'center', borderRadius: 20}}>
                  <Text style={{alignSelf: 'center', fontSize: 22}}>
                    Sign Up
                  </Text>
                  <Item last>
                    <Icon name='mail-outline'></Icon>
                    <Label>Email:</Label>
                    <Input onChangeText={(text) => this.setState({wRegMail: text})}/>
                  </Item>
                  <Item last>
                    <Icon name='lock-closed-outline'></Icon>
                    <Label>Password:</Label>
                    <Input secureTextEntry={true} onChangeText={(text) => this.setState({wRegPassword: text})}/>
                  </Item>
                  <Item last>
                    <Icon name='lock-closed-outline'></Icon>
                    <Label>Confirm Password:</Label>
                    <Input secureTextEntry={true} onChangeText={(text) => this.setState({wRegConfPassword: text})}/>
                  </Item>
                  <Button onPress={() => this.postRegister(this.state.wRegMail, this.state.wRegPassword, this.state.wRegConfPassword, this.state)} style={{alignItems:'center', justifyContent:'center', marginTop: 20, marginBottom: 20, width:'100%'}}>
                    <Text>
                      Sign In
                    </Text>
                  </Button>
                </Form>
              </View>
            </Content>
          </ImageBackground>
        </Container>
      );
    }

    return (
        <Root>
        <Container style= {{ position: 'relative'}}>
        <Header>
          <Text style={{ color: 'white', fontSize:22, alignSelf:'center' }}>
              Welcome to the Area !
          </Text>
        </Header>
        <Content style= {{ position: 'relative' }}>
          <Form style= {{ height: 150, position: 'relative', marginTop: 10 }}>

            <Item inlineLabel>
            <Icon name='mail-outline'></Icon>
              <Label>Email</Label>
              <Input onChangeText={(text) => this.setState({Mail:text})}/>
            </Item>
            <Item inlineLabel last>
            <Icon name='lock-closed-outline'></Icon>
              <Label>Password</Label>
              <Input secureTextEntry={true} onChangeText={(text) => this.setState({Password:text})} />
            </Item>
            </Form>
            <Button onPress={ () => this.postLog(this.state.Mail, this.state.Password, this.state) } style={{ backgroundColor: 'darkblue', width: '90%', height: 50, justifyContent: 'center', alignSelf: 'center', marginTop: 20 }}>
              <Text>
                Login
              </Text>
            </Button>
            <Text style= {{ fontSize: 12, alignSelf: 'center', marginTop: 20 }}>
                Don't have an account yet ?
                Create one below !
            </Text>
            <Form style= {{ height: 200, position: 'relative' }}>
            <Item inlineLabel>
            <Icon name='mail-outline'></Icon>
              <Label>Email</Label>
              <Input onChangeText={(text) => this.setState({RegMail:text})}/>
            </Item>
            <Item inlineLabel last>
            <Icon name='lock-closed-outline'></Icon>
              <Label>Password</Label>
              <Input secureTextEntry={true} onChangeText={(text) => this.setState({RegPassword:text})} />
            </Item>
            <Item inlineLabel last>
            <Icon name='lock-closed-outline'></Icon>
              <Label>Confirm Password</Label>
              <Input secureTextEntry={true} onChangeText={(text) => this.setState({RegConfPassword:text})} />
            </Item>
            </Form>
            <View style= {{ position: 'relative' }}>
              <Item>
                <Icon name='git-network-outline' ></Icon>
                <Input placeholder='Enter the IP of the server' onChangeText={(text) => mobileIP = text} />
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


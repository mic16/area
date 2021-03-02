import React, { Component } from 'react';
import { ImageBackground, Platform, View } from "react-native";
import { Footer, FooterTab, Text, Container, Header, Content, Form, Item, Input, Label, Title, Icon, Button, Left, Right } from 'native-base';
import LoginComponent from '../Login/Login';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from "react-icons/io"
import MyArea from '../MyArea/MyArea';
import MyApps from '../MyApps/MyApps';
import CreateArea from '../CreateArea/CreateArea';
import ConfigComponent from '../Configfield/Configfield'
import Connection from '../Connection/Connection';
import ServiceRoute from "../ServiceRoute/ServiceRoute";

const Stack = createStackNavigator();
export default class MenuComponent extends Component {

  constructor(props:any) {
    super(props);
    this.state = {
      navigation: this.props.navigation,
      loading: true
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

  render() {
       if (this.state.loading) {
         return (
           <View></View>
         );
       }

        return (
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="LoginComponent" component={LoginComponent}
              options={{headerShown: false}}/>
              <Stack.Screen name="CreateArea" component={CreateArea}
              options={{headerShown: false}}/>
              <Stack.Screen name="MyArea" component={MyArea}
              options={{headerShown: false}}/>
              <Stack.Screen name="MyApps" component={MyApps}
              options={{headerShown: false}}/>
              <Stack.Screen name="Config" component={ConfigComponent}
              options={{headerShown: false}}/>
              <Stack.Screen name="Connection" component={Connection}
              options={{headerShown: false}}/>
              <Stack.Screen name="ServiceRoute" component={ServiceRoute}
              options={{headerShown: false}}/>
            </Stack.Navigator>
          </NavigationContainer>
      );
   }
}


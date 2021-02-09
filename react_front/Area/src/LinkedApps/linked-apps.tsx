import React, { Component } from 'react';
import { AppRegistry, TextInput } from "react-native";
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import Navigation from '../Navigation/navigation';
import { Drawer } from 'native-base'
import Header from '../Header/header'
import { any } from 'prop-types';

export default class LinkedApps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navigation: this.props.navigation,
      drawerState: false,
      drawer: any,
    }
    console.log("test")
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

  render() {
    return (
      <View style={styles.navigation}>
        <Header onPressButton={() => this.openCloseDrawer()}/>
        <Drawer
          ref={(ref) => { this.state.drawer = ref; }}
          content={<Navigation navigation={this.state.navigation}/>}>
          <View style={styles.container}>
            
          </View>
        </Drawer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  navigation: {
    height: '100%',
  },
  container: {
    borderWidth: 0.5,
    width: '78%',
    margin: 5,
    marginRight: 10,
    borderRadius: 25,
    height: '99%',
    shadowOffset:{  width: 5,  height: 5,  },
    shadowColor: 'black',
    shadowOpacity: 0.5,
    position: 'absolute',
    right: 0,
  },
});
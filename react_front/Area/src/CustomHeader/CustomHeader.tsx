import React, { Component } from 'react';
import { Alert, StyleSheet, View, Platform } from 'react-native';
import { Container, Button, Text, Drawer, Icon } from 'native-base';
import { render } from 'react-dom';
import { mobileIP } from '../Login/Login';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class CustomHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navigation: this.props.navigation,
    }
  }

  private getData = async () => {
    try {
      const value = await AsyncStorage.getItem('userToken')
      if (value !== null) {
        return (value);
      }
      return ('');
    } catch(e) {
      console.log(e);
      return ('');
    }
  }

  private storeData = async (item: string, value: string) => {
    try {
      await AsyncStorage.setItem(item, value)
    } catch (e) {
      console.log(e);
    }
  }

  public async logout() {
    console.log("Je vais me logout")
    let token = await this.getData();
    return fetch('http://' + mobileIP + ':8080/logout', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "token": token,
          })
        })
        .then((response) => response.json()).then(async(json) => {
          if (json.result === undefined) {
            alert('Logout failed');
            return;
          }
          await this.storeData('userToken', undefined);
          this.state.navigation.navigate("LoginComponent")
        })
        .catch((error) => {
          console.error(error)
        })
  }

  render() {
    return (
      <View style={styles.header}>
          <Button style={{position: 'absolute', right: 0}} transparent onPress={() => this.logout()}>
            <Icon color='black' name='log-out-outline' />
          </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: '5%',
    backgroundColor: '#3c84c7',
    
  }
});
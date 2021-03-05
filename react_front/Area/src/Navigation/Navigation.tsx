import { type } from 'os';
import React, { Component } from 'react';
import { AppRegistry, TextInput } from "react-native"
import { Alert, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Container, Button, Text } from 'native-base';
import { relative } from 'path';
import { NativeRouter, Route, Link } from "react-router-native";
import CreateArea from '../CreateArea/CreateArea';
import MyArea from '../MyArea/MyArea';
import Connection from '../Connection/Connection';

export default function Navigation({navigation}) {
  return(
    <View style={{height: '90%', width: '18%'}}>
      <View style={styles.container}>
        <Button
          style={styles.button}
          onPress={() => navigation.navigate('CreateArea')}
          transparent={true}
          full={true}
        >
          <Text>
            Create Area
          </Text>
        </Button>
        <Button
          style={styles.button}
          onPress={() => navigation.navigate('MyArea')}
          transparent={true}
          full={true}
        >
          <Text>
            My Areas
          </Text>
        </Button>
        <Button style={styles.button}
          onPress={() => navigation.navigate('Connection')}
          transparent={true}
          full={true}>
            <Text>
              Connect Accounts
            </Text>
          </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 5,
    borderRadius: 25,
    height: '100%',
    width: '100%',
    position: 'absolute',
    marginLeft: 10,
    left: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.5)'
  },
  button: {
    width: '100%',
  },
  icon: {
    
  },
});
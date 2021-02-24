import { type } from 'os';
import React, { Component } from 'react';
import { AppRegistry, TextInput } from "react-native"
import { Alert, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Container, Button, Text } from 'native-base';
import { relative } from 'path';

export default function Navigation({ navigation }) {
  return (
    <View style={{height: '93%', width: '20%'}}>
      <View style={styles.container}>
        <Button
          style={styles.button}
          // onPress={() => navigation.navigate('Home')}
          transparent={true}
          full={true}
        >
        </Button>
        <Button
          style={styles.button}
          // onPress={() => navigation.navigate('LinkedApps')}
          transparent={true}
          full={true}
        >
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.5,
    margin: 5,
    borderRadius: 25,
    height: '100%',
    width: '100%',
    shadowOffset:{  width: 5,  height: 5,  },
    shadowColor: 'black',
    shadowOpacity: 0.5,
    position: 'absolute',
  },
  button: {
    width: '100%',
  },
  icon: {
    
  },
});
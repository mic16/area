import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

export function printing(str: string) {
  alert(str)
}
let val = ""
export function saveVar(str: string) {
  val = str
}
import { AppRegistry, TextInput, TouchableOpacity, TouchableOpacityBase } from "react-native"
import { Alert, StyleSheet, View } from 'react-native';
import { Text, Button, Container, Header, Content, Form, Item, Input, Label, Title, Root } from 'native-base';
import { Font } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import LoginComponent from './src/Login/Login';
import MenuComponent from './src/Menu/Menu';
import Menu from './src/Menu/Menu';

const Stack = createStackNavigator();

export default function App() {
  return (
    // <Root>
    <Menu></Menu>
    // </Root>
  );
}

const styles = {
  container: {
    color: 'white',
  },
  loginContainer: {
    backgroundColor: 'lightcyan',
    marginTop: 150,
    borderRadius: 10,
    width: '75%',
    height: '45%',
  },
  titleView: {
    alignItems: 'center'
  },
  title: {
    color: 'darkblue',
    fontSize: 34,
    marginTop: 50,
    fontStyle: 'normal'
  },
  inputLog: {
    borderWidth: 1,
    borderColor: "darkblue",
    backgroundColor: "white"
  }
};

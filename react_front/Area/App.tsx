import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { AppRegistry, TextInput, TouchableOpacity, TouchableOpacityBase } from "react-native"
import { Alert, StyleSheet, View } from 'react-native';
import { Text, Button, Container, Header, Content, Form, Item, Input, Label, Title } from 'native-base';
import { Font } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import LoginComponent from './Login';
import MenuComponent from './Menu';
import Menu from './Menu';

export default function App() {
  return (
    <Menu></Menu>
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

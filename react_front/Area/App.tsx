import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRegistry, LogBox, Platform, TextInput, TouchableOpacity, TouchableOpacityBase } from "react-native";
import Menu from './src/Menu/Menu';

console.disableYellowBox = true;
if (Platform.OS !== 'web')
  LogBox.ignoreAllLogs(true)

export function printing(str: string) {
  alert(str)
}
let val = ""
export function saveVar(str: string) {
  val = str
}

export default function App() {
  return (
    <Menu></Menu>
  );
}
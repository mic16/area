import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { AppRegistry, TextInput } from "react-native"
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import Home from './src/Home/home';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LinkedApps from './src/LinkedApps/linked-apps'

export function printing(str: string) {
  alert(str)
}
let val = ""
export function saveVar(str: string) {
  val = str
}

const Stack = createStackNavigator();

export default function App() {
  return (
    // <View style={styles.container}>
    //   <TextInput
    //     style={{ height:20, width:300, borderColor: 'black', borderWidth: 3 }}
    //     onChangeText={text => saveVar(text)}
    //   />
    //   <Text>Open aaa App.tsx to start working on your app!</Text>
    //   <StatusBar style="auto" />
    //   <Button
    //     title="Login"
    //     onPress={() => printing(val)}
    //   />
    // </View>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="LinkedApps" component={LinkedApps} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

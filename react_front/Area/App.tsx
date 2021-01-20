import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { AppRegistry, TextInput } from "react-native"
import { Alert, Button, StyleSheet, Text, View } from 'react-native';

export function printing(str: string) {
  alert(str)
}
let val = ""
export function saveVar(str: string) {
  val = str
}

export default function App() {
  return (
    <View style={styles.container}>
      <TextInput
        style={{ height:20, width:300, borderColor: 'black', borderWidth: 3 }}
        onChangeText={text => saveVar(text)}
      />
      <Text>Open aaa App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
      <Button
        title="Login"
        onPress={() => printing(val)}
      />
    </View>
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

import React, { Component } from 'react';
import { AppRegistry, TextInput } from "react-native"
import { Alert, Button, StyleSheet, Text, View } from 'react-native';

export default function Home({ navigation }) {
  return (
    <View>
      <Button
        title="Home"
        onPress={() => navigation.navigate('Home')}
      />
      <Button
        title="LinkedApps"
        onPress={() => navigation.navigate('LinkedApps')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderWidth: 0.5,
    width: '20%',
    margin: 5,
    borderRadius: 25,
    height: '99%',
    shadowOffset:{  width: 5,  height: 5,  },
    shadowColor: 'black',
    shadowOpacity: 0.5,
  },
  test: {
    backgroundColor: 'blue',
  }
});
import React, { Component } from 'react';
import { AppRegistry, TextInput } from "react-native";
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import Navigation from '../Navigation/navigation';

export default function LinkedApps({ navigation }) {
  return (
    <View style={styles.navigation}>
      <Navigation navigation={navigation}/>
      <View style={styles.container}>
        
      </View>
    </View>
  );
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
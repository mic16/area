import { type } from 'os';
import React, { Component } from 'react';
import { AppRegistry, TextInput } from "react-native"
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Navigation({ navigation }) {
  return (
    <View style={styles.container}>
      <Button
        title="Home"
        type="clear"
        icon={
          <Icon
            name="home"
            size={15}
            color="grey"
            style={styles.icon}
          />
        }
        iconRight={true}
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
      />
      <Button
        title="LinkedApps"
        type="clear"
        icon={
          <Icon
            name="link"
            size={15}
            color="grey"
            style={styles.icon}
          />
        }
        iconRight={true}
        style={styles.button}
        onPress={() => navigation.navigate('LinkedApps')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.5,
    width: '20%',
    margin: 5,
    borderRadius: 25,
    height: '99%',
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
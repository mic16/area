import React, { Component } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Container, Button, Text, Drawer, Icon } from 'native-base';
import { render } from 'react-dom';

export default class CustomHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navigation: this.props.navigation,
    }
  }

  // openDrawer = () => {
  //   this.props.onPressButton();
  // }

  render() {
    return (
      <View style={styles.header}>
          {/* <Button style={{position: 'absolute', right: 0}} transparent onPress={() => this.state.navigation.navigate("Connection")}>
            <Icon color='black' name="globe-outline" />
          </Button> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: '5%',
    backgroundColor: '#3c84c7',
    
  }
});
import React, { Component } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Container, Button, Text, Drawer } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { render } from 'react-dom';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }

  openDrawer = () => {
    this.props.onPressButton();
  }

  render() {
    return (
      <View style={styles.header}>
        <Button
            transparent={true}
            full={true}
            icon={true}
            style={{position: 'absolute', left: 0, marginLeft: 10}}
            onPress={() => this.openDrawer()}
          >
            <Icon size={25} name="list" style={{width: '100%', height: '100%'}}/>
          </Button>
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
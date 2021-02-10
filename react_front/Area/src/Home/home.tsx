import React, { Component } from 'react';
import { AppRegistry, TextInput } from "react-native";
import { Alert, StyleSheet, View } from 'react-native';
import Navigation from '../Navigation/navigation';
import { Container, Button, Text, Form, Input, Drawer, Content } from 'native-base';
import Header from '../Header/header'
import { relative } from 'path';
import { any } from 'prop-types';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navigation: this.props.navigation,
      drawer: any,
      drawerState: false,
    }
  }

  openCloseDrawer = () => {
    if (!this.state.drawerState)
      this.state.drawer._root.open();
    else
      this.state.drawer._root.close();
    this.setState({
      drawerState: !this.state.drawerState,
    })
  }

  getServices = () => {

  }

  render() {
    return (
      <Container>
        <View style={styles.navigation}>
          <Header onPressButton={() => this.openCloseDrawer()}/>
          <View style={{flexDirection: 'row', height: '100%'}}>
            <Drawer
              ref={(ref) => { this.state.drawer = ref; }}
              content={<Navigation navigation={this.state.navigation}/>}>
              <View style={{height: '93%', width: '78%', right: 0, position: 'absolute'}}>
                <View style={styles.container}>
                  <Text style={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    fontSize: 30,
                    fontWeight: 'bold',
                    marginBottom: 10,
                    marginTop: 10,
                  }}>
                    Area
                  </Text>
                  <View style={styles.smallContainer}>
                    <Text style={{marginLeft: 'auto', marginRight: 'auto', marginTop: 10, marginBottom: 10}}>
                      Select the apps you want to link!
                    </Text>
                    <Form>
                      <Input
                        style={{width: "30%", marginLeft: 10, marginBottom: 10, borderWidth: 1, borderRadius: 5}}
                        />
                    </Form>
                  </View>
                </View>
              </View>
            </Drawer>
          </View>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  navigation: {
    height: '100%',
  },
  container: {
    borderWidth: 0.5,
    width: '100%',
    margin: 5,
    marginRight: 10,
    borderRadius: 25,
    height: '100%',
    shadowOffset:{  width: 5,  height: 5,  },
    shadowColor: 'black',
    shadowOpacity: 0.5,
    position: 'absolute',
    right: 0,
  },
  smallContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
    borderWidth: 0.5,
    width: '60%',
    borderRadius: 25,
    height: '20%',
    shadowOffset:{  width: 5,  height: 5,  },
    shadowColor: 'black',
    shadowOpacity: 0.5,
  }
});
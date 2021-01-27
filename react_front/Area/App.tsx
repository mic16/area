import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { AppRegistry, TextInput, TouchableOpacity, TouchableOpacityBase } from "react-native"
import { Alert, StyleSheet, View } from 'react-native';
import { Text, Button, Container, Header, Content, Form, Item, Input, Label, Title } from 'native-base';

export default function App() {
  return (
    <Container>
        <Header />
        <Title>
          Welcome to the Area !
        </Title>
        <Content>
          <Form>
            <Item fixedLabel>
              <Label>Username</Label>
              <Input />
            </Item>
            <Item fixedLabel last>
              <Label>Password</Label>
              <Input />
            </Item>
            <Button>
              <Text>
                Login
              </Text>
            </Button>
          </Form>
        </Content>
      </Container>
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

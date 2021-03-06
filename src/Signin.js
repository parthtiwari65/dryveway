'use strict';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
var Button = require('./Button');
var Parse = require('parse/react-native');

class Signin extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      errorMessage: ""
    };
  }

  render() {
    const { page } = this.state;
    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.keyboardScroll}>
      <View style={styles.container}>
      <Text style={[styles.titleContainer, {marginBottom: 30}]}> Please log in here </Text>
      <Text style={styles.titleContainer}> Username: </Text>

          <TextInput
            style={styles.textInputContainer}
            onChangeText={(text) => this.setState({username: text})}
            value={this.state.username}/>

      <Text style={styles.titleContainer}> Password: </Text>

      <TextInput
        style={styles.textInputContainer}
        onChangeText={(text) => this.setState({password: text})}
        value={this.state.password}
        secureTextEntry={true}/>

        <Text>{this.state.errorMessage}</Text>
        <Button text="Log in" onPress={this.onLoginPress.bind(this)}/>
        <Button text="I don't have an account"
                onPress={this.onForgotPress.bind(this)}/>
      </View>
      </KeyboardAwareScrollView>
    );
  }
  onLoginPress(){
    this.setState({errorMessage: "Loading..."})
    if (this.state.username.trim().length == 0) {
      this.setState({
        username: '',
        errorMessage: 'Please enter username'
      });
      return;
    }
    if (this.state.password.trim().length == 0) {
      this.setState({
        password: '',
        errorMessage: 'Please enter password'
      });
      return;
    }
    Parse.User.logIn(this.state.username, this.state.password, {
      success: (user) => {
        this.setState({errorMessage: ""})
        this.props.navigator.immediatelyResetRouteStack([{ name: 'main' }]);
      },
      error: (user, error) => {
        this.setState({errorMessage: error.message});
      }
    });
  }
  onForgotPress(){
    this.props.navigator.pop();
  }
}

const styles = StyleSheet.create({
  keyboardScroll: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  titleContainer: {
    fontSize: 20,
    fontFamily: 'Helvetica',
  },
  textInputContainer: {
    padding: 4,
    margin: 5,
    borderWidth: 1,
    borderRadius: 10,
    width: 200,
    height: 40,
    fontFamily: 'Helvetica',
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
});

module.exports = Signin;

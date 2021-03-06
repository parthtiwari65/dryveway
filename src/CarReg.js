'use strict';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
var Button = require('./Button');
var Parse = require('parse/react-native');
var VerifyThings = require('./VerifyThings');

class CarReg extends Component {

  constructor(props) {
    super(props);
    this.state = {
      carNumber1: "",
      carState1: "",
      carNumber2: "",
      carState2: "",
      errorMessage: "",
      carEntry: false,
      username: "",
    };
  }

  componentWillMount() {
    var currentUser = Parse.User.current();
    var test = JSON.stringify(currentUser);
    var userinfo = eval ("(" + test + ")");
    this.setState({username: userinfo.username});
  }

  render() {
    const { page } = this.state;
    var carFields =<View/>;
    var vehicleText = "Add another vehicle";
    if(this.state.carEntry) {
        vehicleText = "Remove 2nd vehicle";
        carFields =<View style={styles.addCarView}>
                      <Text style={styles.titleContainer}> License plate number:</Text>
                        <TextInput
                          style={styles.textInputContainer}
                          maxLength = {7}
                          autoCorrect={false}
                          autoCapitalize={'characters'}
                          onChangeText={(text) => this.setState({carNumber2: text})}
                          value={this.state.carNumber2}/>
                      <Text style={styles.titleContainer}> State: </Text>
                        <TextInput
                          style={styles.textInputContainer}
                          maxLength = {2}
                          autoCorrect={false}
                          autoCapitalize={'characters'}
                          onChangeText={(text) => this.setState({carState2: text})}
                          value={this.state.carState2}/>
                    </View>;
      } else {
        carFields = <View/>;
      }

    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <View style={styles.container}>
        <Text
          style={[styles.titleContainer, {marginBottom: 30}]}>
          Please register your vehicle, you can add up-to 2 </Text>
        <Text style={styles.titleContainer}> License plate number: </Text>
        <TextInput
          style={styles.textInputContainer}
          maxLength = {7}
          autoCorrect={false}
          autoCapitalize={'characters'}
          onChangeText={(text) => this.setState({carNumber1: text})}
          value={this.state.carNumber1}/>
        <Text style={styles.titleContainer}> State: </Text>
        <Text style={styles.warningMessage}>2-letter state code</Text>
        <TextInput
          style={styles.textInputContainer}
          onChangeText={(text) => this.setState({carState1: text})}
          maxLength = {2}
          autoCorrect={false}
          autoCapitalize={'characters'}
          value={this.state.carState1}/>
        {carFields}
        <Text style={styles.errorColor}>{this.state.errorMessage}</Text>
        <Button text={vehicleText} onPress={this.onAddCarPress.bind(this)}/>
        <Button text="Submit" onPress={this.onSubmitPress.bind(this)}/>
        <Button text="I don't have a vehicle" onPress={this.onNoCarPress.bind(this)}/>
      </View>
      </KeyboardAwareScrollView>
    );
  }
  onAddCarPress() {
    if(this.state.carEntry) {
      this.setState({carEntry: false});
    }
    else {
      this.setState({carEntry: true});
    }
  }

  onSubmitPress() {
    this.setState({errorMessage: "Loading..."});
    if(this.state.carEntry) {
      var obj = new VerifyThings();
      var ver = obj.verifyPlateNumber(this.state.carNumber1);
      if( ver!= "correct") {
        this.setState({
          errorMessage: ver
        });
        return;
      }
      var ver = obj.verifyState(this.state.carState1);
      if( ver!= "correct") {
        this.setState({
          errorMessage: ver
        });
        return;
      }
      var ver = obj.verifyPlateNumber(this.state.carNumber2);
      if( ver!= "correct") {
        this.setState({
          errorMessage: ver
        });
        return;
      }
      var ver = obj.verifyState(this.state.carState2);
      if( ver!= "correct") {
        this.setState({
          errorMessage: ver
        });
        return;
      }
      var Vehicle = Parse.Object.extend("Vehicle");
      var vehicle = new Vehicle();
      vehicle.set("licensePlate", this.state.carNumber1);
      vehicle.set("registeredState", this.state.carState1);
      vehicle.set("username", this.state.username);
      vehicle.save(null, {
        success: (gameScore) => {
        },
        error: (gameScore, error) => {
          this.setState({errorMessage: error.message});
        }
      });
      var Vehicle = Parse.Object.extend("Vehicle");
      var vehicle = new Vehicle();
      vehicle.set("licensePlate", this.state.carNumber2);
      vehicle.set("registeredState", this.state.carState2);
      vehicle.set("username", this.state.username);
      vehicle.save(null, {
        success: (gameScore) => {
          this.props.navigator.immediatelyResetRouteStack([{ name: 'main' }])
        },
        error: (gameScore, error) => {
          this.setState({errorMessage: error.message});
        }
      });
    }
    else {
            var obj = new VerifyThings();
            var ver = obj.verifyPlateNumber(this.state.carNumber1);
            if( ver!= "correct") {
              this.setState({
                errorMessage: ver
              });
              return;
            }
            var ver = obj.verifyState(this.state.carState1);
            if( ver!= "correct") {
              this.setState({
                errorMessage: ver
              });
              return;
            }
            var Vehicle = Parse.Object.extend("Vehicle");
            var vehicle = new Vehicle();
            vehicle.set("licensePlate", this.state.carNumber1);
            vehicle.set("registeredState", this.state.carState1);
            vehicle.set("username", this.state.username);
            vehicle.save(null, {
              success: (gameScore) => {
                this.props.navigator.immediatelyResetRouteStack([{ name: 'main' }])
              },
              error: (gameScore, error) => {
                this.setState({errorMessage: error.message});
              }
            });
    }
  }
  onNoCarPress() {
    this.props.navigator.immediatelyResetRouteStack([{ name: 'main' }])
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  addCarView: {
    backgroundColor: '#F5FCFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    fontSize: 20,
    fontFamily: 'Helvetica',
  },
  errorColor: {
    color: 'red',
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
  warningMessage: {
    color: '#2f4f4f',
    fontFamily: 'Helvetica',
    fontSize: 12,
  },
});

module.exports = CarReg;

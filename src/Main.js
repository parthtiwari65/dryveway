/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  PushNotificationIOS,
  Platform
} from 'react-native';
import Tabs from 'react-native-tabs';
var Profile = require('./Profile');
var Contact = require('./Contact');
var Messages = require('./Messages');

class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      page: Contact
    };
  }
  componentWillMount() {
    if (Platform.OS === 'ios') {
      // Add listener for push notifications
        PushNotificationIOS.requestPermissions();
        PushNotificationIOS.addEventListener('register', function(token){
         console.log('You are registered and the device token is: ',token)
        });
        PushNotificationIOS.addEventListener('notification', function(notification){
         console.log('You have received a new notification!', notification);
         Alert.alert('Push Notification Received')
        });
        //PushNotificationIOS.addEventListener('notification', this._onNotification);
    }
  }
  _onNotification(notification) {
    Alert.alert(
      'Push Notification Received',
      'Alert message: ' + notification.getMessage(),
      [{
        text: 'Dismiss',
        onPress: null,
      }]
    );
  }

  render() {
    const { page } = this.state;
    return (
      <View style={styles.container}>
        <this.state.page style={styles.pageContainer} navigator={this.props.navigator}/>
        <Tabs
          selected={page}
          style={styles.tabbar}
          selectedStyle={{color:'black'}}
          onSelect={el=>this.setState({page:el.props.name})}
        >
            <Text style={styles.tabbarText} name={Contact}>Contact</Text>
            <Text style={styles.tabbarText} name={Messages}>Messages</Text>
            <Text style={styles.tabbarText} name={Profile}>Profile</Text>
        </Tabs>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  pageContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  tabbar: {
    flex: 1,
    backgroundColor:'#F5FCFF',
    height: 64,
    borderTopColor: 'blue',
    borderTopWidth: 2
  },
  tabbarText: {
    fontSize: 20
  },
});

module.exports = Main;

import React, { Component } from 'react';
import { Navigator } from 'react-native'
import {createAppContainer} from 'react-navigation';

import { createStackNavigator } from 'react-navigation-stack';

import HomeScreenPage from './src/screens/HomeScreenPage';
import SignUpPage from './src/screens/SignUpPage';
import AccountSelectPage from './src/screens/AccountSelectPage';



const RootStack = createStackNavigator ( 
  { 
    
    HomeScreen: HomeScreenPage,
    SignUp: SignUpPage,
    AccountSelect: AccountSelectPage,
    
  }
)

const AppContainer = createAppContainer(RootStack)

class App extends Component {
  render() {
    const { navigation } = this.props;
      return (
          <AppContainer/> 
      )
  };
}

export default App; 
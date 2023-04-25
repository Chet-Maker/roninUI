import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RegistrationScreen from './screens/RegistrationScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import HomeScreen from './screens/HomeScreen';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Registration">
      <Stack.Screen name="Registration">
        {(props) => <RegistrationScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Home">
      {(props) => <HomeScreen {...props} />} 
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default AppNavigator;
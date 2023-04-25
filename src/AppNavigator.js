import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RegistrationScreen from './screens/RegistrationScreen';
import HomeScreen from './screens/HomeScreen';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Registration">
      <Stack.Screen name="Registration">
        {(props) => <RegistrationScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}

export default AppNavigator;
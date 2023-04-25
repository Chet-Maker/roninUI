import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChallengeScreen from '../screens/ChallengeScreen';
import MyProfileScreen from '../screens/MyProfileScreen';
import FeedScreen from '../screens/FeedScreen';
import SearchScreen from '../screens/SearchScreen';

const Tab = createBottomTabNavigator();

function NavigationBar() {
  return (
    <Tab.Navigator
      initialRouteName="Challenge"
      screenOptions={{
        activeTintColor: 'white',
        labelStyle: {
          fontSize: 14,
          backgroundColor: 'white',
        },
        style: {
          backgroundColor: 'black',
        },
      }}
    >
      <Tab.Screen name="Challenge" component={ChallengeScreen} />
      <Tab.Screen name="My Profile" component={MyProfileScreen} />
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
    </Tab.Navigator>
  );
}

export default NavigationBar;

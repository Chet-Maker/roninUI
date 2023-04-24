import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './src/reducers';
import RegistrationScreen from './src/screens/RegistrationScreen';

export default function App() {
  const store = configureStore({
    reducer: rootReducer,
  });
  return (
    <Provider store={store}>
      <RegistrationScreen />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

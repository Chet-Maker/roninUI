import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

export default function ChallengeScreen() {
  return (
    <View style={styles.container}>
        <Text style={styles.title}>Challenge Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
});
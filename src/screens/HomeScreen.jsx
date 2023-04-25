import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, Animated } from 'react-native';

export default function HomeScreen() {
  const [bgAnim] = useState(new Animated.Value(0));
  const [iconAnim] = useState(new Animated.Value(0));
  const [textAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(bgAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      }),
      Animated.timing(iconAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      }),
      Animated.timing(textAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      }),
    ]).start();
  }, [bgAnim, iconAnim, textAnim]);

  const backgroundColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0)'],
  });

  const iconOpacity = iconAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const iconTranslateY = iconAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -50],
  });

  const textOpacity = textAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const textTranslateY = textAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -50],
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <Animated.Image
        source={roninIcon}
        style={[
          styles.icon,
          {
            opacity: iconOpacity,
            transform: [{ translateY: iconTranslateY }],
          },
        ]}
      />
      <Animated.Text
        style={[
          styles.title,
          {
            opacity: textOpacity,
            transform: [{ translateY: textTranslateY }],
          },
        ]}
      >
        Welcome To Ronin
      </Animated.Text>
    </Animated.View>
  );
}

const roninIcon = require('../assets/ronin.png');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  icon: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
});

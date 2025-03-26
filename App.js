import GameScene from "./GameScene";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Animated } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import Cat from './components/Cat';

export default function App() {
  const [welcome, setWelcome] = useState(true);
  const catFade = useRef(new Animated.Value(0)).current;
  const catY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (welcome) {
      Animated.parallel([
        Animated.timing(catFade, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(catY, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [welcome]);

  if (welcome) {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <ImageBackground
          source={require('./assets/background/tilesets1_2.png')}
          style={styles.backgroundLayer}
          resizeMode="cover">

          {/* Welcome message and start button */}
          <View style={styles.welcome}>
            <Text style={styles.welcomeText}>
              Press the button to start the game!
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setWelcome(false);
              }}
            >
              <Text style={styles.buttonText}>START</Text>
            </TouchableOpacity>
          </View>

          {/* Cat container */}
          <View style={styles.catsContainer}>
            <Cat
              action="idle"
              size={32}
              style={{
                transform: [{ scale: 3 }],
                opacity: catFade,
                translateY: catY,
              }}
            />
          </View>

        </ImageBackground>
      </View>
    );
  }
  return null;

  return (
    <View style={styles.container}>
      <GameScene />
      <StatusBar style="light" />
    </View>
  );

  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#000",
  },
});

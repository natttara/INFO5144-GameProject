import React, { useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Animated,
} from "react-native";
import Cat from "./Cat";
import { Audio } from "expo-av";

const StartScreen = ({ onStart }) => {
  const catFade = useRef(new Animated.Value(0)).current;
  const catY = useRef(new Animated.Value(20)).current;

  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sounds/catSound.mp3")
      );
      await sound.playAsync();
    } catch (error) {
      console.log("Error playing sound:", error);
    }
  };

  const handleStartPress = async () => {
    await playSound();
    setTimeout(() => {
      onStart();
    }, 1000);
  };

  useEffect(() => {
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
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/background/tilesets1_2.png")}
        style={styles.backgroundLayer}
        resizeMode="cover">
        {/* Welcome message and start button */}
        <View style={styles.welcome}>
          <Text style={styles.welcomeText}>
            Press the button to start the game!
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleStartPress}>
            <Text style={styles.buttonText}>START</Text>
          </TouchableOpacity>
        </View>

        {/* Cat container */}
        <Animated.View
          style={[
            styles.catsContainer,
            {
              transform: [{ translateY: catY }, { scale: 3 }],
              opacity: catFade,
            },
          ]}>
          <Cat action="idle" size={32} isRunning={false} />
        </Animated.View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#000",
  },
  backgroundLayer: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  welcome: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    top: -50,
  },
  welcomeText: {
    fontFamily: "BakBak One",
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  button: {
    backgroundColor: "#FF4444",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    borderWidth: 2,
    borderColor: "#000",
  },
  buttonText: {
    fontFamily: "BakBak One",
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  catsContainer: {
    position: "absolute",
    bottom: 170,
    width: "100%",
    alignItems: "center",
    zIndex: 5,
  },
});

export default StartScreen;

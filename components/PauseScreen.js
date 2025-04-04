import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Animated,
} from "react-native";
import Cat from "./Cat";

const PauseScreen = ({ onResume, onExitToStart }) => {
  const catFade = useRef(new Animated.Value(0)).current;
  const catY = useRef(new Animated.Value(20)).current;

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
    <ImageBackground
      source={require("../assets/background/tilesets1_2.png")}
      style={styles.background}
      resizeMode="cover">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>Game Paused</Text>
          <TouchableOpacity style={styles.button} onPress={onResume}>
            <Text style={styles.buttonText}>Resume</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onExitToStart}>
            <Text style={styles.buttonText}>Restart</Text>
          </TouchableOpacity>
        </View>
      </View>

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
  );
};

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    minWidth: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#FF4444",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 5,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  catsContainer: {
    position: "absolute",
    bottom: 230,
    width: "100%",
    alignItems: "center",
    zIndex: 5,
  },
});

export default PauseScreen;

import React from "react";
import { View, StyleSheet } from "react-native";
import { GameEngine } from "react-native-game-engine";

const GameScene = () => {
  return (
    <View style={styles.container}>
      <GameEngine style={styles.gameContainer} systems={[]} entities={{}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#87CEEB", // Light blue sky color
  },
  gameContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default GameScene;

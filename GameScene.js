import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { GameEngine } from "react-native-game-engine";
import MovementSystem from "./systems/MovementSystem";
import entities from "./entities";
import PauseButton from "./components/PauseButton";

const GameScene = () => {
  const [isRunning, setIsRunning] = useState(true);

  const togglePause = () => {
    setIsRunning(!isRunning);
  };

  return (
    <View style={styles.container}>
      <GameEngine
        style={styles.gameContainer}
        systems={[MovementSystem]}
        entities={entities()}
        running={isRunning}
      />
      <PauseButton onPress={togglePause} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

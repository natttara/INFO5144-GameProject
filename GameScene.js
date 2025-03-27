import React, { useState, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { GameEngine } from "react-native-game-engine";
import MovementSystem from "./systems/MovementSystem";
import entities from "./entities";
import PauseButton from "./components/PauseButton";
import JumpButton from "./components/JumpButton";
import Background from "./components/Background";
import Cat from "./components/Cat";

const GameScene = () => {
  const [isRunning, setIsRunning] = useState(true);
  const [offsetX, setOffsetX] = useState(0);
  const [backgroundWidth, setBackgroundWidth] = useState(800);
  const gameEngineRef = useRef(null);

  const togglePause = () => {
    setIsRunning(!isRunning);
  };

  const handleJump = () => {};

  const onEvent = (e) => {
    if (e.type === "floor-offset") {
      setOffsetX(e.offsetX);
      setBackgroundWidth(e.backgroundWidth);
    }
  };

  return (
    <View style={styles.container}>
      <Background offsetX={offsetX} backgroundWidth={backgroundWidth} />
      <GameEngine
        ref={gameEngineRef}
        style={styles.gameContainer}
        systems={[MovementSystem]}
        entities={entities()}
        running={isRunning}
        onEvent={onEvent}
      />
      <Cat action="run" size={100} style={styles.cat} isRunning={isRunning} />
      <PauseButton onPress={togglePause} />
      <JumpButton onPress={handleJump} />
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
  cat: {
    position: "absolute",
    bottom: 175,
    left: 60,
    zIndex: 2,
  },
});

export default GameScene;

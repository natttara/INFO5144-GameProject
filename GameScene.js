import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { GameEngine } from "react-native-game-engine";
import MovementSystem from "./systems/MovementSystem";
import entities from "./entities";
import PauseButton from "./components/PauseButton";
import JumpButton from "./components/JumpButton";
import Background from "./components/Background";
import Cat from "./components/Cat";
import { Audio } from "expo-av";

const GameScene = () => {
  const [isRunning, setIsRunning] = useState(true);
  const [offsetX, setOffsetX] = useState(0);
  const [backgroundWidth, setBackgroundWidth] = useState(800);
  const [catAction, setCatAction] = useState("run"); // Start with "run"
  const gameEngineRef = useRef(null);
  const jumpY = useRef(new Animated.Value(0)).current;
  const jumpSoundRef = useRef(null);

  // Load jump sound once
  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require("./assets/sounds/Jump.mp3")
      );
      jumpSoundRef.current = sound;
    };

    loadSound();

    return () => {
      if (jumpSoundRef.current) {
        jumpSoundRef.current.unloadAsync();
      }
    };
  }, []);

  const togglePause = () => {
    setIsRunning(!isRunning);
  };

  const handleJump = () => {
    if (catAction !== "jump") {
      setCatAction("jump");

      // Play jump sound
      if (jumpSoundRef.current) {
        jumpSoundRef.current.replayAsync();
      }

      Animated.sequence([
        Animated.timing(jumpY, {
          toValue: -80, // jump height
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(jumpY, {
          toValue: 0, 
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCatAction("run"); // return to running after jump
      });
    }
  };

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
      {/* <Cat action="run" size={100} style={styles.cat} isRunning={isRunning} /> */}
      <Animated.View style={[styles.cat, { transform: [{ translateY: jumpY }] }]}>
        <Cat action={catAction} size={100} isRunning={isRunning} />
      </Animated.View>
      
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

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
import CoinObstacleSystem from "./systems/CoinObstacleSystem";
import PauseScreen from "./components/PauseScreen";

const GameScene = () => {
  const [isRunning, setIsRunning] = useState(true);
  const [offsetX, setOffsetX] = useState(0);
  const [backgroundWidth, setBackgroundWidth] = useState(800);
  const [catAction, setCatAction] = useState("run"); // Start with "run"
  const gameEngineRef = useRef(null);
  const jumpY = useRef(new Animated.Value(0)).current;
  const jumpSoundRef = useRef(null);
  const backgroundSoundRef = useRef(null); 
  const [showPauseScreen, setShowPauseScreen] = useState(false);

  // Load jump sound once
  useEffect(() => {
    const loadJumpSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require("./assets/sounds/Jump.mp3"),
        { isLooping: false, volume: 0.4 }
      );
      jumpSoundRef.current = sound;
    };

    loadJumpSound();

    return () => {
      if (jumpSoundRef.current) {
        jumpSoundRef.current.unloadAsync();
      }
    };
  }, []);

  // Load and play background music
  useEffect(() => {
  let isMounted = true;

  const loadAndPlayMusic = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("./assets/sounds/bgSound-2.mp3"),
        { isLooping: true, volume: 1 }
      );
      if (isMounted) {
        backgroundSoundRef.current = sound;
        await sound.playAsync();
        console.log("Background music playing...");
      }
    } catch (error) {
      console.warn("Failed to load background music:", error);
    }
  };

  loadAndPlayMusic();

  return () => {
    isMounted = false;
    if (backgroundSoundRef.current) {
      backgroundSoundRef.current.unloadAsync();
    }
  };
}, []);

  // const togglePause = () => {
  //   setIsRunning(!isRunning);
  // };

  //for Pause screen
  const togglePause = () => {
  setIsRunning(prev => {
    const newRunning = !prev;
    setShowPauseScreen(!newRunning);
    return newRunning;
  });
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
          toValue: -180, // jump height
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(jumpY, {
          toValue: 0, 
          duration: 350,
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
        systems={[MovementSystem, CoinObstacleSystem]}
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

      {/* pause screen */}
      {showPauseScreen && (
        <PauseScreen
          onResume={togglePause}
          onExit={() => {
            setShowPauseScreen(false);
          }}
        />
      )}
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

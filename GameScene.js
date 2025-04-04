import React, { useState, useRef, useEffect, useCallback } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";
import MovementSystem from "./systems/MovementSystem";
import CollisionSystem from "./systems/CollisionSystem";
import entities from "./entities";
import PauseButton from "./components/PauseButton";
import JumpButton from "./components/JumpButton";
import Background from "./components/Background";
import { Audio } from "expo-av";
import CoinObstacleSystem from "./systems/CoinObstacleSystem";
import PauseScreen from "./components/PauseScreen";
import RestartButton from "./components/RestartButton";

const GameScene = () => {
  const [isRunning, setIsRunning] = useState(true);
  const [offsetX, setOffsetX] = useState(0);
  const [backgroundWidth, setBackgroundWidth] = useState(800);
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);
  const gameEngineRef = useRef(null);
  const jumpSoundRef = useRef(null);
  const backgroundSoundRef = useRef(null);
  const [showPauseScreen, setShowPauseScreen] = useState(false);
  const gameEntities = useRef(entities()).current;

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

  const togglePause = () => {
    const newRunning = !isRunning;
    setIsRunning(newRunning);
    setShowPauseScreen(!newRunning);
  };

  const handleJump = () => {
    if (isRunning && gameEntities.cat && gameEntities.cat.body) {
      // Play jump sound
      if (jumpSoundRef.current) {
        jumpSoundRef.current.replayAsync();
      }

      // Apply upward force to the cat's physics body
      Matter.Body.setVelocity(gameEntities.cat.body, { x: 0, y: -15 });

      // Set cat action to jump
      if (gameEntities.cat.renderer) {
        gameEntities.cat.action = "jump";

        // Reset to run after jump animation
        setTimeout(() => {
          if (isRunning && gameEntities.cat) {
            gameEntities.cat.action = "run";
          }
        }, 700);
      }
    }
  };

  const onEvent = useCallback((e) => {
    if (e.type === "floor-offset") {
      setOffsetX(e.offsetX);
      setBackgroundWidth(e.backgroundWidth);
    } else if (e.type === "hit-obstacle") {
      console.log("Hit obstacle event received");
      setLives((prevLives) => {
        const newLives = prevLives - 1;
        if (newLives <= 0) {
          setIsGameOver(true);
          setIsRunning(false);
        }
        return newLives;
      });
    }
  }, []);

  const handleRestart = () => {
    setLives(3);
    setIsGameOver(false);
    setIsRunning(false);

    // Reset entities
    const resetEntities = entities();
    if (gameEngineRef.current) {
      gameEngineRef.current.swap(resetEntities);
    }

    setTimeout(() => {
      setIsRunning(true);
    }, 100);
  };

  const LivesDisplay = () => (
    <View style={styles.livesContainer}>
      <Text style={styles.livesText}>Lives: {lives}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Background offsetX={offsetX} backgroundWidth={backgroundWidth} />
      <LivesDisplay />
      <GameEngine
        ref={gameEngineRef}
        style={styles.gameContainer}
        systems={[MovementSystem, CoinObstacleSystem, CollisionSystem]}
        entities={gameEntities}
        running={isRunning}
        onEvent={onEvent}
      />

      <View style={styles.controlsRow}>
        <JumpButton onPress={handleJump} />
        <PauseButton onPress={togglePause} />
        <RestartButton onPress={handleRestart} />
      </View>

      {isGameOver && (
        <View style={styles.gameOverContainer}>
          <View style={styles.gameOverBox}>
            <Text style={styles.gameOverText}>Game Over!</Text>
            <TouchableOpacity
              style={styles.restartButton}
              onPress={handleRestart}>
              <Text style={styles.restartButtonText}>Play Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {showPauseScreen && !isGameOver && (
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
  controlsRow: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    zIndex: 1,
  },
  livesContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 5,
  },
  livesText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  gameOverContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  gameOverBox: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  gameOverText: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  restartButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
  },
  restartButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default GameScene;

import React, { useState, useRef, useEffect, useCallback } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
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
import Images from "./Images";
import GameOverScreen from "./components/GameOverScreen";

const GameScene = ({ onExitToStart }) => {
  const [isRunning, setIsRunning] = useState(true);
  const [offsetX, setOffsetX] = useState(0);
  const [backgroundWidth, setBackgroundWidth] = useState(800);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState(null); // 'win' | 'lose'
  const [isRewinding, setIsRewinding] = useState(false);
  const [canJump, setCanJump] = useState(true);
  const gameEngineRef = useRef(null);
  const jumpSoundRef = useRef(null);
  const backgroundSoundRef = useRef(null);
  const collisionSoundRef = useRef(null);
  const coinSoundRef = useRef(null);
  const [showPauseScreen, setShowPauseScreen] = useState(false);
  const gameEntities = useRef(entities()).current;

  // Load jump, hit, coin sound 
  useEffect(() => {
    const loadSounds = async () => {
      try {
        const { sound: jump } = await Audio.Sound.createAsync(
          require("./assets/sounds/Jump.mp3"),
          { isLooping: false, volume: 0.4 }
        );
        jumpSoundRef.current = jump;

        const { sound: hit } = await Audio.Sound.createAsync(
          require("./assets/sounds/Collision.mp3"),
          { isLooping: false, volume: 1 }
        );
        collisionSoundRef.current = hit;

        const { sound: coin } = await Audio.Sound.createAsync(
        require("./assets/sounds/Coin.mp3"), 
        { isLooping: false, volume: 1 }
      );
      coinSoundRef.current = coin;
      } catch (error) {
        console.warn("Error loading sounds:", error);
      }
    };

    loadSounds();

    return () => {
      jumpSoundRef.current?.unloadAsync();
      collisionSoundRef.current?.unloadAsync();
      coinSoundRef.current?.unloadAsync();
    };
  }, []);

  // Load and play background music
  useEffect(() => {
    let isMounted = true;

    const loadAndPlayMusic = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require("./assets/sounds/game-music-loop.mp3"),
          { isLooping: true, volume: 0.5 }
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
    if (isRunning && gameEntities.cat && gameEntities.cat.body && canJump) {
      // Disable jumping immediately
      setCanJump(false);

      // Play jump sound
      if (jumpSoundRef.current) {
        jumpSoundRef.current.replayAsync();
      }

      Matter.Body.setVelocity(gameEntities.cat.body, { x: 0, y: -10 });

      // Set cat action to jump
      if (gameEntities.cat.renderer) {
        gameEntities.cat.action = "jump";

        // Reset to run after jump animation
        setTimeout(() => {
          if (isRunning && gameEntities.cat) {
            gameEntities.cat.action = "run";
            setTimeout(() => {
              setCanJump(true);
            }, 200);
          }
        }, 700);
      }
    }
  };

  const onEvent = useCallback((e) => {
  if (e.type === "floor-offset") {
    setOffsetX(e.offsetX);
    setBackgroundWidth(e.backgroundWidth);
  } else if (e.type === "coin-collected") {
    // Play coin sound
    if (coinSoundRef.current) {
      coinSoundRef.current.replayAsync();
    }
    setScore((prev) => {
      const newScore = prev + 1;
      if (newScore >= 5) {
        setGameStatus("win");
        setIsRunning(false);
      }
      return newScore;
      });
    } else if (e.type === "hit-obstacle") {
      console.log("Hit obstacle event received");
      // Play collision sound
      if (collisionSoundRef.current) {
        collisionSoundRef.current.replayAsync();
      }

      setLives((prevLives) => {
        const newLives = prevLives - 1;
        if (newLives <= 0) {
          setGameStatus("lose");
          setIsRunning(false);
        }
        return newLives;
      });

       setTimeout(() => {
        if (gameEntities.cat) {
          gameEntities.cat.action = "run";
        }
       }, 500);
      
    } else if (e.type === "background-rewind") {
      setIsRewinding(e.isRewinding);
    } 
  }, []);

  const handleRestart = () => {
    setLives(3);
    setScore(0);
    setGameStatus(null);
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

  return (
    <View style={styles.container}>
      <Background
        offsetX={offsetX}
        backgroundWidth={backgroundWidth}
        isRewinding={isRewinding}
      />
      {/* heart and coin */}
      <View style={styles.heartAndCoin}>
        <View style={styles.heartContainer}>
          {[...Array(lives > 0 ? lives : 0)].map((_, i) => (
            <Image
              key={i}
              source={Images.heart}
              style={styles.heart}
            />
          ))}
        </View>
        <View style={styles.coinContainer}>
          <Image source={Images.coin} style={styles.icon} />
          <Text style={styles.counter}>{score}</Text>
        </View>
      </View>
      <GameEngine
        ref={gameEngineRef}
        style={styles.gameContainer}
        systems={[MovementSystem, CoinObstacleSystem, CollisionSystem]}
        entities={gameEntities}
        running={isRunning}
        onEvent={onEvent}
      />

      {!gameStatus && !showPauseScreen &&(
        <View style={styles.controlsRow}>
          <JumpButton onPress={handleJump} />
          <PauseButton onPress={togglePause} />
          <RestartButton onPress={handleRestart} />
        </View>
      )}

      {gameStatus && (
        <GameOverScreen
          status={gameStatus}
          score={score}
          onRestart={onExitToStart}
        />
      )}

      {showPauseScreen && !gameStatus && (
        <PauseScreen
          onResume={togglePause}
          onExitToStart={onExitToStart}
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
  heartAndCoin: {
    position: "absolute",
    top: 30,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  coinContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  counter: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  heartContainer: {
    flexDirection: "row",
  },
  heart: {
    width: 30,
    height: 30,
    marginLeft: 5,
  },
  restartButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
  },
});

export default GameScene;

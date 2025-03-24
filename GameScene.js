import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import { BackgroundLayer } from './components/BackgroundLayer';

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');

const GameScene = () => {
  const [gameEngine, setGameEngine] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const entities = {
    // Background layers with different scroll speeds for parallax effect
    sky: {
      position: [0, 0],
      renderer: <BackgroundLayer image={require('./assets/background/sky.png')} speed={0.2} />,
    },
    mountainsBackground: {
      position: [0, 0],
      renderer: <BackgroundLayer image={require('./assets/background/mountains background.png')} speed={0.4} />,
    },
    mountainsForeground: {
      position: [0, 0],
      renderer: <BackgroundLayer image={require('./assets/background/mountains foreground.png')} speed={0.6} />,
    },
    trees: {
      position: [0, 0],
      renderer: <BackgroundLayer image={require('./assets/background/trees.png')} speed={0.8} />,
    },
    grass: {
      position: [0, 0],
      renderer: <BackgroundLayer image={require('./assets/background/grass.png')} speed={1} />,
    },
    clouds: {
      position: [0, 0],
      renderer: <BackgroundLayer image={require('./assets/background/clouds foreground.png')} speed={0.3} />,
    },
  };

  const systems = [
    // Add game systems here
  ];

  useEffect(() => {
    setIsRunning(true);
  }, []);

  return (
    <GameEngine
      ref={(ref) => setGameEngine(ref)}
      systems={systems}
      entities={entities}
      running={isRunning}
      style={styles.gameContainer}
    />
  );
};

const styles = StyleSheet.create({
  gameContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#87CEEB', // Sky blue color as fallback
  },
});

export default GameScene; 
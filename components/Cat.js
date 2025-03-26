import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet } from 'react-native';
import SpriteSheet from 'rn-sprite-sheet';

const Cat = ({ action = 'idle', style, size = 180 }) => { //"If the Cat component is used without passing the action prop, default it to 'idle'."//
  const catRef = useRef(null);

  const animations = {
    idle: [0, 1, 2, 3, 4, 5, 6],
    walk: [0, 1, 2, 3, 4, 5, 6],
    run: [0, 1, 2, 3, 4, 5, 6],
    jump: [0, 1, 2, 3, 4, 5, 6],
    attack: [0, 1, 2],
  };

  const spriteSources = {
    idle: require('../assets/sprites/idle.png'),
    walk: require('../assets/sprites/walk.png'),
    run: require('../assets/sprites/run.png'),
    jump: require('../assets/sprites/jump.png'),
    attack: require('../assets/sprites/attack.png'),
  };

  const frameCount = {
    idle: 7,
    walk: 7,
    run: 7,
    jump: 7,
    attack: 3,
  };

  useEffect(() => {
    if (catRef.current) {
      catRef.current.play({
        type: action,
        fps: 8,
        loop: true,
      });
    }
  }, [action]);

  return (
    <Animated.View style={[{ width: size, height: size }, style]}>
      <SpriteSheet
        ref={catRef}
        source={spriteSources[action]}
        columns={frameCount[action]}
        rows={1}
        width={size}
        height={size}
        animations={{
          [action]: animations[action],
        }}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  catContainer: {
    position: 'absolute',
    // bottom: 60,
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 1,
  },
});

export default Cat;

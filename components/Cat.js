import React, { useRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import SpriteSheet from "rn-sprite-sheet";

const Cat = ({
  body,
  size = 100,
  action = "run",
  isRunning = true,
  style,
  opacity = 1,
}) => {
  const catRef = useRef(null);
  const prevActionRef = useRef(action);

  const animations = {
    idle: [0, 1, 2, 3, 4, 5, 6],
    walk: [0, 1, 2, 3, 4, 5, 6],
    run: [0, 1, 2, 3, 4, 5, 6],
    jump: [0, 1, 2, 3, 4, 5, 6],
    attack: [0, 1, 2],
  };

  const spriteSources = {
    idle: require("../assets/sprites/idle.png"),
    walk: require("../assets/sprites/walk.png"),
    run: require("../assets/sprites/run.png"),
    jump: require("../assets/sprites/jump.png"),
    attack: require("../assets/sprites/attack.png"),
  };

  const frameCount = {
    idle: 7,
    walk: 7,
    run: 7,
    jump: 7,
    attack: 3,
  };

  useEffect(() => {
    if (action !== prevActionRef.current) {
      prevActionRef.current = action;
      if (catRef.current) {
        catRef.current.play({
          type: action,
          fps: 8,
          loop: true,
        });
      }
    }
  }, [action]);

  // Also trigger animation changes when isRunning changes
  useEffect(() => {
    if (catRef.current) {
      if (!isRunning) {
        catRef.current.play({
          type: "idle",
          fps: 8,
          loop: true,
        });
      } else if (action === "run") {
        catRef.current.play({
          type: "run",
          fps: 8,
          loop: true,
        });
      }
    }
  }, [isRunning]);

  // Calculate position based on physics body if available, otherwise use style
  const position = body
    ? {
        left: body.position.x - size / 2,
        top: body.position.y - size / 2,
      }
    : {};

  const onPlayComplete = () => {
    if (action === "jump") {
      catRef.current?.play({
        type: "run",
        fps: 8,
        loop: true,
      });
    }
  };

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, opacity },
        position,
        style,
      ]}>
      <SpriteSheet
        ref={catRef}
        source={spriteSources[isRunning ? action : "idle"]}
        columns={frameCount[isRunning ? action : "idle"]}
        rows={1}
        width={size}
        height={size}
        animations={{
          [isRunning ? action : "idle"]:
            animations[isRunning ? action : "idle"],
        }}
        onLoad={() => {
          if (isRunning && action === "run") {
            catRef.current?.play({
              type: "run",
              fps: 8,
              loop: true,
            });
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 2,
  },
});

export default Cat;

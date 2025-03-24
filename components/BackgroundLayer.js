import React, { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Dimensions } from "react-native";

const { width: WINDOW_WIDTH } = Dimensions.get("window");

const BackgroundLayer = ({ image, speed = 1 }) => {
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create infinite scrolling animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scrollX, {
          toValue: -WINDOW_WIDTH,
          duration: 10000 / speed, // Adjust duration based on speed
          useNativeDriver: true,
        }),
        Animated.timing(scrollX, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateX: scrollX }] }]}>
      <Image source={image} style={styles.image} />
      <Image
        source={image}
        style={[styles.image, { position: "absolute", left: WINDOW_WIDTH }]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: WINDOW_WIDTH * 2,
    height: "100%",
  },
  image: {
    width: WINDOW_WIDTH,
    height: "100%",
    resizeMode: "cover",
  },
});

export { BackgroundLayer };

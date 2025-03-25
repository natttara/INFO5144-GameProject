import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import Images from "../Images";

const Background = ({ offsetX, backgroundWidth }) => {
  const [backgroundOffset, setBackgroundOffset] = useState(0);
  //   const parallaxSpeed = 0.15; // Slower speed for a more subtle parallax effect
  const parallaxSpeed = 0.3;
  const imageWidth = 1363; // Width of the forest image

  useEffect(() => {
    setBackgroundOffset((prevOffset) => {
      const newOffset = prevOffset + parallaxSpeed;
      // Reset when we reach the image width
      if (newOffset >= imageWidth) {
        return 0;
      }
      return newOffset;
    });
  }, [offsetX]);

  return (
    <View style={styles.container}>
      <View style={styles.topBar} />
      <View style={styles.imageContainer}>
        <Image
          source={Images.forest}
          style={[
            styles.backgroundImage,
            {
              transform: [{ translateX: -backgroundOffset }],
            },
          ]}
        />
        <Image
          source={Images.forest}
          style={[
            styles.backgroundImage,
            {
              transform: [{ translateX: -backgroundOffset + imageWidth }],
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: "#000000",
    zIndex: 1,
  },
  imageContainer: {
    flex: 1,
    overflow: "hidden",
    marginTop: 40, // Add margin to account for the top bar
  },
  backgroundImage: {
    position: "absolute",
    height: "100%",
    resizeMode: "contain",
  },
});

export default Background;

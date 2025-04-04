import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import Images from "../Images";

const Background = ({ offsetX, backgroundWidth }) => {
  const [backgroundOffset, setBackgroundOffset] = useState(0);
  const [treeOffset, setTreeOffset] = useState(0);
  const [bushOffset, setBushOffset] = useState(0);
  const [currentTree1, setCurrentTree1] = useState(Images.tree1);
  const [currentTree2, setCurrentTree2] = useState(Images.tree2);
  const [currentBush1, setCurrentBush1] = useState(Images.bush1);
  const [currentBush2, setCurrentBush2] = useState(Images.bush2);
  const parallaxSpeed = 0.3;
  const imageWidth = 1363;
  const screenWidth = 800;

  useEffect(() => {
    // Update background offset
    setBackgroundOffset((prevOffset) => {
      const newOffset = prevOffset + parallaxSpeed;
      if (newOffset >= imageWidth) {
        return 0;
      }
      return newOffset;
    });

    // Update tree offset
    setTreeOffset((prevOffset) => {
      const newOffset = prevOffset + parallaxSpeed * 1.3;
      if (newOffset >= screenWidth) {
        // Switch tree images when resetting
        setCurrentTree1((prev) =>
          prev === Images.tree1 ? Images.tree2 : Images.tree1
        );
        setCurrentTree2((prev) =>
          prev === Images.tree1 ? Images.tree2 : Images.tree1
        );
        return 0;
      }
      return newOffset;
    });

    // Update bush offset
    setBushOffset((prevOffset) => {
      const newOffset = prevOffset + parallaxSpeed * 2;
      if (newOffset >= screenWidth) {
        // Switch bush images when resetting
        setCurrentBush1((prev) =>
          prev === Images.bush1 ? Images.bush2 : Images.bush1
        );
        setCurrentBush2((prev) =>
          prev === Images.bush1 ? Images.bush2 : Images.bush1
        );
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
        {/* Trees */}
        <Image
          source={currentTree1}
          style={[
            styles.tree,
            {
              transform: [{ translateX: -treeOffset }],
            },
          ]}
        />
        <Image
          source={currentTree2}
          style={[
            styles.tree,
            {
              transform: [{ translateX: -treeOffset + screenWidth }],
            },
          ]}
        />
        {/* Bushes */}
        <Image
          source={currentBush1}
          style={[
            styles.bush,
            {
              transform: [{ translateX: -bushOffset }],
            },
          ]}
        />
        <Image
          source={currentBush2}
          style={[
            styles.bush,
            {
              transform: [{ translateX: -bushOffset + screenWidth }],
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
  },
  backgroundImage: {
    position: "absolute",
    height: "100%",
    resizeMode: "contain",
  },
  tree: {
    position: "absolute",
    bottom: 190,
    width: 350,
    height: 525,
    resizeMode: "contain",
  },
  bush: {
    position: "absolute",
    bottom: 185,
    width: 180,
    height: 120,
    resizeMode: "contain",
  },
});

export default Background;

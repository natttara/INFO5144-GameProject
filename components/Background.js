import React, { useEffect, useState, useRef } from "react";
import { View, Image, StyleSheet } from "react-native";
import Images from "../Images";

const Background = () => {
  const [backgroundOffset, setBackgroundOffset] = useState(0);
  const [treeOffset, setTreeOffset] = useState(0);
  const [bushOffset, setBushOffset] = useState(0);
  const [currentTree1, setCurrentTree1] = useState(Images.tree1);
  const [currentTree2, setCurrentTree2] = useState(Images.tree2);
  const [currentBush1, setCurrentBush1] = useState(Images.bush1);
  const [currentBush2, setCurrentBush2] = useState(Images.bush2);
  const lastUpdateRef = useRef(Date.now());
  const animationFrameRef = useRef(null);
  const parallaxSpeed = 1.5;
  const imageWidth = 1363;
  const screenWidth = 800;

  // Animation update
  useEffect(() => {
    let isAnimating = true;

    const animate = () => {
      if (!isAnimating) {
        return;
      }

      const now = Date.now();
      const deltaTime = now - lastUpdateRef.current;
      lastUpdateRef.current = now;

      // Update background offset
      setBackgroundOffset((prevOffset) => {
        const newOffset = prevOffset + (parallaxSpeed * deltaTime) / 16;
        return newOffset >= imageWidth ? 0 : newOffset;
      });

      // Update tree offset
      setTreeOffset((prevOffset) => {
        const newOffset = prevOffset + (parallaxSpeed * 2.5 * deltaTime) / 16;
        if (newOffset >= screenWidth) {
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
        const newOffset = prevOffset + (parallaxSpeed * 3.5 * deltaTime) / 16;
        if (newOffset >= screenWidth) {
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

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    if (isAnimating) {
      animate();
    }
  }, []);

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

import React, { useRef, useEffect} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import Images from "../Images";
import { Animated } from 'react-native';

const GameOverScreen = ({ status, score, onRestart }) => {
    const isWin = status === "win";
    const scaleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            friction: 4,
        }).start();
    }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/background/tilesets1_2.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          {isWin ? (
            <>
                {/* win */}
                <Text style={styles.winText}>Congrats!</Text>
                <Text style={styles.scoreText}>You collected {score} coins</Text>

                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <TouchableOpacity onPress={onRestart} style={styles.pawWrapper}>
                        <Image source={Images.paw} style={styles.pawButton} />
                        <Text style={styles.pawButtonText}>Play Again</Text>
                    </TouchableOpacity>
                </Animated.View>

            </>
          ) : (
            <>
                {/* lose */}
                <Text style={styles.loseText}>GAME OVER</Text>
                <Text style={styles.scoreText}>Your score : {score}</Text>

                <TouchableOpacity onPress={onRestart} style={styles.pawWrapper}>
                    <Image
                    source={Images.paw} 
                    style={styles.pawButton}
                    />
                    <Text style={styles.pawButtonText}>Retry</Text>
                </TouchableOpacity>
            </>
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    overlay: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 80,
    },
    winText: {
        fontSize: 36,
        fontWeight: "bold",
        color: "#fff",
        backgroundColor: "#FF4444",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 20,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: "#000",
        fontFamily: "BakBak One",
    },
    loseText: {
        fontSize: 36,
        fontWeight: "bold",
        color: "#fff",
        backgroundColor: "#FF4444",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 20,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: "#000",
        fontFamily: "BakBak One",
    },
    scoreText: {
        fontFamily: "BakBak One",
        fontSize: 22,
        fontWeight: "bold",
        color: "white",
        textShadowColor: "rgba(0, 0, 0, 0.75)",
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    playAgainBtn: {
        backgroundColor: "#FF4444",
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginTop: 10,
    },
    playAgainText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
    },
    pawWrapper: {
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        marginTop: 20,
    },
    pawButton: {
        width: 150,
        height: 150,
        marginTop: 20,
        resizeMode: "contain",
    },
    pawButtonText: {
        position: "absolute",
        top: 130,
        color: "#fff",
        alignSelf: "center",
        fontSize: 18,
        fontWeight: "bold",
    },
});


export default GameOverScreen;

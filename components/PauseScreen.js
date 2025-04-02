import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Animated } from "react-native";
import Cat from "./Cat";

const PauseScreen = ({ onResume, onExitToStart }) => {
    const catFade = useRef(new Animated.Value(0)).current;
    const catY = useRef(new Animated.Value(20)).current;

    useEffect(() => {
    Animated.parallel([
        Animated.timing(catFade, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        }),
        Animated.timing(catY, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
        }),
    ]).start();
    }, []);
    
    return (
        <ImageBackground
            source={require("../assets/background/tilesets1_2.png")} // same background as StartScreen
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                <View style={styles.box}>
                    <Text style={styles.title}>Game Paused</Text>
                    <TouchableOpacity style={styles.button} onPress={onResume}>
                        <Text style={styles.buttonText}>Resume</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={onExitToStart}>
                        <Text style={styles.buttonText}>Restart</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Cat container */}
            <View style={styles.catsContainer}>
            <Cat
                action="idle"
                size={32}
                style={{
                transform: [{ scale: 3 }],
                opacity: catFade,
                translateY: catY,
                }}
            />
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 10,
    },
    overlay: {
        backgroundColor: "rgba(0,0,0,0.5)",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
        paddingBottom: 100,
    },
    box: {
        backgroundColor: "#fff",
        padding: 30,
        borderRadius: 20,
        alignItems: "center",
        width: 250,
    },
    title: {
        fontFamily: "BakBak One",
        fontSize: 28,
        fontWeight: "bold",
        color: "#FF4444",
    },
    button: {
        backgroundColor: "#FF4444",
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#000",
        marginTop: 20,
        width: "100%",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
    },
    catsContainer: {
        position: "absolute",
        bottom: 170,
        width: "100%",
        alignItems: "center",
        zIndex: 5,
    },
});

export default PauseScreen;

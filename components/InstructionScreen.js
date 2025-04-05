import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { Audio } from 'expo-av';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const InstructionScreen = ({ onNext }) => {
    const playSound = async () => {
        try {
          const { sound } = await Audio.Sound.createAsync(
            require('../assets/sounds/game-start.mp3')
          );
          await sound.playAsync();
        } catch (error) {
          console.log('Error playing sound:', error);
        }
    };
    
    const handleStartPress = async () => {
      await playSound(); 
      setTimeout(() => {
        onNext();       
      }, 100);
    };

    return (
        <ImageBackground
        source={require("../assets/background/tilesets1_2.png")}
        style={styles.background}
        resizeMode="cover"
        >
        <View style={styles.overlay}>
            <View style={styles.box}>
              <Text style={styles.title}>How to play!</Text>
              <View style={styles.bulletRow}>
                <FontAwesome name="paw" size={20} color="#ffd026" style={styles.bulletIcon} />
                <Text style={styles.bulletText}>Press the Jump Paw to Jump</Text>
              </View>

              <View style={styles.bulletRow}>
                <FontAwesome name="paw" size={20} color="#ffd026" style={styles.bulletIcon} />
                <Text style={styles.bulletText}>Collect the coin</Text>
              </View>

              <View style={styles.bulletRow}>
                <FontAwesome name="paw" size={20} color="#ffd026" style={styles.bulletIcon} />
                <Text style={styles.bulletText}>You have only 3 lives!</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleStartPress}>
              <Text style={styles.buttonText}>OK!</Text>
            </TouchableOpacity>
        </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  box: {
    backgroundColor: "rgba(253, 132, 152, 0.75)",
    padding: 20,
    borderRadius: 20,
    borderColor: "black",
    borderWidth: 2,
    alignItems: "flex-start",
    width: 350,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 10,
    color: "#fff",
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    textDecorationLine: 'underline',
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  bulletIcon: {
    marginRight: 10,
  },
  bulletText: {
    color: "#fff",
    fontWeight: "600",
    textShadowRadius: 1,
    fontSize: 20,
    marginVertical: 5,
    textShadowColor: "rgba(0, 0, 0, 0.75)"
  },

  button: {
    backgroundColor: "#FF4444",
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#000",
  },
  buttonText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
});

export default InstructionScreen;

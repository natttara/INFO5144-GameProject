import GameScene from "./GameScene";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import StartScreen from "./components/StartScreen";

export default function App() {
  const [welcome, setWelcome] = useState(true);

  if (welcome) {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <StartScreen onStart={() => setWelcome(false)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GameScene />
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

import GameScene from "./GameScene";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import StartScreen from "./components/StartScreen";
import InstructionScreen from "./components/InstructionScreen";

export default function App() {
  // const [welcome, setWelcome] = useState(true);
  const [screen, setScreen] = useState("start");

  // if (welcome) {
  //   return (
  //     <View style={styles.container}>
  //       <StatusBar hidden />
  //       <StartScreen onStart={() => setWelcome(false)} />
  //     </View>
  //   );
  // }

  // return (
  //   <View style={styles.container}>
  //     <GameScene />
  //     <StatusBar style="light" />
  //   </View>
  // );

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {screen === "start" && (
        <StartScreen onStart={() => setScreen("instructions")} />
      )}

      {screen === "instructions" && (
        <InstructionScreen onNext={() => setScreen("game")} />
      )}

      {screen === "game" && (
        <GameScene onExitToStart={() => setScreen("start")} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import GameScene from "./GameScene";

export default function App() {
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
    // backgroundColor: "#000",
  },
});

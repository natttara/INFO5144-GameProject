import { Dimensions } from "react-native";
import Background from "../components/Background";
import Floor from "../components/Floor";
import Boundary from "../components/Boundary";
import Sprite from "../components/Sprite";

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get("window");

// Define game entities with their properties
export const entities = {
  boundary: {
    component: Boundary,
    props: {
      width: WINDOW_WIDTH,
      height: WINDOW_HEIGHT,
      color: "transparent",
      position: [0, 0],
    },
  },
  sky: {
    component: Background,
    props: {
      width: WINDOW_WIDTH,
      height: WINDOW_HEIGHT,
      source: require("../assets/background/sky.png"),
      speed: 0.2,
      position: [0, 0],
    },
  },
  floor: {
    component: Floor,
    props: {
      width: WINDOW_WIDTH,
      height: 20,
      color: "#2c3e50",
      position: [0, WINDOW_HEIGHT * 0.8], // Position at 80% of screen height
    },
  },
  cat: {
    component: Sprite,
    props: {
      idleSource: require("../assets/idle.png"),
      runSource: require("../assets/run.png"),
      jumpSource: require("../assets/jump.png"),
      frameWidth: 32, // Adjust based on your sprite sheet
      frameHeight: 32, // Adjust based on your sprite sheet
      frameCounts: {
        idle: 4, // Adjust based on your sprite sheet
        run: 6, // Adjust based on your sprite sheet
        jump: 4, // Adjust based on your sprite sheet
      },
      fps: 12,
      currentState: "idle",
      style: {
        position: "absolute",
        left: WINDOW_WIDTH / 2,
        top: WINDOW_HEIGHT / 2,
      },
    },
  },
};

// Export components for direct use if needed
export { Background, Floor, Boundary, Sprite };

// We'll add more entity exports here as we create them
// For example:
// export { Player } from '../components/Player';
// export { Enemy } from '../components/Enemy';
// export { Platform } from '../components/Platform';

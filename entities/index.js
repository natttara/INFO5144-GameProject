import Matter from "matter-js";
import Constants from "../Constants";
import Images from "../Images";
import Floor from "../components/Floor"; // Import the Floor component

export default (gameWorld) => {
  let engine = Matter.Engine.create({ enableSleeping: false });
  let world = engine.world;
  engine.gravity.y = 0.4;

  let screenWidth = Constants.SCREEN_WIDTH;
  let screenHeight = Constants.SCREEN_HEIGHT;

  const entities = {
    physics: { engine, world },

    floor: Floor(
      world,
      { x: screenWidth / 2, y: screenHeight - 20 }, // Position at bottom
      { height: 300, width: screenWidth },
      Images.grass // Use grass image
    ),
  };

  return entities;
};

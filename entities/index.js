import Matter from "matter-js";
import Constants from "../Constants";
import Images from "../Images";
import Floor from "../components/Floor";
import Cat from "../components/Cat";

export default () => {
  const engine = Matter.Engine.create({ enableSleeping: false });
  const world = engine.world;
  engine.gravity.y = 0.8;

  let screenWidth = Constants.SCREEN_WIDTH;
  let screenHeight = Constants.SCREEN_HEIGHT;

  // Calculate floor dimensions
  const floorHeight = 200;
  const floorY = screenHeight - floorHeight / 2;
  const floorWidth = screenWidth + 4;

  // Create cat body
  const catSize = 100;
  const catBody = Matter.Bodies.rectangle(
    60,
    screenHeight - floorHeight - catSize / 2,
    catSize * 0.8,
    catSize * 0.8,
    {
      label: "cat",
      friction: 0.1,
      restitution: 0.2,
      density: 1,
      inertia: Infinity,
      frictionAir: 0.001,
      isSensor: false,
      collisionFilter: {
        category: 0x0001, // Cat category
        mask: 0xffffffff, // Collide with everything
        group: 0,
      },
    }
  );

  // Create floor body
  const floorBody = Matter.Bodies.rectangle(
    screenWidth / 2,
    floorY,
    screenWidth * 2,
    floorHeight,
    {
      isStatic: true,
      label: "floor",
      friction: 1,
      collisionFilter: {
        category: 0x0004, // Floor category
        mask: 0x0001, // Only collide with cat
        group: 0,
      },
    }
  );

  Matter.World.add(world, [catBody, floorBody]);

  return {
    physics: { engine, world },

    cat: {
      body: catBody,
      size: catSize,
      renderer: Cat,
    },

    floor1: Floor(
      world,
      { x: screenWidth / 2, y: floorY },
      { height: floorHeight, width: floorWidth },
      Images.grass
    ),

    floor2: Floor(
      world,
      { x: screenWidth + screenWidth / 2, y: floorY },
      { height: floorHeight, width: floorWidth },
      Images.grass
    ),
  };
};

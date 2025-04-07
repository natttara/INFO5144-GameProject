import Matter from "matter-js";
import Constants from "../Constants";
import Images from "../Images";
import Floor from "../components/Floor";
import Cat from "../components/Cat";
import Coin from "../components/Coin";
import Obstacle from "../components/Obstacle";

export default () => {
  const engine = Matter.Engine.create({ enableSleeping: false });
  const world = engine.world;
  engine.gravity.y = 0.8;

  let screenWidth = Constants.SCREEN_WIDTH;
  let screenHeight = Constants.SCREEN_HEIGHT;

  // Floor setup
  const floorHeight = 200;
  const floorY = screenHeight - floorHeight / 2;
  const floorWidth = screenWidth + 4;

  // Cat setup
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
        category: 0x0001,
        mask: 0xffffffff,
        group: 0,
      },
    }
  );

  // Floor body
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
        category: 0x0004,
        mask: 0x0001,
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

// === SPAWN HELPERS === //

export const spawnCoin = (world, entities, x, y, id, scrollSpeed) => {
  const coin = Matter.Bodies.circle(x, y, 20, {
    isSensor: true,
    isStatic: true,
    label: "coin",
    collisionFilter: {
      category: 0x0008,
      mask: 0x0001,
      group: 0,
    },
  });

  Matter.World.add(world, coin);
  entities[id] = {
    body: coin,
    size: [40, 40],
    renderer: Coin,
    scrollSpeed: scrollSpeed,
  };
};

export const spawnObstacle = (world, entities, x, y, id, scrollSpeed) => {
  const obstacle = Matter.Bodies.rectangle(x, y, 50, 100, {
    isStatic: true,
    label: "obstacle",
    isSensor: false,
    collisionFilter: {
      category: 0x0002,
      mask: 0x0001,
      group: 0,
    },
    friction: 0,
    restitution: 0,
  });

  Matter.World.add(world, obstacle);
  entities[id] = {
    body: obstacle,
    size: [50, 100],
    renderer: Obstacle,
    scrollSpeed: scrollSpeed,
  };
};

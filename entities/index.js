import Matter from "matter-js";
import Constants from "../Constants";
import Images from "../Images";
import Floor from "../components/Floor";
import Cat from "../components/Cat";
import Coin from "../components/Coin";
import Obstacle from "../components/Obstacle";

export default (gameWorld) => {
  let engine = Matter.Engine.create({ enableSleeping: false });
  let world = engine.world;
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
    screenHeight - 200,
    catSize,
    catSize,
    {
      label: "cat",
      friction: 0.1,
      restitution: 0.2,
      density: 1,
      inertia: Infinity,
      frictionAir: 0.001,
      render: {
        visible: false,
      },
    }
  );

  // Create coin
  const coin = Matter.Bodies.circle(400, screenHeight - 250, 20, {
    isSensor: true,
    isStatic: true,
    label: "coin",
    render: { visible: false },
  });

  // Create obstacle
  const obstacle = Matter.Bodies.rectangle(700, screenHeight - 250, 50, 100, {
    isStatic: true,
    label: "obstacle",
    render: { visible: false },
  });

  Matter.World.add(world, [catBody, coin, obstacle]);

  // Collision detection
  Matter.Events.on(engine, "collisionStart", (event) => {
    event.pairs.forEach(({ bodyA, bodyB }) => {
      const labels = [bodyA.label, bodyB.label];

      if (labels.includes("cat") && labels.includes("coin")) {
        gameWorld.dispatch({ type: "coin-collected" });
        Matter.World.remove(world, coin); // remove the coin from the world
      }

      if (labels.includes("cat") && labels.includes("obstacle")) {
        gameWorld.dispatch({ type: "hit-obstacle" });
      }
    });
  });

  const entities = {
    physics: { engine, world }, lastDispatchTime: 0, // For safe dispatch throttling

    cat: Cat({
      body: catBody,
      size: catSize,
    }),

    coin: {
      body: coin,
      size: [40, 40],
      renderer: Coin,
    },

    obstacle: {
      body: obstacle,
      size: [50, 100],
      renderer: Obstacle,
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

  return entities;
};

import Matter from "matter-js";
import Constants from "../Constants";

let lastSpawnTime = 0;
const scrollSpeed = 2;

const CoinObstacleSystem = (entities, { time }) => {
  const world = entities.physics.world;
  const screenHeight = Constants.SCREEN_HEIGHT;
  const now = time.current;

  const spawnInterval = 2000; // every 2 seconds

  if (now - lastSpawnTime > spawnInterval) {
    lastSpawnTime = now;
      
    const spawnX = Constants.SCREEN_WIDTH + 100;
    const spawnY = screenHeight - 250;
    const type = Math.random() > 0.5 ? "coin" : "obstacle";

    if (type === "coin") {
      const coin = Matter.Bodies.circle(spawnX, spawnY, 20, {
        isSensor: true,
        isStatic: false,
        label: "coin",
        render: { visible: false },
      });

      const id = `coin_${now}`;
      Matter.World.add(world, coin);
      entities[id] = {
        body: coin,
        size: [40, 40],
        renderer: require("../components/Coin").default,
      };
    } else {
      const obstacle = Matter.Bodies.rectangle(spawnX, spawnY, 50, 100, {
        isStatic: false,
        label: "obstacle",
        render: { visible: false },
      });

      const id = `obstacle_${now}`;
      Matter.World.add(world, obstacle);
      entities[id] = {
        body: obstacle,
        size: [50, 100],
        renderer: require("../components/Obstacle").default,
      };
    }
  }

  // Scroll and clean up dynamic entities
  Object.keys(entities).forEach((key) => {
    const entity = entities[key];

    // Skip non-dynamic entities
    if (
      !entity.body ||
      !entity.body.position ||
      key === "cat" ||
      key.startsWith("floor") ||
      key === "physics"
    )
      return;

    // Move the entity leftward
    entity.body.position.x -= scrollSpeed;

    // Remove if it goes off screen
    if (entity.body.position.x < -100) {
      Matter.World.remove(world, entity.body);
      delete entities[key];
    }
  });

  return entities;
};

export default CoinObstacleSystem;
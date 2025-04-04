import Matter from "matter-js";
import Constants from "../Constants";

let lastSpawnTime = 0;
const scrollSpeed = 3; // Base speed
const MIN_SPACING = 400; // Minimum distance between items
const SPAWN_INTERVAL = 2000; // Base spawn interval
const HISTORY_LENGTH = 120; // Keep 2 seconds of history at 60fps

// Keep track of obstacle positions
const obstacleHistory = new Map();
let isInvulnerable = false;
let isRewinding = false;

const CoinObstacleSystem = (entities, { time }) => {
  const world = entities.physics.world;
  const screenHeight = Constants.SCREEN_HEIGHT;
  const now = time.current;

  // If rewinding or invulnerable, don't move or spawn obstacles
  if (isRewinding || isInvulnerable) {
    return entities;
  }

  // Find the rightmost item
  let rightmostX = 0;
  Object.keys(entities).forEach((key) => {
    const entity = entities[key];
    if (
      entity.body &&
      entity.body.position &&
      (key.startsWith("obstacle") || key.startsWith("coin"))
    ) {
      rightmostX = Math.max(rightmostX, entity.body.position.x);

      // Store obstacle positions
      if (key.startsWith("obstacle")) {
        if (!obstacleHistory.has(key)) {
          obstacleHistory.set(key, []);
        }
        const history = obstacleHistory.get(key);
        history.push({
          x: entity.body.position.x,
          y: entity.body.position.y,
          time: now,
        });
        if (history.length > HISTORY_LENGTH) {
          history.shift();
        }
      }
    }
  });

  // Calculate next spawn position based on all items
  const nextSpawnX = Math.max(
    Constants.SCREEN_WIDTH + 100,
    rightmostX + MIN_SPACING
  );

  // Spawn logic based on time interval and spacing
  if (now - lastSpawnTime > SPAWN_INTERVAL) {
    lastSpawnTime = now;

    const spawnX = nextSpawnX;
    const spawnY = screenHeight - 250;
    const type = Math.random() > 0.5 ? "coin" : "obstacle";

    if (type === "coin") {
      const coin = Matter.Bodies.circle(spawnX, spawnY, 20, {
        isSensor: true,
        isStatic: true,
        label: "coin",
        collisionFilter: {
          category: 0x0008, // Coin category
          mask: 0x0001, // Only collide with cat
          group: 0,
        },
      });

      const id = `coin_${now}`;
      Matter.World.add(world, coin);
      entities[id] = {
        body: coin,
        size: [40, 40],
        renderer: require("../components/Coin").default,
        scrollSpeed: scrollSpeed,
      };
    } else {
      const obstacle = Matter.Bodies.rectangle(spawnX, spawnY, 50, 100, {
        isStatic: true,
        label: "obstacle",
        isSensor: false,
        collisionFilter: {
          category: 0x0002, // Obstacle category
          mask: 0x0001, // Only collide with cat
          group: 0,
        },
        friction: 0,
        restitution: 0,
      });

      const id = `obstacle_${now}`;
      Matter.World.add(world, obstacle);
      entities[id] = {
        body: obstacle,
        size: [50, 100],
        renderer: require("../components/Obstacle").default,
        scrollSpeed: scrollSpeed,
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
    Matter.Body.setPosition(entity.body, {
      x: entity.body.position.x - scrollSpeed,
      y: entity.body.position.y,
    });

    // Remove if it goes off screen
    if (entity.body.position.x < -100) {
      Matter.World.remove(world, entity.body);
      delete entities[key];
      obstacleHistory.delete(key); // Clean up history
    }
  });

  return entities;
};

// Export rewind function for obstacles
CoinObstacleSystem.rewindObstacles = (entities, frames) => {
  Object.keys(entities).forEach((key) => {
    if (key.startsWith("obstacle")) {
      const history = obstacleHistory.get(key);
      if (history && history.length >= frames) {
        const position = history[history.length - frames];
        Matter.Body.setPosition(entities[key].body, position);
      }
    }
  });
};

// Add functions to control system state
CoinObstacleSystem.setInvulnerable = (value) => {
  isInvulnerable = value;
};

CoinObstacleSystem.setRewinding = (value) => {
  isRewinding = value;
};

export default CoinObstacleSystem;

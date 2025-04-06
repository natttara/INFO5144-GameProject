import Matter from "matter-js";
import Constants from "../Constants";

let lastSpawnTime = 0;
const MIN_SPACING = 400; // Minimum distance between items
const SPAWN_INTERVAL = 2000; // Base spawn interval
const HISTORY_LENGTH = 120; // Keep 2 seconds of history at 60fps

// Keep track of obstacle positions
const obstacleHistory = new Map();

const CoinObstacleSystem = (entities, { time }) => {
  //Only try to access .world if entities.physics is defined. otherwise, just return undefined instead of crashing.
  const world = entities.physics?.world;
  const screenHeight = Constants.SCREEN_HEIGHT;
  const now = time.current;

  // confirm world access - safety net that prevents random crashes
  if(!world){
    console.warn("World is undefined -skipping spawn");
    return entities;
  }

  // If rewinding or invulnerable, don't move or spawn obstacles
  if (CoinObstacleSystem.isRewinding || CoinObstacleSystem.isInvulnerable) {
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
          category: 0x0008,
          mask: 0x0001,
          group: 0,
        },
      });

      const id = `coin_${now}`;
      Matter.World.add(world, coin);
      entities[id] = {
        body: coin,
        size: [40, 40],
        renderer: require("../components/Coin").default,
        scrollSpeed: CoinObstacleSystem.baseScrollSpeed,
      };
    } else {
      const obstacle = Matter.Bodies.rectangle(spawnX, spawnY, 50, 100, {
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

      const id = `obstacle_${now}`;
      Matter.World.add(world, obstacle);
      entities[id] = {
        body: obstacle,
        size: [50, 100],
        renderer: require("../components/Obstacle").default,
        scrollSpeed: CoinObstacleSystem.baseScrollSpeed,
      };
    }
  }

  // Update positions of existing obstacles and coins
  Object.keys(entities).forEach((key) => {
    const entity = entities[key];
    if (key.startsWith("obstacle") || key.startsWith("coin")) {
      // Apply the entity's current scroll speed
      Matter.Body.translate(entity.body, {
        x: entity.scrollSpeed,
        y: 0,
      });

      // Remove if it goes off screen
      if (entity.body.position.x < -100) {
        Matter.World.remove(world, entity.body);
        delete entities[key];
        obstacleHistory.delete(key);
      }
    }
  });

  return entities;
};

// Initialize static properties after defining CoinObstacleSystem
CoinObstacleSystem.isRewinding = false;
CoinObstacleSystem.isInvulnerable = false;
CoinObstacleSystem.baseScrollSpeed = -4; // Reduced from -8 to -4 for slower movement

// Static methods
CoinObstacleSystem.setRewinding = (value) => {
  CoinObstacleSystem.isRewinding = value;
};

CoinObstacleSystem.setInvulnerable = (value) => {
  CoinObstacleSystem.isInvulnerable = value;
};

// New method to teleport obstacle
CoinObstacleSystem.teleportObstacle = (entities, obstacleId) => {
  const obstacle = entities[obstacleId];
  if (obstacle) {
    // Find rightmost obstacle position
    let rightmostX = Constants.SCREEN_WIDTH;
    Object.keys(entities).forEach((key) => {
      if (key.startsWith("obstacle") && key !== obstacleId) {
        const otherObstacle = entities[key];
        if (otherObstacle.body && otherObstacle.body.position) {
          rightmostX = Math.max(rightmostX, otherObstacle.body.position.x);
        }
      }
    });

    // Teleport to just right of the screen or rightmost obstacle
    const newX = Math.max(
      Constants.SCREEN_WIDTH + 50,
      rightmostX + MIN_SPACING
    );
    Matter.Body.setPosition(obstacle.body, {
      x: newX,
      y: obstacle.body.position.y,
    });
  }
};

export default CoinObstacleSystem;

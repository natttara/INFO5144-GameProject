import Matter from "matter-js";
import Constants from "../Constants";
import { spawnCoin, spawnObstacle } from "../entities";

let lastSpawnTime = 0;
const MIN_SPACING = 400;
const SPAWN_INTERVAL = 2000;
const obstacleHistory = new Map();

const CoinObstacleSystem = (entities, { time }) => {
  const world = entities.physics?.world;
  const screenHeight = Constants.SCREEN_HEIGHT;
  const now = time.current;

  if (!world) {
    console.warn("World is undefined -skipping spawn");
    return entities;
  }

  if (CoinObstacleSystem.isInvulnerable) {
    return entities;
  }

  let rightmostX = 0;
  Object.keys(entities).forEach((key) => {
    const entity = entities[key];
    if (
      entity.body &&
      entity.body.position &&
      (key.startsWith("obstacle") || key.startsWith("coin"))
    ) {
      rightmostX = Math.max(rightmostX, entity.body.position.x);
    }
  });

  const nextSpawnX = Math.max(
    Constants.SCREEN_WIDTH + 100,
    rightmostX + MIN_SPACING
  );

  if (now - lastSpawnTime > SPAWN_INTERVAL) {
    lastSpawnTime = now;

    const spawnX = nextSpawnX;
    const spawnY = screenHeight - 250;
    const type = Math.random() > 0.5 ? "coin" : "obstacle";
    const id = `${type}_${now}`;

    if (type === "coin") {
      spawnCoin(
        world,
        entities,
        spawnX,
        spawnY,
        id,
        CoinObstacleSystem.baseScrollSpeed
      );
    } else {
      spawnObstacle(
        world,
        entities,
        spawnX,
        spawnY,
        id,
        CoinObstacleSystem.baseScrollSpeed
      );
    }
  }

  Object.keys(entities).forEach((key) => {
    const entity = entities[key];
    if (key.startsWith("obstacle") || key.startsWith("coin")) {
      Matter.Body.translate(entity.body, {
        x: entity.scrollSpeed,
        y: 0,
      });

      if (entity.body.position.x < -100) {
        Matter.World.remove(world, entity.body);
        delete entities[key];
        obstacleHistory.delete(key);
      }
    }
  });

  return entities;
};

CoinObstacleSystem.isRewinding = false;
CoinObstacleSystem.isInvulnerable = false;
CoinObstacleSystem.baseScrollSpeed = -4;

CoinObstacleSystem.setRewinding = (value) => {
  CoinObstacleSystem.isRewinding = value;
};

CoinObstacleSystem.setInvulnerable = (value) => {
  CoinObstacleSystem.isInvulnerable = value;
};

CoinObstacleSystem.teleportObstacle = (entities, obstacleId) => {
  const obstacle = entities[obstacleId];
  if (obstacle) {
    let rightmostX = Constants.SCREEN_WIDTH;
    Object.keys(entities).forEach((key) => {
      if (key.startsWith("obstacle") && key !== obstacleId) {
        const other = entities[key];
        if (other.body && other.body.position) {
          rightmostX = Math.max(rightmostX, other.body.position.x);
        }
      }
    });

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

import Matter from "matter-js";
import CoinObstacleSystem from "./CoinObstacleSystem";
import MovementSystem from "./MovementSystem";

const INVULNERABLE_DURATION = 1500; // 1.5 seconds of invulnerability
const STARTING_X = 60; // Starting x position for the cat
const BOUNCE_DURATION = 25; // Short duration for state change

// Create a state object to avoid closure issues
const gameState = {
  isInvulnerable: false,
  invulnerableStartTime: 0,
  flashTimer: 0,
  isRewinding: false,
  rewindStartTime: 0,
};

const CollisionSystem = (entities, { events, dispatch, time }) => {
  const engine = entities.physics.engine;
  const world = engine.world;
  const cat = entities.cat;

  // Handle rewinding state
  if (gameState.isRewinding) {
    const timeSinceRewind = time.current - gameState.rewindStartTime;

    if (timeSinceRewind < BOUNCE_DURATION) {
      // Brief pause while teleporting obstacle
      CoinObstacleSystem.setRewinding(true);
      MovementSystem.setRewinding(true);
      dispatch({ type: "background-rewind", isRewinding: true });
      return entities;
    } else {
      // Done rewinding
      gameState.isRewinding = false;
      gameState.isInvulnerable = true;
      gameState.invulnerableStartTime = time.current;
      cat.opacity = 0.3;
      CoinObstacleSystem.setRewinding(false);
      MovementSystem.setRewinding(false);
      dispatch({ type: "background-rewind", isRewinding: false });
    }
  }

  // Handle invulnerability period
  if (gameState.isInvulnerable) {
    const timeSinceHit = time.current - gameState.invulnerableStartTime;

    // Flash the cat every 100ms
    if (Math.floor(timeSinceHit / 100) !== gameState.flashTimer) {
      gameState.flashTimer = Math.floor(timeSinceHit / 100);
      cat.opacity = cat.opacity === 1 ? 0.3 : 1;
    }

    // Check if invulnerability period is over
    if (timeSinceHit >= INVULNERABLE_DURATION) {
      console.log("Ending invulnerability state");
      gameState.isInvulnerable = false;
      cat.opacity = 1;
      gameState.flashTimer = 0;
      CoinObstacleSystem.setInvulnerable(false);
    }
  }

  // Always ensure collision detection is set up
  if (!engine.collisionStartHandler) {
    // Set up collision handler
    const collisionHandler = (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        const labels = [bodyA.label, bodyB.label];

        if (labels.includes("cat") && labels.includes("coin")) {
          dispatch({ type: "coin-collected" });
          const coinBody = bodyA.label === "coin" ? bodyA : bodyB;
          Matter.World.remove(world, coinBody);
        }

        // Handle obstacle collisions
        if (
          labels.includes("cat") &&
          labels.includes("obstacle") &&
          !gameState.isInvulnerable &&
          !gameState.isRewinding
        ) {
          console.log("Obstacle collision detected!");

          // Start rewind process
          gameState.isRewinding = true;
          gameState.rewindStartTime = time.current;

          // Get the obstacle body and entity
          const obstacleBody = bodyA.label === "obstacle" ? bodyA : bodyB;
          const currentObstacleId =
            bodyA.label === "obstacle"
              ? Object.keys(entities).find(
                  (key) => entities[key].body === bodyA
                )
              : Object.keys(entities).find(
                  (key) => entities[key].body === bodyB
                );

          if (currentObstacleId) {
            // Tell CoinObstacleSystem to teleport the obstacle
            CoinObstacleSystem.teleportObstacle(entities, currentObstacleId);
          }

          // Dispatch hit event
          dispatch({ type: "hit-obstacle" });
        }
      });
    };

    Matter.Events.on(engine, "collisionStart", collisionHandler);
    engine.collisionStartHandler = collisionHandler;
  }

  // Update physics engine if not rewinding
  if (!gameState.isRewinding) {
    Matter.Engine.update(engine, 1000 / 60);
  }

  return entities;
};

export default CollisionSystem;

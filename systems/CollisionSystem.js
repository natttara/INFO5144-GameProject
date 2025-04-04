import Matter from "matter-js";
import CoinObstacleSystem from "./CoinObstacleSystem";
import MovementSystem from "./MovementSystem";

// Keep track of cat position history
const positionHistory = [];
const HISTORY_LENGTH = 120; // About 2 seconds of history at 60fps
const REWIND_AMOUNT = 90; // About 1.5 seconds rewind
const INVULNERABLE_DURATION = 1500; // 1.5 seconds of invulnerability
const BOUNCE_VELOCITY = -8; // Bounce velocity when hitting obstacle

let isInvulnerable = false;
let invulnerableStartTime = 0;
let flashTimer = 0;
let isRewinding = false;
let rewindStartTime = 0;
const REWIND_DURATION = 2000; // 2 seconds to rewind
const PAUSE_AFTER_REWIND = 5000; // 5 seconds pause after rewind

const CollisionSystem = (entities, { events, dispatch, time }) => {
  const engine = entities.physics.engine;
  const world = engine.world;
  const cat = entities.cat;

  // Handle rewinding state
  if (isRewinding) {
    const timeSinceRewind = time.current - rewindStartTime;

    if (timeSinceRewind < REWIND_DURATION) {
      // Still rewinding - don't update physics
      CoinObstacleSystem.setRewinding(true);
      MovementSystem.setRewinding(true);
      dispatch({ type: "background-rewind", isRewinding: true });
      return entities;
    } else if (timeSinceRewind < REWIND_DURATION + PAUSE_AFTER_REWIND) {
      // In pause period after rewind - keep everything frozen
      CoinObstacleSystem.setRewinding(true);
      MovementSystem.setRewinding(true);
      dispatch({ type: "background-rewind", isRewinding: true });
      cat.action = "idle"; // Make sure cat stays idle during the long pause
      return entities;
    } else {
      // Done rewinding and pausing
      isRewinding = false;
      isInvulnerable = true;
      CoinObstacleSystem.setRewinding(false);
      MovementSystem.setRewinding(false);
      dispatch({ type: "background-rewind", isRewinding: false });
      invulnerableStartTime = time.current;
      cat.action = "run";
      Matter.Body.setVelocity(cat.body, { x: 0, y: 0 });
    }
  }

  // Handle invulnerability period
  if (isInvulnerable) {
    const timeSinceHit = time.current - invulnerableStartTime;

    // Flash the cat every 100ms
    if (Math.floor(timeSinceHit / 100) !== flashTimer) {
      flashTimer = Math.floor(timeSinceHit / 100);
      cat.opacity = cat.opacity === 1 ? 0.3 : 1;
    }

    // Check if invulnerability period is over
    if (timeSinceHit >= INVULNERABLE_DURATION) {
      isInvulnerable = false;
      CoinObstacleSystem.setInvulnerable(false);
      cat.opacity = 1;
      cat.action = "run";
      dispatch({ type: "resume-running" });
    }
  }

  // Store current cat position in history
  if (cat && cat.body && !isRewinding) {
    positionHistory.push({
      x: cat.body.position.x,
      y: cat.body.position.y,
      velocity: { x: cat.body.velocity.x, y: cat.body.velocity.y },
    });

    // Keep history at fixed length
    if (positionHistory.length > HISTORY_LENGTH) {
      positionHistory.shift();
    }
  }

  // Set up collision detection if not already set up
  if (!engine.collisionSetup) {
    Matter.Events.on(engine, "collisionStart", (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        const labels = [bodyA.label, bodyB.label];

        if (labels.includes("cat") && labels.includes("coin")) {
          dispatch({ type: "coin-collected" });
          const coinBody = bodyA.label === "coin" ? bodyA : bodyB;
          Matter.World.remove(world, coinBody);
        }

        if (
          labels.includes("cat") &&
          labels.includes("obstacle") &&
          !isInvulnerable &&
          !isRewinding
        ) {
          console.log("Collision detected with obstacle!");

          // Start rewind process
          isRewinding = true;
          rewindStartTime = time.current;
          cat.action = "idle";

          // Rewind cat position
          if (positionHistory.length >= REWIND_AMOUNT) {
            const rewindPosition =
              positionHistory[positionHistory.length - REWIND_AMOUNT];
            Matter.Body.setPosition(cat.body, {
              x: 60, // Reset to starting x position
              y: rewindPosition.y,
            });

            // Apply bounce effect
            Matter.Body.setVelocity(cat.body, { x: 0, y: BOUNCE_VELOCITY });

            // Rewind all game elements
            CoinObstacleSystem.rewindObstacles(entities, REWIND_AMOUNT);
            MovementSystem.rewindFloors(entities, REWIND_AMOUNT);
            dispatch({
              type: "rewind-background",
              frames: REWIND_AMOUNT,
            });

            // Clear history after rewind
            positionHistory.length = 0;
          }

          // Dispatch hit event after rewind
          dispatch({ type: "hit-obstacle" });
        }
      });
    });

    engine.collisionSetup = true;
  }

  // Update physics engine if not rewinding
  if (!isRewinding) {
    Matter.Engine.update(engine, 1000 / 60);
  }

  // Debug: Log positions of cat and obstacles
  Object.keys(entities).forEach((key) => {
    const entity = entities[key];
    if (entity.body) {
      if (entity.body.label === "cat") {
        console.log("Cat position:", entity.body.position);
      }
      if (entity.body.label === "obstacle") {
        console.log("Obstacle position:", entity.body.position);
      }
    }
  });

  return entities;
};

export default CollisionSystem;

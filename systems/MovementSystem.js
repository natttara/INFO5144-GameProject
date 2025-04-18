import Constants from "../Constants";

// Keep track of floor offset history
const floorHistory = [];

let isRewinding = false;
const baseScrollSpeed = 3;

const MovementSystem = (entities, { time, dispatch }) => {
  const floor1 = entities.floor1;
  const floor2 = entities.floor2;
  const screenWidth = Constants.SCREEN_WIDTH;
  const backgroundWidth = 800;
  const coin = entities.coin?.body;
  const obstacle = entities.obstacle?.body;

  if (!entities.physics) {
    entities.physics = {};
  }

  // Add lastDispatchTime to physics state if not present
  if (!entities.physics.lastDispatchTime) {
    entities.physics.lastDispatchTime = 0;
  }

  // Store floor positions
  if (floor1 && floor2) {
    floorHistory.push({
      floor1Offset: floor1.offsetX,
      floor2Offset: floor2.offsetX,
      time: time.current,
    });
  }

  // Only update positions if not rewinding
  if (floor1 && floor2) {
    floor1.offsetX += baseScrollSpeed;
    floor2.offsetX += baseScrollSpeed;

    if (floor1.offsetX >= screenWidth) {
      floor1.offsetX = 0;
    }
    if (floor2.offsetX >= screenWidth) {
      floor2.offsetX = 0;
    }

    floor1.renderer = (
      <floor1.renderer.type
        {...floor1.renderer.props}
        offsetX={Math.round(floor1.offsetX)}
      />
    );
    floor2.renderer = (
      <floor2.renderer.type
        {...floor2.renderer.props}
        offsetX={Math.round(floor2.offsetX)}
      />
    );

    // Only dispatch every 100ms to reduce state updates
    if (time.current - entities.physics.lastDispatchTime > 100) {
      entities.physics.lastDispatchTime = time.current;
      dispatch({
        type: "floor-offset",
        offsetX: floor1.offsetX,
        backgroundWidth,
        isRewinding,
      });
    }
  }

  // Move coin and obstacle only if not rewinding
  if (!isRewinding) {
    if (coin) {
      coin.position.x -= baseScrollSpeed;
    }

    if (obstacle) {
      obstacle.position.x -= baseScrollSpeed;
    }
  }

  return entities;
};

// Add functions to control system state
MovementSystem.setRewinding = (value) => {
  isRewinding = value;
};

export default MovementSystem;

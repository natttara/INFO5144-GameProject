import Constants from "../Constants";

const MovementSystem = (entities, { time, dispatch }) => {
  const floor1 = entities.floor1;
  const floor2 = entities.floor2;
  const baseScrollSpeed = 3;
  const screenWidth = Constants.SCREEN_WIDTH;
  const backgroundWidth = 800;
  const coin = entities.coin?.body;
  const obstacle = entities.obstacle?.body;

  // Add lastDispatchTime to physics state if not present
  if (!entities.physics.lastDispatchTime) {
    entities.physics.lastDispatchTime = 0;
  }

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
  }

  // Move coin
  if (coin) {
    coin.position.x -= baseScrollSpeed;
  }

  // Move obstacle
  if (obstacle) {
    obstacle.position.x -= baseScrollSpeed;
  }

  // Only dispatch every 100ms to reduce state updates
  if (time.current - entities.physics.lastDispatchTime > 100) {
    entities.physics.lastDispatchTime = time.current;
    dispatch({
      type: "floor-offset",
      offsetX: floor1?.offsetX || 0,
      backgroundWidth,
    });
  }

  return entities;
};

export default MovementSystem;

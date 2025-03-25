import Constants from "../Constants";

const MovementSystem = (entities, { time, dispatch }) => {
  const floor1 = entities.floor1;
  const floor2 = entities.floor2;
  const scrollSpeed = 2;
  const screenWidth = Constants.SCREEN_WIDTH;
  const backgroundWidth = 800;

  if (floor1 && floor2) {
    floor1.offsetX += scrollSpeed;
    floor2.offsetX += scrollSpeed;

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

    // Just pass the current time to trigger background updates
    dispatch({
      type: "floor-offset",
      offsetX: time.current,
      backgroundWidth,
    });
  }

  return entities;
};

export default MovementSystem;

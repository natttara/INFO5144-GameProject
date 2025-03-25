import Constants from "../Constants";

const MovementSystem = (entities, { time }) => {
  const floor1 = entities.floor1;
  const floor2 = entities.floor2;
  const scrollSpeed = 2;
  const screenWidth = Constants.SCREEN_WIDTH;

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
  }

  return entities;
};

export default MovementSystem;

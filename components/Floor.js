import React from "react";
import { Image } from "react-native";
import Matter from "matter-js";

const Floor = (props) => {
  const width = props.size.width;
  const height = props.size.height;
  const x = props.body.position.x - width / 2;
  const y = props.body.position.y - height / 2;

  return (
    <Image
      source={props.image}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: width,
        height: height,
        resizeMode: "stretch",
      }}
    />
  );
};

// Matter.js physics wrapper
export default (world, pos, size, image) => {
  const body = Matter.Bodies.rectangle(pos.x, pos.y, size.width, size.height, {
    isStatic: true, // Floor should not move
    label: "Floor",
  });

  Matter.World.add(world, [body]);

  return {
    body,
    size,
    image,
    renderer: <Floor body={body} size={size} image={image} />,
  };
};

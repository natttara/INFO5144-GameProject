import React from "react";
import { Image } from "react-native";
import Matter from "matter-js";

const Floor = (props) => {
  const width = props.size.width;
  const height = props.size.height;
  const x = Math.round(props.body.position.x - width / 2);
  const y = Math.round(props.body.position.y - height / 2);
  const offsetX = Math.round(props.offsetX || 0);

  return (
    <Image
      source={props.image}
      style={{
        position: "absolute",
        left: x - offsetX,
        top: y,
        width: width,
        height: height,
        resizeMode: "stretch",
      }}
    />
  );
};

export default (world, pos, size, image) => {
  const body = Matter.Bodies.rectangle(
    Math.round(pos.x),
    Math.round(pos.y),
    size.width,
    size.height,
    {
      isStatic: true,
      label: "Floor",
      friction: 1,
    }
  );

  Matter.World.add(world, [body]);

  return {
    body,
    size,
    image,
    offsetX: 0,
    renderer: <Floor body={body} size={size} image={image} offsetX={0} />,
  };
};

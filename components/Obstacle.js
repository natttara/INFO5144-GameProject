import React from "react";
import { Image } from "react-native";
import Images from "../Images";

const Obstacle = ({ body, size }) => {
  const x = body.position.x - size[0] / 2;
  const y = body.position.y - size[1] / 2;

  return (
    <Image
      source={Images.obstacle}
      style={{
        position: "absolute",
        width: size[0],
        height: size[1],
        left: x,
        top: y,
        zIndex: 5,
      }}
    />
  );
};

export default Obstacle;
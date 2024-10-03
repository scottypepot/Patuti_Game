/* eslint-disable react/prop-types */

import bulletsH from "../assets/res/bullet_h.png";
import bulletsV from "../assets/res/bullet_v.png";

const Bullet = ({ position }) => {
  // Determine which bullet image to use
  const bulletImage = position.speedX !== 0 ? bulletsH : bulletsV;

  return (
    <div
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        width: 30,
        height: 30,
        borderRadius: "50%",
      }}
    >
      <img src={bulletImage} alt="Bullet" width={30} height={30} />
    </div>
  );
};

export default Bullet;

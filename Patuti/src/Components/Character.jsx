/* eslint-disable react/prop-types */

import { useState, useEffect } from 'react'; // Add useState and useEffect
import left1 from '../assets/res/left-1.png'
import left2 from '../assets/res/left-2.png'
import left3 from '../assets/res/left-3.png'
import left4 from '../assets/res/left-4.png'
import left5 from '../assets/res/left-5.png'

const Character = ({ position, currentImage }) => { // Accept currentImage as a prop
  return (
    <div
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        width: 50,
        height: 100,
      }}
    >
      <img src={currentImage} alt="Description of image" width={150} height={150} />
    </div>
  );
};

export default Character;
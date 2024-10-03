import { useState, useEffect } from "react";
import Bullet from "./Bullet";
import Character from "./Character";
import left1 from '../assets/res/left-1.png';
import left2 from '../assets/res/left-2.png';
import left3 from '../assets/res/left-3.png';
import left4 from '../assets/res/left-4.png';
import left5 from '../assets/res/left-5.png';
import right1 from '../assets/res/right-1.png';
import right2 from '../assets/res/right-2.png';
import right3 from '../assets/res/right-3.png';
import right4 from '../assets/res/right-4.png';
import right5 from '../assets/res/right-5.png';
import jump1 from '../assets/res/jump-1.png';
import jump2 from '../assets/res/jump-2.png';
import jump3 from '../assets/res/jump-3.png';
import jump4 from '../assets/res/jump-4.png';
import jump5 from '../assets/res/jump-5.png';
import dock3 from '../assets/res/dock-3.png';
import dead from '../assets/res/dead.png';

const Game = () => {
  const moves = {
    left: [left1, left2, left3, left4, left5],
    right: [right1, right2, right3, right4, right5],
    jump: [jump1, jump2, jump3, jump4, jump5],
  };

  const [score, updateScore] = useState(0);
  const [leftIndex, setLeftIndex] = useState(1);
  const [rightIndex, setRightIndex] = useState(1);
  const [jumpIndex, setJumpIndex] = useState(1);

  const [hp, setHp] = useState(100);
  const [bullets, setBullets] = useState([]);
  const [characterPosition, setCharacterPosition] = useState({
    x: window.innerWidth / 2 - 50,
    y: window.innerHeight - 640,
  });
  const [currentImage, setCurrentImage] = useState(left1);
  const [isFalling, setIsFalling] = useState(false);
  const [jumping, setJumping] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const bullet_v = 6; // Vertical speed for bullets coming from the top

  useEffect(() => {
    const handleResize = () => {
      setCharacterPosition((prev) => ({
        ...prev,
        x: window.innerWidth / 2 - 25,
        y: window.innerHeight - 640,
      }));
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const horizontalOffset = 53;
  useEffect(() => {
    const interval = setInterval(() => {
      const fromTop = Math.random() < 0.5;
      let newBullet;

      if (fromTop) {
        const x = Math.random() * (platform.right - platform.left) + platform.left + horizontalOffset;
        newBullet = {
          id: Date.now(),
          x: x,
          y: 0, // Start at the very top of the screen
          speedX: 0,
          speedY: bullet_v,
        };
      } else {
        newBullet = {
          id: Date.now(),
          x: window.innerWidth,
          y: Math.random() * window.innerHeight,
          speedX: -Math.random() * 6 - 2, // Move from right to left
          speedY: 0,
        };
      }

      setBullets((prevBullets) => [...prevBullets, newBullet]);
    }, 600);

    return () => clearInterval(interval);
  }, []);

  // Separate bullet movement logic
  // Inside the 'moveBullets' useEffect where collisions are detected:
useEffect(() => {
  const moveBullets = () => {
    setBullets((prevBullets) => prevBullets.map(bullet => {
      let newBullet = { ...bullet };
      if (bullet.speedX !== 0) {
        newBullet.x += bullet.speedX;
      } else if (bullet.speedY !== 0) {
        newBullet.y += bullet.speedY;
      }

      // Remove bullets that are out of bounds
      if (
        newBullet.x < 0 || newBullet.x > window.innerWidth ||
        newBullet.y < 0 || newBullet.y > window.innerHeight
      ) {
        return null;
      }

      return newBullet;
    }).filter(Boolean)); // Remove null values

    // Check for collisions
    const characterWidth = 150; // Adjust based on your character's width
    const characterHeight = 150; // Adjust based on your character's height

    setBullets((prevBullets) => {
      return prevBullets.filter((bullet) => {
        const bulletRect = {
          left: bullet.x,
          right: bullet.x + 10, // Bullet width
          top: bullet.y,
          bottom: bullet.y + 10, // Bullet height
        };

        const characterRect = {
          left: characterPosition.x,
          right: characterPosition.x + characterWidth,
          top: characterPosition.y,
          bottom: characterPosition.y + characterHeight,
        };

        const isColliding = (
          bulletRect.left < characterRect.right &&
          bulletRect.right > characterRect.left &&
          bulletRect.top < characterRect.bottom &&
          bulletRect.bottom > characterRect.top
        );

        if (isColliding) {
          setHp((prevHp) => {
            const newHp = Math.max(prevHp - 10, 0);
            if (newHp === 0) {
              setGameOver(true); // Trigger game over if hp reaches 0
              setCurrentImage(dead);
            }
            return newHp;
          });
          return false; // Remove the bullet from the array
        }

        return true; // Keep the bullet if no collision
      });
    });
  };

  const bulletInterval = setInterval(moveBullets, 20);

  return () => clearInterval(bulletInterval);
}, [characterPosition]);


  const platform = {
    left: 550,
    right: 1150,
    top: 400,
    bottom: 2000,
  };

  const checkIfFalling = () => {
    if (
      characterPosition.x < platform.left ||
      characterPosition.x > platform.right ||
      characterPosition.y > platform.top
    ) {
      setIsFalling(true);
    }
  };

  useEffect(() => {
    if (isFalling) {
      const fallInterval = setInterval(() => {
        setCharacterPosition((prev) => {
          const newY = Math.min(prev.y + 2, window.innerHeight - 100);
          if (newY >= window.innerHeight - 100) {
            clearInterval(fallInterval);
            setHp(0);
            setCurrentImage(dead);
            setGameOver(true); // Set game over state
            return {
              ...prev,
              y: window.innerHeight - 100,
            };
          }
          return {
            ...prev,
            y: newY,
          };
        });
      }, 1);
    }
  }, [isFalling]);

  useEffect(() => {
    if (jumping) {
      const jumpHeight = 100; // Maximum jump height
      const jumpSpeed = 20; // Speed of jumping up
      const gravity = 10; // Speed of falling down

      let currentJumpHeight = 0;

      const jumpInterval = setInterval(() => {
        setCharacterPosition((prev) => ({
          ...prev,
          y: Math.max(prev.y - jumpSpeed, 0),
        }));

        currentJumpHeight += jumpSpeed;
        if (currentJumpHeight >= jumpHeight) {
          clearInterval(jumpInterval);
          const fallInterval = setInterval(() => {
            setCharacterPosition((prev) => {
              const newY = Math.min(prev.y + gravity, platform.top - 110);
              if (newY >= platform.top - 110) {
                clearInterval(fallInterval);
                setJumping(false);
                return {
                  ...prev,
                  y: platform.top - 110,
                };
              }
              return {
                ...prev,
                y: newY,
              };
            });
          }, 1000 / 60);
        }
      }, 1000 / 60);
    }
  }, [jumping]);

  const handleKeyPress = (event) => {
    if (hp > 0 && !isFalling && !gameOver) {
      if (event.key === "ArrowRight") {
        setRightIndex((prev) => prev + 1);
        setCurrentImage(moves.right[rightIndex % moves.right.length]);
        setCharacterPosition((prev) => ({
          ...prev,
          x: Math.min(prev.x + 20, window.innerWidth - 50),
        }));
      } else if (event.key === "ArrowLeft") {
        setLeftIndex((prev) => prev + 1);
        setCurrentImage(moves.left[leftIndex % moves.left.length]);
        setCharacterPosition((prev) => ({
          ...prev,
          x: Math.max(prev.x - 20, 0),
        }));
      } else if (event.key === "ArrowUp") {
        if (!jumping) {
          setJumping(true);
          setJumpIndex((prev) => prev + 1);
          setCurrentImage(moves.jump[jumpIndex % moves.jump.length]);
      
          const jumpHeight = 100;  // Maximum jump height
          const jumpSpeed = 5;     // Speed of jumping up
          let currentJumpHeight = 0;
          
          const jump = () => {
            setCharacterPosition((prev) => ({
              ...prev,
              y: Math.max(prev.y - jumpSpeed, 0),  // Move the character up
            }));
      
            currentJumpHeight += jumpSpeed;
      
            // If the character reaches maximum jump height, stop going up
            if (currentJumpHeight < jumpHeight) {
              requestAnimationFrame(jump);  // Continue the jump
            } else {
              // Falling down after the jump
              const fall = () => {
                setCharacterPosition((prev) => {
                  const newY = Math.min(prev.y + jumpSpeed, platform.top - 110);
                  if (newY >= platform.top - 110) {
                    setJumping(false);
                    return {
                      ...prev,
                      y: platform.top - 110,
                    };
                  }
                  return {
                    ...prev,
                    y: newY,
                  };
                });
      
                if (!jumping) return;  // Stop falling if jump is canceled
                requestAnimationFrame(fall);  // Continue falling
              };
      
              requestAnimationFrame(fall);  // Start falling
            }
          };
      
          requestAnimationFrame(jump);  // Start jumping
        }
      } else if (event.key === "ArrowDown") {
        setCurrentImage(dock3);
        setCharacterPosition((prev) => {
          const newY = Math.min(prev.y + 20, window.innerHeight - 100);
          if (newY >= window.innerHeight - 100) {
            setHp(0);
            setCurrentImage(dead);
            setGameOver(true); // Set game over state
          }
          return {
            ...prev,
            y: newY,
          };
        });
      }
    } else if (gameOver && event.key === "Enter") {
      // Restart game when Enter key is pressed after game over
      setGameOver(false);
      setHp(100);
      setBullets([]);
      setCharacterPosition({
        x: window.innerWidth / 2 - 50,
        y: window.innerHeight - 640,
      });
      setCurrentImage(left1);
      setIsFalling(false);
      setJumping(false);
    }

    checkIfFalling();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div
      tabIndex="0"
      onKeyDown={handleKeyPress}
      style={{ 
        position: "relative", 
        width: "100vw", 
        height: "100vh", 
        backgroundImage: "url('src/assets/res/background.png')", 
        backgroundSize: "cover", 
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {gameOver ? (
        <div style={{ 
          position: "absolute", 
          top: "0", 
          left: "0", 
          width: "100%", 
          height: "100%", 
          backgroundColor: "black", // Plain color background
          color: "white", 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "center", 
          alignItems: "center" 
        }}>
          <h1>Game Over!</h1>
          <button 
            onClick={() => {
              setGameOver(false);
              setHp(100);
              setBullets([]);
              setCharacterPosition({
                x: window.innerWidth / 2 - 50,
                y: window.innerHeight - 640,
              });
              setCurrentImage(left1);
              setIsFalling(false);
              setJumping(false);
            }}
            style={{ 
              marginTop: "20px", 
              padding: "10px 20px", 
              fontSize: "16px", 
              cursor: "pointer" 
            }}
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div
            style={{ 
              position: "relative", 
              width: "1920px", 
              height: "1080px",
              backgroundImage: "url('src/assets/res/area.png')", 
              backgroundPosition: "center center", 
              backgroundRepeat: "no-repeat",
            }}
          >
            {hp > 0 && !gameOver && <Character position={characterPosition} currentImage={currentImage} />}
            {hp <= 0 && !gameOver && <Character position={characterPosition} currentImage={dead} />}

            {bullets.map((bullet) => (
              <Bullet key={bullet.id} position={bullet} />
            ))}

            {!gameOver && (
              <>
                <div style={{ 
                  position: "absolute", 
                  top: "5vh", 
                  left: "57vw", 
                  width: '18.2vw', 
                  height: '4.6vh', 
                  backgroundColor: 'white', 
                  borderRadius: '5px' 
                }}>
                  <div style={{ 
                    width: `${hp}%`, 
                    height: '100%', 
                    backgroundColor: 'red', 
                    borderRadius: '5px' 
                  }} />
                </div>

                <div style={{ 
                  position: "absolute", 
                  top: "5vh", 
                  left: "76vw", 
                  color: "white", 
                  fontSize: "48px" 
                }}>HP: {hp}</div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Game;

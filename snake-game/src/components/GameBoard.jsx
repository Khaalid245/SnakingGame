import React, { useState, useEffect } from 'react';

const gridSize = 20; // Size of the grid
const initialSnake = [
  { x: 8, y: 8 },
  { x: 7, y: 8 },
  { x: 6, y: 8 },
];
const initialFood = { x: 12, y: 12 };
const numWalls = 5; // Number of small walls inside the grid

function GameBoard() {
  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState(initialFood);
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [walls, setWalls] = useState(generateWalls());

  // Audio effects
  const soundEatFood = new Audio('/sound/eat_food.mp3');
  const soundGameOver = new Audio('/sound/game_over.mp3');

  // Generate small walls inside the grid (as lines)
  function generateWalls() {
    let walls = [];
    while (walls.length < numWalls) {
      // Randomly choose if the wall should be horizontal or vertical
      const isHorizontal = Math.random() < 0.5;
      const position = Math.floor(Math.random() * gridSize);

      // Random length of the wall (2 to 5 blocks)
      const length = Math.floor(Math.random() * 4) + 2;

      if (isHorizontal) {
        // Create a horizontal wall at a random Y position, spanning 'length' blocks in X
        const xStart = Math.floor(Math.random() * (gridSize - length));
        const newWall = Array.from({ length }).map((_, i) => ({
          x: xStart + i,
          y: position,
        }));

        walls = [...walls, ...newWall];
      } else {
        // Create a vertical wall at a random X position, spanning 'length' blocks in Y
        const yStart = Math.floor(Math.random() * (gridSize - length));
        const newWall = Array.from({ length }).map((_, i) => ({
          x: position,
          y: yStart + i,
        }));

        walls = [...walls, ...newWall];
      }
    }
    return walls;
  }

  const moveSnake = () => {
    if (isPaused) return;

    let newSnake = [...snake];
    const head = { ...newSnake[0] };

    // Move snake based on direction
    switch (direction) {
      case 'RIGHT':
        head.x += 1;
        break;
      case 'LEFT':
        head.x -= 1;
        break;
      case 'UP':
        head.y -= 1;
        break;
      case 'DOWN':
        head.y += 1;
        break;
      default:
        break;
    }

    // Check for collision with boundaries, self, or walls
    if (
      head.x < 0 ||
      head.x >= gridSize ||
      head.y < 0 ||
      head.y >= gridSize ||
      newSnake.some(segment => segment.x === head.x && segment.y === head.y) ||
      walls.some(wall => wall.x === head.x && wall.y === head.y)
    ) {
      soundGameOver.play();
      setGameOver(true);
      return;
    }

    newSnake.unshift(head);

    // Check if snake eats food
    if (head.x === food.x && head.y === food.y) {
      setScore(score + 1);
      soundEatFood.play();
      let newFood;
      do {
        newFood = {
          x: Math.floor(Math.random() * gridSize),
          y: Math.floor(Math.random() * gridSize),
        };
      } while (
        newSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y) ||
        walls.some(wall => wall.x === newFood.x && wall.y === newFood.y)
      );
      setFood(newFood);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  useEffect(() => {
    if (gameOver || isPaused) return;
    const interval = setInterval(() => {
      moveSnake();
    }, 150); // Normal game speed
    return () => clearInterval(interval);
  }, [snake, direction, gameOver, isPaused]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp' && direction !== 'DOWN') setDirection('UP');
    if (e.key === 'ArrowDown' && direction !== 'UP') setDirection('DOWN');
    if (e.key === 'ArrowLeft' && direction !== 'RIGHT') setDirection('LEFT');
    if (e.key === 'ArrowRight' && direction !== 'LEFT') setDirection('RIGHT');
    if (e.key === 'p' || e.key === 'P') setIsPaused(!isPaused); // Toggle pause
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isPaused]);

  const restartGame = () => {
    setSnake(initialSnake);
    setFood(initialFood);
    setDirection('RIGHT');
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setWalls(generateWalls()); // Regenerate walls
  };

  return (
    <div className="game-container" style={{ position: 'relative', width: '400px', height: '400px', backgroundColor: '#f4f4f4', border: '1px solid black' }}>
      {gameOver && (
        <div className="game-over" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '24px', color: 'red', textAlign: 'center' }}>
          Game Over! <br />
          Score: {score}
          <br />
          <button onClick={restartGame}>Restart</button>
        </div>
      )}
      {isPaused && !gameOver && (
        <div className="paused" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '24px', color: 'orange', textAlign: 'center' }}>
          Game Paused <br />
          Press "P" to Resume
        </div>
      )}
      <div
        className="snake"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridSize}, 20px)`,
          gridTemplateRows: `repeat(${gridSize}, 20px)`,
          gap: '1px',
        }}
      >
        {/* Render Snake */}
        {Array.from({ length: gridSize * gridSize }).map((_, index) => {
          const x = index % gridSize;
          const y = Math.floor(index / gridSize);
          const isSnake = snake.some(segment => segment.x === x && segment.y === y);
          const isFood = food.x === x && food.y === y;
          const isWall = walls.some(wall => wall.x === x && wall.y === y);

          return (
            <div
              key={index}
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: isSnake
                  ? 'green'
                  : isFood
                  ? 'red'
                  : isWall
                  ? 'gray'
                  : '#fff',
                border: '1px solid #ddd',
              }}
            />
          );
        })}
      </div>
      <div style={{ position: 'absolute', top: '10px', left: '10px', color: 'black', fontSize: '18px' }}>
        Score: {score}
      </div>
      <div style={{ position: 'absolute', top: '10px', right: '10px', color: 'black', fontSize: '18px' }}>
        Level: 1 {/* You can implement level logic if needed */}
      </div>
    </div>
  );
}

export default GameBoard;

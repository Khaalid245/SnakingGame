// src/components/GameOver.js
import React from 'react';

function GameOver({ score, bestScore, onRestart }) {
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col justify-center items-center">
      <div className="bg-gray-800 p-6 rounded-lg text-center">
        <h2 className="text-white text-3xl font-semibold mb-4">Game Over!</h2>
        <p className="text-white text-lg mb-2">Your Final Score: {score}</p>
        <p className="text-white text-lg mb-2">Best Score: {bestScore}</p>
        <div className="flex justify-center gap-4 mt-4">
          <button 
            className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition duration-300"
            onClick={onRestart}
          >
            Restart
          </button>
          <button 
            className="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700 transition duration-300"
            onClick={() => window.location.reload()}
          >
            Quit
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameOver;

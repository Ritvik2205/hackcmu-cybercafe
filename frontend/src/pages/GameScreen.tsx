import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gameAPI } from '../services/api';
import { GameType } from '../types';

// Simple Snake Game Component
const SnakeGame: React.FC<{ onGameEnd: (score: number) => void }> = ({ onGameEnd }) => {
  const [gameState, setGameState] = useState({
    snake: [{ x: 10, y: 10 }],
    food: { x: 15, y: 15 },
    direction: { x: 0, y: 0 },
    score: 0,
    gameOver: false,
  });

  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isRunning) return;

      switch (e.key) {
        case 'ArrowUp':
          setGameState(prev => ({ ...prev, direction: { x: 0, y: -1 } }));
          break;
        case 'ArrowDown':
          setGameState(prev => ({ ...prev, direction: { x: 0, y: 1 } }));
          break;
        case 'ArrowLeft':
          setGameState(prev => ({ ...prev, direction: { x: -1, y: 0 } }));
          break;
        case 'ArrowRight':
          setGameState(prev => ({ ...prev, direction: { x: 1, y: 0 } }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning || gameState.gameOver) return;

    const gameLoop = setInterval(() => {
      setGameState(prev => {
        const newSnake = [...prev.snake];
        const head = { ...newSnake[0] };
        
        head.x += prev.direction.x;
        head.y += prev.direction.y;

        // Check boundaries
        if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
          return { ...prev, gameOver: true };
        }

        // Check self collision
        if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          return { ...prev, gameOver: true };
        }

        newSnake.unshift(head);

        // Check food collision
        if (head.x === prev.food.x && head.y === prev.food.y) {
          const newScore = prev.score + 10;
          const newFood = {
            x: Math.floor(Math.random() * 20),
            y: Math.floor(Math.random() * 20),
          };
          return {
            ...prev,
            snake: newSnake,
            food: newFood,
            score: newScore,
          };
        } else {
          newSnake.pop();
        }

        return { ...prev, snake: newSnake };
      });
    }, 150);

    return () => clearInterval(gameLoop);
  }, [isRunning, gameState.gameOver]);

  useEffect(() => {
    if (gameState.gameOver) {
      onGameEnd(gameState.score);
    }
  }, [gameState.gameOver, gameState.score, onGameEnd]);

  const startGame = () => {
    setIsRunning(true);
    setGameState({
      snake: [{ x: 10, y: 10 }],
      food: { x: 15, y: 15 },
      direction: { x: 1, y: 0 },
      score: 0,
      gameOver: false,
    });
  };

  return (
    <div className="text-center">
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-cyan-400 font-mono mb-2">
          SNAKE GAME
        </h3>
        <p className="text-white mb-4">Score: {gameState.score}</p>
      </div>

      <div className="bg-black border-2 border-cyan-400 rounded-lg p-4 inline-block mb-4">
        <div className="grid grid-cols-20 gap-0 w-80 h-80">
          {Array.from({ length: 400 }, (_, i) => {
            const x = i % 20;
            const y = Math.floor(i / 20);
            const isSnake = gameState.snake.some(segment => segment.x === x && segment.y === y);
            const isFood = gameState.food.x === x && gameState.food.y === y;
            
            return (
              <div
                key={i}
                className={`w-4 h-4 ${
                  isSnake ? 'bg-cyan-400' : 
                  isFood ? 'bg-yellow-400' : 
                  'bg-gray-800'
                }`}
              />
            );
          })}
        </div>
      </div>

      {!isRunning && !gameState.gameOver && (
        <button
          onClick={startGame}
          className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 px-6 rounded"
        >
          START GAME
        </button>
      )}

      {gameState.gameOver && (
        <div className="text-center">
          <p className="text-red-400 text-xl font-mono mb-4">GAME OVER!</p>
          <p className="text-white mb-4">Final Score: {gameState.score}</p>
          <button
            onClick={startGame}
            className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 px-6 rounded"
          >
            PLAY AGAIN
          </button>
        </div>
      )}
    </div>
  );
};

const GameScreen: React.FC = () => {
  const { gameType } = useParams<{ gameType: string }>();
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const gameNames: Record<string, string> = {
    snake: 'Snake',
    pacman: 'Pac-Man',
    space_invaders: 'Space Invaders',
    tetris: 'Tetris',
    pong: 'Pong',
  };

  const gameIcons: Record<string, string> = {
    snake: '🐍',
    pacman: '🟡',
    space_invaders: '🚀',
    tetris: '🧩',
    pong: '⚪',
  };

  useEffect(() => {
    const startSession = async () => {
      if (!gameType) return;
      
      setIsLoading(true);
      try {
        const response = await gameAPI.startSession(gameType);
        setSessionId(response.data.session_id);
      } catch (error) {
        console.error('Failed to start game session:', error);
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    startSession();
  }, [gameType, navigate]);

  const handleGameEnd = async (score: number) => {
    if (!sessionId) return;

    try {
      await gameAPI.endSession(sessionId, score);
      // Could show a success message or redirect
    } catch (error) {
      console.error('Failed to end game session:', error);
    }
  };

  const renderGame = () => {
    switch (gameType) {
      case GameType.SNAKE:
        return <SnakeGame onGameEnd={handleGameEnd} />;
      case GameType.PACMAN:
        return (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-cyan-400 font-mono mb-4">
              PAC-MAN
            </h3>
            <p className="text-white">Coming soon...</p>
          </div>
        );
      case GameType.SPACE_INVADERS:
        return (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-cyan-400 font-mono mb-4">
              SPACE INVADERS
            </h3>
            <p className="text-white">Coming soon...</p>
          </div>
        );
      case GameType.TETRIS:
        return (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-cyan-400 font-mono mb-4">
              TETRIS
            </h3>
            <p className="text-white">Coming soon...</p>
          </div>
        );
      case GameType.PONG:
        return (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-cyan-400 font-mono mb-4">
              PONG
            </h3>
            <p className="text-white">Coming soon...</p>
          </div>
        );
      default:
        return (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-red-400 font-mono mb-4">
              GAME NOT FOUND
            </h3>
            <p className="text-white">This game is not available.</p>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">🖥️</div>
          <p className="text-cyan-400 font-mono text-xl">LOADING GAME...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black bg-opacity-50 backdrop-blur-sm border-b border-cyan-400">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">
                {gameIcons[gameType || ''] || '🎮'}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-cyan-400 font-mono">
                  {gameNames[gameType || ''] || 'UNKNOWN GAME'}
                </h1>
                <p className="text-gray-300 text-sm">
                  Session: {sessionId?.slice(-8) || 'Loading...'}
                </p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black font-bold rounded transition-colors"
              >
                DASHBOARD
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded transition-colors"
              >
                HOME
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Game Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="flex justify-center">
          <div className="bg-black bg-opacity-50 backdrop-blur-sm border border-gray-700 rounded-lg p-8">
            {renderGame()}
          </div>
        </div>

        {/* Game Instructions */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="bg-black bg-opacity-50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-bold text-cyan-400 font-mono mb-4">
              GAME INSTRUCTIONS
            </h3>
            {gameType === GameType.SNAKE && (
              <div className="text-gray-300 space-y-2">
                <p>• Use arrow keys to control the snake</p>
                <p>• Eat the yellow food to grow and score points</p>
                <p>• Avoid hitting walls or yourself</p>
                <p>• Each food gives you 10 points</p>
              </div>
            )}
            {gameType !== GameType.SNAKE && (
              <div className="text-gray-300">
                <p>Instructions for this game will be available soon.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default GameScreen;

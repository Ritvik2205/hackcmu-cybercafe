import React from 'react';
import { Link } from 'react-router-dom';
import { GameType } from '../types';

const Home: React.FC = () => {
  const games = [
    {
      type: GameType.SNAKE,
      name: 'Snake',
      description: 'Classic snake game - eat food and grow!',
      icon: '🐍',
      color: 'bg-green-500',
    },
    {
      type: GameType.PACMAN,
      name: 'Pac-Man',
      description: 'Navigate the maze and collect dots',
      icon: '🟡',
      color: 'bg-yellow-500',
    },
    {
      type: GameType.SPACE_INVADERS,
      name: 'Space Invaders',
      description: 'Defend Earth from alien invasion!',
      icon: '🚀',
      color: 'bg-blue-500',
    },
    {
      type: GameType.TETRIS,
      name: 'Tetris',
      description: 'Stack falling blocks to clear lines',
      icon: '🧩',
      color: 'bg-purple-500',
    },
    {
      type: GameType.PONG,
      name: 'Pong',
      description: 'Classic paddle and ball game',
      icon: '⚪',
      color: 'bg-gray-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black bg-opacity-50 backdrop-blur-sm border-b border-cyan-400">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">🖥️</div>
              <div>
                <h1 className="text-3xl font-bold text-cyan-400 font-mono">
                  CYBER CAFÉ SIM
                </h1>
                <p className="text-gray-300 text-sm">
                  Welcome to the 90s gaming experience
                </p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded transition-colors"
              >
                LOGIN
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black font-bold rounded transition-colors"
              >
                REGISTER
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4 font-mono">
            CHOOSE YOUR GAME
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Step back in time to the golden age of arcade gaming. 
            Experience the nostalgia of 90s cyber cafes with classic games.
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {games.map((game) => (
            <Link
              key={game.type}
              to={`/game/${game.type}`}
              className="group relative overflow-hidden rounded-lg bg-black bg-opacity-50 backdrop-blur-sm border border-gray-700 hover:border-cyan-400 transition-all duration-300 transform hover:scale-105"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`w-16 h-16 ${game.color} rounded-lg flex items-center justify-center text-3xl mr-4`}>
                    {game.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white font-mono">
                      {game.name}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Click to play
                    </p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">
                  {game.description}
                </p>
              </div>
              
              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              
              {/* Scanline effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-20 animate-pulse" />
              </div>
            </Link>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-20 text-center">
          <h3 className="text-3xl font-bold text-white mb-8 font-mono">
            FEATURES
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-black bg-opacity-50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
              <div className="text-4xl mb-4">🏆</div>
              <h4 className="text-xl font-bold text-cyan-400 mb-2 font-mono">
                LEADERBOARDS
              </h4>
              <p className="text-gray-300">
                Compete with other players and climb the ranks
              </p>
            </div>
            <div className="bg-black bg-opacity-50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
              <div className="text-4xl mb-4">💾</div>
              <h4 className="text-xl font-bold text-cyan-400 mb-2 font-mono">
                SAVE PROGRESS
              </h4>
              <p className="text-gray-300">
                Your game progress is automatically saved
              </p>
            </div>
            <div className="bg-black bg-opacity-50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
              <div className="text-4xl mb-4">🎮</div>
              <h4 className="text-xl font-bold text-cyan-400 mb-2 font-mono">
                CLASSIC GAMES
              </h4>
              <p className="text-gray-300">
                Authentic 90s arcade gaming experience
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black bg-opacity-50 backdrop-blur-sm border-t border-gray-700 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-400">
            <p className="font-mono">
              © 2024 Cyber Café Sim - Relive the 90s gaming experience
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

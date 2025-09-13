import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TetrisPage from '../components/TetrisPage';
import PacmanPage from '../components/PacmanPage';
import { useUserCredits } from '../contexts/UserCreditsContext';

interface GameModal {
  id: string;
  title: string;
  description: string;
  icon: string;
  component: React.ReactNode;
  cost: number; // Cost in credits to play
}

const RetroDesktop: React.FC = () => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [loadedCredits, setLoadedCredits] = useState(0); // Credits loaded on this computer
  const [showCreditModal, setShowCreditModal] = useState(false);
  const { credits: accountCredits, isLoading: creditsLoading, updateCredits } = useUserCredits();

  const games: GameModal[] = [
    {
      id: 'pacman',
      title: 'Pac-Man',
      description: 'Classic pac-man game - use arrow keys to control the pac-man',
      icon: '/pacman.webp',
      component: <PacmanPage  />,
      cost: 50
    },
    {
      id: 'tetris',
      title: 'Tetris',
      description: 'Classic tetris game - use arrow keys to move, space to drop, C to hold',
      icon: '/tetris.webp',
      component: <TetrisPage />,
      cost: 30
    },
    {
      id: 'Valorant',
      title: 'Valorant',
      description: 'use arrow keys and spacebar to shoot and move',
      icon: '/valorant.webp',
      component: <ValorantGame />,
      cost: 100
    },
    {
      id: 'CS2',
      title: 'CS2',
      description: 'use arrow keys and spacebar to shoot and move',
      icon: '/cs2.webp',
      component: <CS2Game />,
      cost: 100
    }
  ];

  const handleIconClick = (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    if (!game) return;

    // Check if user has enough loaded credits
    if (loadedCredits >= game.cost) {
      // Deduct credits and start game
      setLoadedCredits(prev => prev - game.cost);
      setActiveModal(gameId);
    } else {
      // Check if user has enough account credits to load
      if (accountCredits >= game.cost) {
        // Show credit loading modal
        setShowCreditModal(true);
      } else {
        // Not enough credits in account, go to cashier
        if (confirm(`Insufficient credits! You need ${game.cost} credits but only have ${accountCredits} in your account.\n\nWould you like to go to the cashier to buy more credits?`)) {
          navigate('/cybercafe');
        }
      }
    }
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleLoadCredits = (amount: number) => {
    if (accountCredits >= amount) {
      updateCredits(accountCredits - amount);
      setLoadedCredits(prev => prev + amount);
      setShowCreditModal(false);
    } else {
      alert(`Insufficient account credits! You only have ${accountCredits} credits.`);
    }
  };

  const handleGoToCashier = () => {
    navigate('/cybercafe');
  };

  const handleBackToCafe = () => {
    navigate('/cybercafe');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Main Desktop Background Image - Full Screen */}
      <img 
        src="/desktop.webp" 
        alt="Desktop Background"
        className="absolute inset-0 w-full h-full object-contain left-[50%] top-[55%] transform -translate-x-1/2 -translate-y-1/2"
        onError={(e) => {
          console.log('Image failed to load:', e);
          e.currentTarget.style.display = 'none';
        }}
        onLoad={() => {
          console.log('Desktop image loaded successfully');
        }}
      />

      {/* Desktop Content Overlay */}
      <div className="absolute z-20 p-8 h-max flex flex-col w-[30%] left-[40%] top-[35%] transform -translate-x-1/2 -translate-y-1/2">
        {/* Desktop Icons */}
        <div className="grid grid-cols-2 gap-[3rem] mb-2">
          {games.map((game) => (
              <div
                key={game.id}
                onClick={() => handleIconClick(game.id)}
                className="flex flex-col items-center cursor-pointer hover:bg-green-400 hover:bg-opacity-20 p-4 rounded transition-all duration-200 backdrop-blur-sm bg-black bg-opacity-30"
              >
                  <img
                    src={game.icon}
                    alt={game.title}
                    className="w-[7rem] h-[7rem] mb-2 object-contain"
                    onError={(e) => {
                      console.log(`Failed to load icon for ${game.title}:`, game.icon);
                      e.currentTarget.style.display = 'none';
                    }}
                    onLoad={() => {
                      console.log(`Successfully loaded icon for ${game.title}:`, game.icon);
                    }}
                  />
                  <div className="text-black font-mono text-lg text-center px-4 py-2 rounded" style={{color: 'black'}}>
                    {game.title}
                  </div>
                  <div className="text-yellow-600 font-mono text-sm text-center font-bold">
                    {game.cost} Credits
                  </div>
              </div>
          ))}
        </div>
      </div>

      {/* Game Modals */}
      {activeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-gray-900 border-2 border-green-400 rounded-lg p-4 w-[95vw] h-[90vh] relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-green-400 hover:text-white text-2xl font-bold z-10 bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>
            
            <div className="text-green-400 font-mono text-center mb-2 text-lg">
              {games.find(g => g.id === activeModal)?.title}
            </div>
            
            <div className="bg-black border border-green-400 rounded p-2 h-[calc(100%-4rem)] overflow-hidden">
              {games.find(g => g.id === activeModal)?.component}
            </div>
            
            <div className="text-green-400 text-xs font-mono mt-1 text-center">
              {games.find(g => g.id === activeModal)?.description}
            </div>
          </div>
        </div>
      )}

      {/* Back to Cafe Button */}
      <button
        onClick={handleBackToCafe}
        className="fixed top-1 left-1 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded font-mono text-sm transition-colors"
      >
        ← Back to Cyber Café
      </button>

          {/* User Profile Section - Top Right */}
          <div className="fixed top-[0%] right-[0%] min-w-[300px] flex items-center gap-4 bg-black bg-opacity-70 backdrop-blur-sm rounded-lg p-4 border border-green-400">
            {/* Account Credits */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-lg">🪙</span>
              </div>
              <div className="text-green-400 font-mono">
                <div className="text-xs">ACCOUNT</div>
                <div className="text-lg font-bold">{creditsLoading ? '...' : accountCredits.toLocaleString()}</div>
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-green-400 opacity-50"></div>

            {/* Loaded Credits */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-lg">💻</span>
              </div>
              <div className="text-cyan-400 font-mono">
                <div className="text-xs">LOADED</div>
                <div className="text-lg font-bold">{loadedCredits.toLocaleString()}</div>
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-green-400 opacity-50"></div>

            {/* Load Credits Button */}
            <button
              onClick={() => setShowCreditModal(true)}
              className="bg-black hover:bg-gray-800 text-white px-3 py-1 rounded text-xs font-mono transition-colors"
            >
              LOAD
            </button>
          </div>

          {/* Credit Loading Modal */}
          {showCreditModal && (
            <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
              <div className="bg-gray-900 border-2 border-green-400 rounded-lg p-6 w-96 relative">
                <button
                  onClick={() => setShowCreditModal(false)}
                  className="absolute top-2 right-2 text-green-400 hover:text-white text-2xl font-bold z-10 bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center"
                >
                  ✕
                </button>

                <div className="text-black font-mono text-center mb-4 text-xl">
                  LOAD CREDITS
                </div>

                <div className="text-white font-mono text-center mb-4">
                  <div className="mb-2">
                    Account Credits: {creditsLoading ? 'Loading...' : accountCredits.toLocaleString()}
                  </div>
                  <div className="mb-4">Loaded Credits: {loadedCredits.toLocaleString()}</div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => handleLoadCredits(100)}
                    disabled={creditsLoading || accountCredits < 100}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded font-mono transition-colors"
                  >
                    Load 100 Credits
                  </button>
                  
                  <button
                    onClick={() => handleLoadCredits(250)}
                    disabled={creditsLoading || accountCredits < 250}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded font-mono transition-colors"
                  >
                    Load 250 Credits
                  </button>
                  
                  <button
                    onClick={() => handleLoadCredits(500)}
                    disabled={creditsLoading || accountCredits < 500}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded font-mono transition-colors"
                  >
                    Load 500 Credits
                  </button>
                  
                  <button
                    onClick={() => handleLoadCredits(accountCredits)}
                    disabled={creditsLoading || accountCredits <= 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded font-mono transition-colors"
                  >
                    Load All ({creditsLoading ? '...' : accountCredits.toLocaleString()})
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-green-400">
                  <button
                    onClick={handleGoToCashier}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded font-mono transition-colors"
                  >
                    Go to Cashier (Buy More Credits)
                  </button>
                </div>

                <div className="text-green-400 text-xs font-mono mt-2 text-center">
                  Transfer credits from your account to this computer
                </div>
              </div>
            </div>
          )}
    </div>
  );
};


const ValorantGame: React.FC = () => {
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-green-400">
      <div className="text-2xl mb-4 font-mono">🔴 VALORANT</div>
      <div className="text-sm mb-4 text-center">
        <p>Use arrow keys to move</p>
        <p>Press spacebar to shoot</p>
        <p>Score: {score}</p>
      </div>
      
      {!gameStarted ? (
        <button
          onClick={() => setGameStarted(true)}
          className="bg-green-400 text-black px-6 py-2 rounded font-mono font-bold hover:bg-green-300 transition-colors"
        >
          START GAME
        </button>
      ) : (
        <div className="w-full h-full bg-black border border-green-400 rounded p-4 flex flex-col">
          <div className="text-center mb-2">
            <span className="font-mono">Score: {score}</span>
            <button
              onClick={() => {
                setGameStarted(false);
                setScore(0);
              }}
              className="ml-4 text-xs bg-red-600 text-white px-2 py-1 rounded"
            >
              RESET
            </button>
          </div>
          <div className="flex-1 bg-gray-800 rounded border border-green-400 relative overflow-hidden">
            {/* Player */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="w-6 h-6 bg-blue-500 border border-blue-400"></div>
            </div>
            {/* Enemies */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-4 h-4 bg-red-500 border border-red-400"
                style={{
                  top: `${Math.random() * 60 + 10}%`,
                  left: `${Math.random() * 80 + 10}%`
                }}
              ></div>
            ))}
            {/* Bullets */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-1 h-2 bg-yellow-400"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CS2Game: React.FC = () => {
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-green-400">
      <div className="text-2xl mb-4 font-mono">🔵 CS2</div>
      <div className="text-sm mb-4 text-center">
        <p>Use arrow keys to move</p>
        <p>Press spacebar to shoot</p>
        <p>Score: {score}</p>
      </div>
      
      {!gameStarted ? (
        <button
          onClick={() => setGameStarted(true)}
          className="bg-green-400 text-black px-6 py-2 rounded font-mono font-bold hover:bg-green-300 transition-colors"
        >
          START GAME
        </button>
      ) : (
        <div className="w-full h-full bg-black border border-green-400 rounded p-4 flex flex-col">
          <div className="text-center mb-2">
            <span className="font-mono">Score: {score}</span>
            <button
              onClick={() => {
                setGameStarted(false);
                setScore(0);
              }}
              className="ml-4 text-xs bg-red-600 text-white px-2 py-1 rounded"
            >
              RESET
            </button>
          </div>
          <div className="flex-1 bg-gray-800 rounded border border-green-400 relative overflow-hidden">
            {/* Player */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="w-6 h-6 bg-blue-500 border border-blue-400"></div>
            </div>
            {/* Enemies */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-4 h-4 bg-orange-500 border border-orange-400"
                style={{
                  top: `${Math.random() * 60 + 10}%`,
                  left: `${Math.random() * 80 + 10}%`
                }}
              ></div>
            ))}
            {/* Crosshair */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border border-white opacity-50"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetroDesktop;

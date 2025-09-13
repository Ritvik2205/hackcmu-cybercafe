import React, { useState } from 'react';

interface ComputerDesktopProps {
  id: number;
  isOccupied: boolean;
  currentUser?: string;
  gameRunning?: string;
  onLogin: (desktopId: number) => void;
  onLogout: (desktopId: number) => void;
}

const ComputerDesktop: React.FC<ComputerDesktopProps> = ({
  id,
  isOccupied,
  currentUser,
  gameRunning,
  onLogin,
  onLogout
}) => {
  const [screenOn, setScreenOn] = useState(!isOccupied);

  return (
    <div className="relative bg-gradient-to-b from-gray-900 to-black rounded-lg p-4 border-2 border-cyan-400 shadow-lg">
      {/* Monitor */}
      <div className="relative">
        {/* Screen */}
        <div className={`w-full h-32 bg-black rounded border-2 ${screenOn ? 'border-green-400' : 'border-gray-600'} mb-3`}>
          {screenOn ? (
            <div className="p-2 h-full overflow-hidden">
              {isOccupied ? (
                <div className="text-green-400 font-mono text-xs">
                  <div className="mb-1">USER: {currentUser}</div>
                  {gameRunning && (
                    <div className="text-yellow-400">GAME: {gameRunning}</div>
                  )}
                  <div className="text-cyan-400 mt-1">
                    {'>'} ONLINE
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 font-mono text-xs flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-pulse">●</div>
                    <div>READY</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-600">
              <div className="text-center">
                <div className="text-2xl mb-1">🖥️</div>
                <div className="text-xs">OFFLINE</div>
              </div>
            </div>
          )}
        </div>
        
        {/* Screen Controls */}
        <div className="flex justify-between items-center mb-3">
          <button
            onClick={() => setScreenOn(!screenOn)}
            className={`px-2 py-1 text-xs font-mono rounded ${
              screenOn 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-600 text-gray-300'
            }`}
          >
            {screenOn ? 'ON' : 'OFF'}
          </button>
          <div className="text-cyan-400 text-xs font-mono">
            PC-{id.toString().padStart(2, '0')}
          </div>
        </div>
      </div>
      
      {/* Keyboard */}
      <div className="bg-gray-800 rounded p-2 mb-3">
        <div className="text-gray-400 text-xs font-mono text-center">
          [KEYBOARD]
        </div>
      </div>
      
      {/* Mouse */}
      <div className="bg-gray-700 rounded p-1 w-16 mx-auto mb-3">
        <div className="text-gray-500 text-xs font-mono text-center">
          [MOUSE]
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex space-x-2">
        {isOccupied ? (
          <button
            onClick={() => onLogout(id)}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-1 rounded transition-colors"
          >
            LOGOUT
          </button>
        ) : (
          <button
            onClick={() => onLogin(id)}
            className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-black text-xs font-bold py-1 rounded transition-colors"
          >
            LOGIN
          </button>
        )}
      </div>
      
      {/* Status Indicators */}
      <div className="absolute top-2 right-2 flex space-x-1">
        <div className={`w-2 h-2 rounded-full ${isOccupied ? 'bg-red-400' : 'bg-gray-500'}`}></div>
        <div className={`w-2 h-2 rounded-full ${screenOn ? 'bg-green-400' : 'bg-gray-500'}`}></div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute bottom-2 left-2 text-cyan-400 text-xs font-mono">
        {isOccupied ? '●' : '○'}
      </div>
    </div>
  );
};

export default ComputerDesktop;

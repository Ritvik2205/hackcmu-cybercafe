import React, { useState, useEffect } from 'react';
import CashierDesk from './CashierDesk';
import ComputerDesktop from './ComputerDesktop';
import Cashier from './Cashier';

interface ComputerState {
  id: number;
  isOccupied: boolean;
  currentUser?: string;
  gameRunning?: string;
  sessionStart?: Date;
}

const CyberCafeMainScreen: React.FC = () => {
  const [computers, setComputers] = useState<ComputerState[]>([
    { id: 1, isOccupied: false },
    { id: 2, isOccupied: true, currentUser: 'gamer_123', gameRunning: 'Snake' },
    { id: 3, isOccupied: false },
    { id: 4, isOccupied: true, currentUser: 'retro_player', gameRunning: 'Pac-Man' },
    { id: 5, isOccupied: false },
    { id: 6, isOccupied: true, currentUser: 'cyber_ninja', gameRunning: 'Space Invaders' },
    { id: 7, isOccupied: false },
    { id: 8, isOccupied: false },
  ]);

  const [cashierName] = useState('Alex Chen');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleDesktopLogin = (desktopId: number) => {
    setComputers(prev => prev.map(comp => 
      comp.id === desktopId 
        ? { 
            ...comp, 
            isOccupied: true, 
            currentUser: `user_${desktopId}`,
            sessionStart: new Date()
          }
        : comp
    ));
  };

  const handleDesktopLogout = (desktopId: number) => {
    setComputers(prev => prev.map(comp => 
      comp.id === desktopId 
        ? { 
            ...comp, 
            isOccupied: false, 
            currentUser: undefined,
            gameRunning: undefined,
            sessionStart: undefined
          }
        : comp
    ));
  };

  const handleCustomerService = () => {
    // Handle customer service actions
    console.log('Customer service requested');
  };

  const handleCashierAction = (action: string) => {
    console.log(`Cashier action: ${action}`);
    // Handle cashier interactions
  };

  const occupiedComputers = computers.filter(comp => comp.isOccupied).length;
  const availableComputers = computers.length - occupiedComputers;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="bg-black bg-opacity-50 backdrop-blur-sm border border-cyan-400 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">🖥️</div>
              <div>
                <h1 className="text-3xl font-bold text-cyan-400 font-mono">
                  CYBER CAFÉ SIMULATION
                </h1>
                <p className="text-gray-300 text-sm">
                  Main Control Center - {currentTime.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-green-400 font-mono text-lg">
                {occupiedComputers}/{computers.length} OCCUPIED
              </div>
              <div className="text-cyan-400 font-mono text-sm">
                {availableComputers} AVAILABLE
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Cashier Section */}
        <div className="lg:col-span-1 space-y-6">
          <Cashier
            name={cashierName}
            onCustomerInteraction={handleCashierAction}
          />
          <CashierDesk onCustomerService={handleCustomerService} />
        </div>

        {/* Computer Desktops Grid */}
        <div className="lg:col-span-3">
          <div className="bg-black bg-opacity-50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 mb-4">
            <h2 className="text-2xl font-bold text-cyan-400 font-mono mb-4">
              COMPUTER STATIONS
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {computers.map(computer => (
                <ComputerDesktop
                  key={computer.id}
                  id={computer.id}
                  isOccupied={computer.isOccupied}
                  currentUser={computer.currentUser}
                  gameRunning={computer.gameRunning}
                  onLogin={handleDesktopLogin}
                  onLogout={handleDesktopLogout}
                />
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black bg-opacity-50 backdrop-blur-sm border border-green-400 rounded-lg p-4">
              <h3 className="text-green-400 font-mono text-lg mb-2">
                SYSTEM STATUS
              </h3>
              <div className="text-white text-sm space-y-1">
                <div>Network: <span className="text-green-400">ONLINE</span></div>
                <div>Power: <span className="text-green-400">STABLE</span></div>
                <div>Temperature: <span className="text-yellow-400">NORMAL</span></div>
              </div>
            </div>

            <div className="bg-black bg-opacity-50 backdrop-blur-sm border border-blue-400 rounded-lg p-4">
              <h3 className="text-blue-400 font-mono text-lg mb-2">
                CAFÉ STATS
              </h3>
              <div className="text-white text-sm space-y-1">
                <div>Total Sessions: 1,247</div>
                <div>Active Users: {occupiedComputers}</div>
                <div>Revenue Today: $342.50</div>
              </div>
            </div>

            <div className="bg-black bg-opacity-50 backdrop-blur-sm border border-purple-400 rounded-lg p-4">
              <h3 className="text-purple-400 font-mono text-lg mb-2">
                POPULAR GAMES
              </h3>
              <div className="text-white text-sm space-y-1">
                <div>1. Snake - 45 sessions</div>
                <div>2. Pac-Man - 32 sessions</div>
                <div>3. Space Invaders - 28 sessions</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 bg-black bg-opacity-50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between text-gray-400 font-mono text-sm">
          <div>
            Cyber Café Simulation v1.0 | All systems operational
          </div>
          <div>
            Last updated: {currentTime.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CyberCafeMainScreen;

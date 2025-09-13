import React from 'react';

interface CashierDeskProps {
  onCustomerService: () => void;
}

const CashierDesk: React.FC<CashierDeskProps> = ({ onCustomerService }) => {
  return (
    <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg p-6 border-2 border-amber-400 shadow-lg">
      {/* Desk Surface */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-600 to-amber-800 rounded-lg opacity-20"></div>
      
      {/* Cashier Station */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-amber-400 font-mono">
            CASHIER STATION
          </h2>
          <div className="text-amber-300 text-sm font-mono">
            [FUNCTIONAL]
          </div>
        </div>
        
        {/* Register Display */}
        <div className="bg-black border border-amber-400 rounded p-3 mb-4">
          <div className="text-green-400 font-mono text-sm mb-2">
            CYBER CAFÉ REGISTER
          </div>
          <div className="text-white font-mono">
            Session: ACTIVE<br/>
            Time: {new Date().toLocaleTimeString()}<br/>
            Status: OPEN
          </div>
        </div>
        
        {/* Control Panel */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onCustomerService}
            className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-2 px-4 rounded transition-colors"
          >
            CUSTOMER SERVICE
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors">
            SYSTEM STATUS
          </button>
        </div>
        
        {/* Payment Terminal */}
        <div className="mt-4 bg-gray-800 border border-gray-600 rounded p-3">
          <div className="text-gray-300 text-sm font-mono mb-2">
            PAYMENT TERMINAL
          </div>
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-2 right-2 text-amber-400 text-xs font-mono">
        ●●●
      </div>
      <div className="absolute bottom-2 left-2 text-amber-400 text-xs font-mono">
        [CAFÉ_001]
      </div>
    </div>
  );
};

export default CashierDesk;

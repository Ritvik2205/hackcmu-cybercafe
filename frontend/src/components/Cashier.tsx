import React, { useState } from 'react';

interface CashierProps {
  name: string;
  onCustomerInteraction: (action: string) => void;
}

const Cashier: React.FC<CashierProps> = ({ name, onCustomerInteraction }) => {
  const [isActive, setIsActive] = useState(true);

  const handleAction = (action: string) => {
    onCustomerInteraction(action);
    // Add some animation or feedback here
  };

  return (
    <div className="relative bg-gradient-to-b from-blue-900 to-indigo-900 rounded-lg p-6 border-2 border-blue-400 shadow-lg">
      {/* Cashier Avatar/Representation */}
      <div className="flex items-center mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-4">
          <span className="text-2xl">👤</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-blue-400 font-mono">
            {name}
          </h3>
          <div className="text-blue-300 text-sm font-mono">
            CASHIER
          </div>
          <div className={`text-xs font-mono ${isActive ? 'text-green-400' : 'text-red-400'}`}>
            {isActive ? '[ON DUTY]' : '[OFF DUTY]'}
          </div>
        </div>
      </div>
      
      {/* Status Panel */}
      <div className="bg-black bg-opacity-50 border border-blue-400 rounded p-3 mb-4">
        <div className="text-blue-400 font-mono text-sm mb-2">
          CASHIER STATUS
        </div>
        <div className="text-white text-sm font-mono space-y-1">
          <div>Position: Front Desk</div>
          <div>Shift: Day Shift</div>
          <div>Customers Served: 42</div>
          <div>Current Queue: 3</div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          onClick={() => handleAction('checkin')}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 text-sm rounded transition-colors"
        >
          CHECK IN
        </button>
        <button
          onClick={() => handleAction('checkout')}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 text-sm rounded transition-colors"
        >
          CHECK OUT
        </button>
        <button
          onClick={() => handleAction('payment')}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-3 text-sm rounded transition-colors"
        >
          PAYMENT
        </button>
        <button
          onClick={() => handleAction('help')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 text-sm rounded transition-colors"
        >
          HELP
        </button>
      </div>
      
      {/* Activity Log */}
      <div className="bg-black bg-opacity-30 border border-gray-600 rounded p-3">
        <div className="text-gray-400 font-mono text-xs mb-2">
          RECENT ACTIVITY
        </div>
        <div className="text-gray-300 text-xs font-mono space-y-1 max-h-20 overflow-y-auto">
          <div>• Customer login - PC-05</div>
          <div>• Payment received - $15.00</div>
          <div>• Session started - Snake</div>
          <div>• Customer logout - PC-03</div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-2 right-2 text-blue-400 text-xs font-mono">
        [ID: {name.toUpperCase().slice(0, 3)}001]
      </div>
      <div className="absolute bottom-2 left-2 text-blue-400 text-xs font-mono">
        {isActive ? '●' : '○'} ACTIVE
      </div>
    </div>
  );
};

export default Cashier;

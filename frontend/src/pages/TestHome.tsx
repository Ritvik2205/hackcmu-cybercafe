import React from 'react';

const TestHome: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-cyan-400 font-mono mb-4">
          CYBER CAFÉ SIMULATION
        </h1>
        <p className="text-white text-xl">
          React is working! 🎉
        </p>
        <p className="text-gray-300 mt-4">
          If you can see this, the basic setup is working.
        </p>
      </div>
    </div>
  );
};

export default TestHome;

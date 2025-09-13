import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SimpleCyberCafe3D from './components/3D/SimpleCyberCafe';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import GameScreen from './pages/GameScreen';
import './App.css';
import { CyberCafe3D } from './components/3D';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<CyberCafe3D />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/game/:gameType" element={<GameScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
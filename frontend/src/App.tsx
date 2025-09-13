import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import GameScreen from './pages/GameScreen';
import RetroDesktop from './pages/RetroDesktop';
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
          <Route path="/desktop" element={<RetroDesktop />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import GameScreen from './pages/GameScreen';
import RetroDesktop from './pages/RetroDesktop';
import Payment from './pages/Payment';
import Leaderboard from './pages/Leaderboard';
import './App.css';
import { CyberCafe3D } from './components/3D';
import WelcomeScreen from './components/WelcomeScreen';
import { ClerkProvider } from '@clerk/clerk-react';
import { UserCreditsProvider } from './contexts/UserCreditsContext';

function App() {
  return (
    <Router>
      <ClerkProvider
      publishableKey="pk_test_c2F2ZWQtaWd1YW5hLTkuY2xlcmsuYWNjb3VudHMuZGV2JA"
      appearance={{
        variables: { colorPrimary: "#000000" },
        elements: {
          formButtonPrimary:
            "bg-black border border-black border-solid hover:bg-white hover:text-black",
          socialButtonsBlockButton:
            "bg-white border-gray-200 hover:bg-transparent hover:border-black text-gray-600 hover:text-black",
          socialButtonsBlockButtonText: "font-semibold",
          formButtonReset:
            "bg-white border border-solid border-gray-200 hover:bg-transparent hover:border-black text-gray-500 hover:text-black",
          membersPageInviteButton:
            "bg-black border border-black border-solid hover:bg-white hover:text-black",
          card: "bg-[#fafafa]",
        },
      }}
    >
      <UserCreditsProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<WelcomeScreen />} />
            <Route path="/cybercafe" element={<CyberCafe3D />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/payment" element={<Payment/>} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/game/:gameType" element={<GameScreen />} />
            <Route path="/desktop" element={<RetroDesktop />} />
          </Routes>
        </div>
      </UserCreditsProvider>
      </ClerkProvider>
    </Router>
  );
}

export default App;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  game: string;
  date: string;
}

const Leaderboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState<string>('all');

  // Mock leaderboard data
  const leaderboardData: LeaderboardEntry[] = [
    { rank: 1, username: 'CyberNinja_99', score: 158420, game: 'Tetris', date: '2024-01-15' },
    { rank: 2, username: 'RetroGamer_X', score: 145680, game: 'Tetris', date: '2024-01-14' },
    { rank: 3, username: 'PixelMaster', score: 142350, game: 'Tetris', date: '2024-01-13' },
    { rank: 4, username: 'GameLord_2000', score: 138920, game: 'Tetris', date: '2024-01-12' },
    { rank: 5, username: 'ArcadeKing', score: 135640, game: 'Tetris', date: '2024-01-11' },
    
    { rank: 1, username: 'PacMan_Pro', score: 98750, game: 'Pac-Man', date: '2024-01-15' },
    { rank: 2, username: 'GhostHunter', score: 92340, game: 'Pac-Man', date: '2024-01-14' },
    { rank: 3, username: 'MazeRunner', score: 89760, game: 'Pac-Man', date: '2024-01-13' },
    { rank: 4, username: 'DotCollector', score: 86540, game: 'Pac-Man', date: '2024-01-12' },
    { rank: 5, username: 'PowerPellet', score: 82340, game: 'Pac-Man', date: '2024-01-11' },
    
    { rank: 1, username: 'Valorant_Elite', score: 45680, game: 'Valorant', date: '2024-01-15' },
    { rank: 2, username: 'ShooterPro', score: 42350, game: 'Valorant', date: '2024-01-14' },
    { rank: 3, username: 'FPS_Master', score: 40120, game: 'Valorant', date: '2024-01-13' },
    { rank: 4, username: 'HeadshotKing', score: 38790, game: 'Valorant', date: '2024-01-12' },
    { rank: 5, username: 'SniperElite', score: 36540, game: 'Valorant', date: '2024-01-11' },
    
    { rank: 1, username: 'CS2_Champion', score: 78920, game: 'CS2', date: '2024-01-15' },
    { rank: 2, username: 'CounterStrike', score: 74560, game: 'CS2', date: '2024-01-14' },
    { rank: 3, username: 'TerroristHunter', score: 71230, game: 'CS2', date: '2024-01-13' },
    { rank: 4, username: 'BombDefuser', score: 68940, game: 'CS2', date: '2024-01-12' },
    { rank: 5, username: 'CT_Elite', score: 65670, game: 'CS2', date: '2024-01-11' },
  ];

  const filteredData = selectedGame === 'all' 
    ? leaderboardData 
    : leaderboardData.filter(entry => entry.game === selectedGame);

  const handleBackToCafe = () => {
    navigate('/cybercafe');
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return '#FFD700'; // Gold
      case 2: return '#C0C0C0'; // Silver
      case 3: return '#CD7F32'; // Bronze
      default: return '#00ff00'; // Green
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000000',
      backgroundImage: 'url("/desktop.webp")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'monospace',
      padding: '20px',
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#000000',
        border: '4px solid #00ff00',
        padding: '20px 40px',
        marginBottom: '30px',
        textAlign: 'center',
        boxShadow: '0 0 20px #00ff00',
      }}>
        <div style={{
          color: '#00ff00',
          fontSize: '28px',
          textTransform: 'uppercase',
          letterSpacing: '3px',
          fontWeight: 'bold',
          marginBottom: '10px',
        }}>
          🏆 LEADERBOARD 🏆
        </div>
        <div style={{
          color: '#ffff00',
          fontSize: '16px',
        }}>
          Top Players Across All Games
        </div>
      </div>

      {/* Game Filter */}
      <div style={{
        backgroundColor: '#000000',
        border: '2px solid #00ff00',
        padding: '15px',
        marginBottom: '20px',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
      }}>
        <div style={{ color: '#00ff00', fontSize: '14px', marginRight: '10px' }}>
          FILTER BY GAME:
        </div>
        {['all', 'Tetris', 'Pac-Man', 'Valorant', 'CS2'].map((game) => (
          <button
            key={game}
            onClick={() => setSelectedGame(game)}
            style={{
              backgroundColor: selectedGame === game ? '#00ff00' : '#000000',
              color: selectedGame === game ? '#000000' : '#00ff00',
              border: '2px solid #00ff00',
              padding: '8px 16px',
              fontSize: '12px',
              fontFamily: 'monospace',
              cursor: 'pointer',
              textTransform: 'uppercase',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              if (selectedGame !== game) {
                e.currentTarget.style.backgroundColor = '#001100';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedGame !== game) {
                e.currentTarget.style.backgroundColor = '#000000';
              }
            }}
          >
            {game}
          </button>
        ))}
      </div>

      {/* Leaderboard Table */}
      <div style={{
        backgroundColor: '#000000',
        border: '4px solid #00ff00',
        padding: '20px',
        maxWidth: '800px',
        width: '100%',
        boxShadow: '0 0 20px #00ff00',
        maxHeight: '60vh',
        overflowY: 'auto',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '80px 1fr 150px 120px 120px',
          gap: '10px',
          padding: '10px 0',
          borderBottom: '2px solid #00ff00',
          color: '#ffff00',
          fontSize: '14px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
        }}>
          <div>RANK</div>
          <div>PLAYER</div>
          <div>SCORE</div>
          <div>GAME</div>
          <div>DATE</div>
        </div>

        {filteredData.map((entry) => (
          <div
            key={`${entry.game}-${entry.rank}`}
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr 150px 120px 120px',
              gap: '10px',
              padding: '15px 0',
              borderBottom: '1px solid #004400',
              color: getRankColor(entry.rank),
              fontSize: '14px',
              alignItems: 'center',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#001100';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
              {getRankIcon(entry.rank)}
            </div>
            <div style={{ fontWeight: 'bold' }}>
              {entry.username}
            </div>
            <div style={{ color: '#ffff00' }}>
              {entry.score.toLocaleString()}
            </div>
            <div style={{ color: '#00ffff' }}>
              {entry.game}
            </div>
            <div style={{ color: '#ff8800' }}>
              {entry.date}
            </div>
          </div>
        ))}
      </div>

      {/* Back Button */}
      <button
        onClick={handleBackToCafe}
        style={{
          backgroundColor: '#000000',
          color: '#ff0000',
          border: '2px solid #ff0000',
          padding: '15px 30px',
          fontSize: '16px',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          cursor: 'pointer',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginTop: '30px',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#ff0000';
          e.currentTarget.style.color = '#000000';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#000000';
          e.currentTarget.style.color = '#ff0000';
        }}
      >
        ← Back to Cyber Café
      </button>
    </div>
  );
};

export default Leaderboard;

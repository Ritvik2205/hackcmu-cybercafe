import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, gameAPI } from '../services/api';
import type { User, GameSession, Leaderboard } from '../types';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [gameSessions, setGameSessions] = useState<GameSession[]>([]);
  const [leaderboards, setLeaderboards] = useState<Record<string, Leaderboard>>({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [userResponse, sessionsResponse] = await Promise.all([
          authAPI.getCurrentUser(),
          gameAPI.getUserSessions(),
        ]);
        
        setUser(userResponse.data);
        setGameSessions(sessionsResponse.data.sessions || []);

        // Load leaderboards for different games
        const gameTypes = ['snake', 'pacman', 'space_invaders', 'tetris', 'pong'];
        const leaderboardPromises = gameTypes.map(gameType => 
          gameAPI.getLeaderboard(gameType, 5)
        );
        
        const leaderboardResponses = await Promise.all(leaderboardPromises);
        const leaderboardData: Record<string, Leaderboard> = {};
        
        gameTypes.forEach((gameType, index) => {
          leaderboardData[gameType] = leaderboardResponses[index].data;
        });
        
        setLeaderboards(leaderboardData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    authAPI.logout();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">🖥️</div>
          <p className="text-cyan-400 font-mono text-xl">LOADING DASHBOARD...</p>
        </div>
      </div>
    );
  }

  const gameNames: Record<string, string> = {
    snake: 'Snake',
    pacman: 'Pac-Man',
    space_invaders: 'Space Invaders',
    tetris: 'Tetris',
    pong: 'Pong',
  };

  const gameIcons: Record<string, string> = {
    snake: '🐍',
    pacman: '🟡',
    space_invaders: '🚀',
    tetris: '🧩',
    pong: '⚪',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black bg-opacity-50 backdrop-blur-sm border-b border-cyan-400">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">🖥️</div>
              <div>
                <h1 className="text-3xl font-bold text-cyan-400 font-mono">
                  CYBER CAFÉ DASHBOARD
                </h1>
                <p className="text-gray-300 text-sm">
                  Welcome back, {user?.username}!
                </p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/"
                className="px-4 py-2 border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black font-bold rounded transition-colors"
              >
                GAMES
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded transition-colors"
              >
                LOGOUT
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Stats */}
          <div className="lg:col-span-1">
            <div className="bg-black bg-opacity-50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-cyan-400 font-mono mb-4">
                PLAYER STATS
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">Username</p>
                  <p className="text-white font-mono">{user?.username}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white">{user?.email}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Sessions</p>
                  <p className="text-white font-mono text-2xl">{gameSessions.length}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Best Score</p>
                  <p className="text-white font-mono text-2xl">
                    {Math.max(...gameSessions.map(s => s.score || 0), 0)}
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Sessions */}
            <div className="bg-black bg-opacity-50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-cyan-400 font-mono mb-4">
                RECENT SESSIONS
              </h2>
              {gameSessions.length > 0 ? (
                <div className="space-y-3">
                  {gameSessions.slice(0, 5).map((session) => (
                    <div key={session.id} className="bg-gray-800 rounded p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">
                            {gameIcons[session.game_type] || '🎮'}
                          </span>
                          <span className="text-white font-mono text-sm">
                            {gameNames[session.game_type] || session.game_type}
                          </span>
                        </div>
                        <span className="text-cyan-400 font-mono">
                          {session.score || 0}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No games played yet</p>
              )}
            </div>
          </div>

          {/* Games and Leaderboards */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(gameNames).map(([gameType, gameName]) => (
                <div key={gameType} className="bg-black bg-opacity-50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <span className="text-4xl mr-3">
                      {gameIcons[gameType]}
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-white font-mono">
                        {gameName}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Top Players
                      </p>
                    </div>
                  </div>
                  
                  <Link
                    to={`/game/${gameType}`}
                    className="block w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 px-4 rounded mb-4 text-center transition-colors"
                  >
                    PLAY NOW
                  </Link>

                  <div className="space-y-2">
                    {leaderboards[gameType]?.leaderboard?.slice(0, 3).map((entry, index) => (
                      <div key={entry.id} className="flex items-center justify-between bg-gray-800 rounded p-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-yellow-400 font-mono text-sm">
                            #{index + 1}
                          </span>
                          <span className="text-white text-sm">
                            Player {entry.user_id}
                          </span>
                        </div>
                        <span className="text-cyan-400 font-mono text-sm">
                          {entry.score}
                        </span>
                      </div>
                    )) || (
                      <p className="text-gray-400 text-sm">No scores yet</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

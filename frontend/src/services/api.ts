import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: async (username: string, password: string) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await api.post('/users/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }
    
    return response.data;
  },

  register: async (userData: {
    username: string;
    email: string;
    password: string;
    full_name?: string;
  }) => {
    return api.post('/users/register', userData);
  },

  getCurrentUser: async () => {
    return api.get('/users/me');
  },

  logout: () => {
    localStorage.removeItem('access_token');
  },
};

// Game API calls
export const gameAPI = {
  startSession: async (gameType: string) => {
    return api.post('/game/session/start', null, {
      params: { game_type: gameType }
    });
  },

  endSession: async (sessionId: string, score: number) => {
    return api.post(`/game/session/${sessionId}/end`, null, {
      params: { score }
    });
  },

  saveGameState: async (sessionId: string, gameData: any) => {
    const gameState = {
      session_id: sessionId,
      game_data: gameData,
      timestamp: new Date().toISOString(),
    };
    return api.post(`/game/session/${sessionId}/save`, gameState);
  },

  getSession: async (sessionId: string) => {
    return api.get(`/game/session/${sessionId}`);
  },

  getUserSessions: async () => {
    return api.get('/game/sessions/user');
  },

  getLeaderboard: async (gameType: string, limit: number = 10) => {
    return api.get(`/game/leaderboard/${gameType}`, {
      params: { limit }
    });
  },
};

// Health check
export const healthCheck = async () => {
  return api.get('/health');
};

export default api;

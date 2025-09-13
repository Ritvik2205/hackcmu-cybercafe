// User types
export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserCreate {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}

export interface UserUpdate {
  username?: string;
  email?: string;
  full_name?: string;
  password?: string;
}

// Auth types
export interface Token {
  access_token: string;
  token_type: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

// Game types
export interface GameSession {
  id?: string;
  user_id: number;
  game_type: string;
  start_time: string;
  end_time?: string;
  score?: number;
  level?: number;
  game_state?: any;
}

export interface GameState {
  session_id: string;
  game_data: any;
  timestamp: string;
}

export interface LeaderboardEntry {
  id: string;
  user_id: number;
  game_type: string;
  score: number;
  start_time: string;
  end_time: string;
}

export interface Leaderboard {
  game_type: string;
  leaderboard: LeaderboardEntry[];
  total_players: number;
}

// Component prop types
export interface GameComponentProps {
  onGameEnd?: (score: number) => void;
  onGameStateChange?: (gameState: any) => void;
  sessionId?: string;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: string;
}

// Game types enum
export enum GameType {
  SNAKE = 'snake',
  PACMAN = 'pacman',
  SPACE_INVADERS = 'space_invaders',
  TETRIS = 'tetris',
  PONG = 'pong',
}

// src/types/global.d.ts
interface Window {
  PACMAN?: {
    init: (el: HTMLElement, assetPath: string) => void;
  };
}

# 🖥️ Cyber Café Simulation

A nostalgic 90s cyber café experience built with **React + TypeScript** frontend and **FastAPI** backend. Relive the golden age of arcade gaming with classic games like Snake, Pac-Man, Space Invaders, and more!

![Cyber Café Sim](https://img.shields.io/badge/Cyber%20Café-Simulation-00ffff?style=for-the-badge&logo=gamepad&logoColor=white)
![React](https://img.shields.io/badge/React-18.x-61dafb?style=for-the-badge&logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.x-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript&logoColor=white)

## 🎮 Features

- **Classic Arcade Games**: Snake, Pac-Man, Space Invaders, Tetris, Pong
- **User Authentication**: Register, login, and manage your gaming profile
- **Leaderboards**: Compete with other players and climb the ranks
- **Game Session Tracking**: Save your progress and track your gaming history
- **Retro UI Design**: Authentic 90s cyber café aesthetic with CRT effects
- **Real-time Game State**: Save and restore game progress
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Python 3.11+
- Docker (optional)

### Option 1: Docker Setup (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd cyber-cafe-sim

# Start all services with Docker Compose
docker-compose up --build

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Manual Setup

#### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload

# Server runs at: http://127.0.0.1:8000
```

#### Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Frontend runs at: http://localhost:5173
```

## 🎯 Demo Credentials

For testing purposes, you can use these demo credentials:

- **Username**: `demo_user`
- **Password**: `any password`

## 📁 Project Structure

```
cyber-cafe-sim/
│
├── backend/                 # FastAPI Backend
│   ├── app/
│   │   ├── main.py          # FastAPI entrypoint
│   │   ├── routers/         # API route handlers
│   │   │   ├── users.py     # User authentication routes
│   │   │   └── game.py      # Game session routes
│   │   ├── models/          # Pydantic data models
│   │   │   └── user.py      # User model definitions
│   │   ├── services/        # Business logic
│   │   │   ├── user_service.py
│   │   │   └── game_state.py
│   │   └── database.py      # Database configuration
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile           # Backend containerization
│
├── frontend/                # React + TypeScript Frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   │   ├── Home.tsx     # Landing page
│   │   │   ├── Login.tsx    # Login page
│   │   │   ├── Register.tsx # Registration page
│   │   │   ├── Dashboard.tsx # User dashboard
│   │   │   └── GameScreen.tsx # Game interface
│   │   ├── services/        # API service layer
│   │   │   └── api.ts       # Axios API client
│   │   ├── types/           # TypeScript type definitions
│   │   │   └── index.ts     # Shared types
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # React entrypoint
│   ├── package.json         # Node.js dependencies
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   └── Dockerfile           # Frontend containerization
│
├── docker-compose.yml       # Multi-container setup
├── env.example              # Environment variables template
└── README.md               # This file
```

## 🎮 Available Games

| Game | Status | Description |
|------|--------|-------------|
| 🐍 Snake | ✅ Playable | Classic snake game - eat food and grow! |
| 🟡 Pac-Man | 🚧 Coming Soon | Navigate the maze and collect dots |
| 🚀 Space Invaders | 🚧 Coming Soon | Defend Earth from alien invasion! |
| 🧩 Tetris | 🚧 Coming Soon | Stack falling blocks to clear lines |
| ⚪ Pong | 🚧 Coming Soon | Classic paddle and ball game |

## 🔧 API Endpoints

### Authentication
- `POST /users/register` - Register a new user
- `POST /users/login` - Login with username/password
- `GET /users/me` - Get current user info

### Game Sessions
- `POST /game/session/start` - Start a new game session
- `POST /game/session/{id}/end` - End a game session
- `POST /game/session/{id}/save` - Save game state
- `GET /game/sessions/user` - Get user's game sessions
- `GET /game/leaderboard/{game_type}` - Get game leaderboard

### Health Check
- `GET /health` - API health status

## 🎨 UI Features

- **Cyberpunk Theme**: Neon colors, monospace fonts, and retro aesthetics
- **CRT Monitor Effect**: Scanlines and glow effects for authentic feel
- **Responsive Grid Layout**: Adapts to different screen sizes
- **Interactive Animations**: Hover effects and transitions
- **Game Grid Display**: Visual game boards with retro styling

## 🛠️ Development

### Adding New Games

1. Create a new game component in `frontend/src/components/`
2. Add the game type to `frontend/src/types/index.ts`
3. Implement game logic with state management
4. Add routing in `frontend/src/App.tsx`
5. Update the home page to include the new game

### Backend Development

1. Add new routes in `backend/app/routers/`
2. Define data models in `backend/app/models/`
3. Implement business logic in `backend/app/services/`
4. Update API documentation

### Environment Variables

Copy `env.example` to `.env` and configure:

```bash
# Backend
DATABASE_URL=sqlite:///./cyber_cafe_sim.db
SECRET_KEY=your-secret-key-change-in-production

# Frontend
VITE_API_URL=http://localhost:8000
```

## 🚀 Deployment

### Production Build

```bash
# Frontend production build
cd frontend
npm run build

# Backend production
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Docker Production

```bash
# Build production images
docker-compose -f docker-compose.prod.yml up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by 90s cyber cafés and arcade gaming culture
- Built with modern web technologies for the best of both worlds
- Special thanks to the open-source community for the amazing tools

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/cyber-cafe-sim/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

**Made with ❤️ and nostalgia for the golden age of gaming**

*Step into the cyber café and relive the magic of 90s arcade gaming!*

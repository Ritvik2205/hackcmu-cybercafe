#!/bin/bash

# Cyber Café Simulation Startup Script
echo "🖥️  Starting Cyber Café Simulation..."
echo "=================================="

# Check if Docker is available
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo "🐳 Docker detected. Starting with Docker Compose..."
    echo ""
    
    # Start services with Docker Compose
    docker-compose up --build
    
else
    echo "⚠️  Docker not found. Starting manually..."
    echo ""
    echo "Please run the following commands in separate terminals:"
    echo ""
    echo "Terminal 1 (Backend):"
    echo "cd backend"
    echo "python -m venv venv"
    echo "source venv/bin/activate  # On Windows: venv\\Scripts\\activate"
    echo "pip install -r requirements.txt"
    echo "uvicorn app.main:app --reload"
    echo ""
    echo "Terminal 2 (Frontend):"
    echo "cd frontend"
    echo "npm install"
    echo "npm run dev"
    echo ""
    echo "Then visit:"
    echo "Frontend: http://localhost:5173"
    echo "Backend API: http://localhost:8000"
    echo "API Docs: http://localhost:8000/docs"
fi

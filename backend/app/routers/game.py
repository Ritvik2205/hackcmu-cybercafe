from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
from datetime import datetime
from ..models.user import User
from .users import get_current_user

router = APIRouter()

class GameSession(BaseModel):
    id: Optional[str] = None
    user_id: int
    game_type: str  # e.g., "snake", "pacman", "space_invaders"
    start_time: datetime
    end_time: Optional[datetime] = None
    score: Optional[int] = 0
    level: Optional[int] = 1
    game_state: Optional[Dict[str, Any]] = None

class GameState(BaseModel):
    session_id: str
    game_data: Dict[str, Any]
    timestamp: datetime

# Mock game sessions storage (in production, use a database)
game_sessions: Dict[str, GameSession] = {}

@router.post("/session/start")
async def start_game_session(
    game_type: str,
    current_user: dict = Depends(get_current_user)
):
    """Start a new game session"""
    session_id = f"{current_user['id']}_{game_type}_{datetime.now().timestamp()}"
    
    session = GameSession(
        id=session_id,
        user_id=current_user["id"],
        game_type=game_type,
        start_time=datetime.now()
    )
    
    game_sessions[session_id] = session
    
    return {
        "session_id": session_id,
        "message": f"Game session started for {game_type}",
        "session": session
    }

@router.post("/session/{session_id}/end")
async def end_game_session(
    session_id: str,
    score: int,
    current_user: dict = Depends(get_current_user)
):
    """End a game session and save the score"""
    if session_id not in game_sessions:
        raise HTTPException(status_code=404, detail="Game session not found")
    
    session = game_sessions[session_id]
    if session.user_id != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not your game session")
    
    session.end_time = datetime.now()
    session.score = score
    
    return {
        "session_id": session_id,
        "final_score": score,
        "duration": (session.end_time - session.start_time).total_seconds(),
        "message": "Game session ended successfully"
    }

@router.post("/session/{session_id}/save")
async def save_game_state(
    session_id: str,
    game_state: GameState,
    current_user: dict = Depends(get_current_user)
):
    """Save the current game state"""
    if session_id not in game_sessions:
        raise HTTPException(status_code=404, detail="Game session not found")
    
    session = game_sessions[session_id]
    if session.user_id != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not your game session")
    
    session.game_state = game_state.game_data
    
    return {
        "session_id": session_id,
        "message": "Game state saved successfully",
        "timestamp": game_state.timestamp
    }

@router.get("/session/{session_id}")
async def get_game_session(
    session_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get game session details"""
    if session_id not in game_sessions:
        raise HTTPException(status_code=404, detail="Game session not found")
    
    session = game_sessions[session_id]
    if session.user_id != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not your game session")
    
    return session

@router.get("/sessions/user")
async def get_user_game_sessions(
    current_user: dict = Depends(get_current_user)
):
    """Get all game sessions for the current user"""
    user_sessions = [
        session for session in game_sessions.values() 
        if session.user_id == current_user["id"]
    ]
    
    return {
        "user_id": current_user["id"],
        "sessions": user_sessions,
        "total_sessions": len(user_sessions)
    }

@router.get("/leaderboard/{game_type}")
async def get_leaderboard(game_type: str, limit: int = 10):
    """Get leaderboard for a specific game type"""
    game_sessions_list = [
        session for session in game_sessions.values()
        if session.game_type == game_type and session.score is not None
    ]
    
    # Sort by score (highest first)
    sorted_sessions = sorted(
        game_sessions_list, 
        key=lambda x: x.score, 
        reverse=True
    )[:limit]
    
    return {
        "game_type": game_type,
        "leaderboard": sorted_sessions,
        "total_players": len(game_sessions_list)
    }

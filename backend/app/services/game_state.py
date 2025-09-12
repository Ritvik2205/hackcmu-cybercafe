from typing import Dict, Any, Optional
from datetime import datetime
import json

class GameStateManager:
    """Manages game state persistence and retrieval"""
    
    def __init__(self):
        # In production, this would be a database
        self.game_states: Dict[str, Dict[str, Any]] = {}
    
    def save_game_state(self, session_id: str, game_data: Dict[str, Any]) -> bool:
        """Save game state for a session"""
        try:
            self.game_states[session_id] = {
                "game_data": game_data,
                "timestamp": datetime.now().isoformat(),
                "session_id": session_id
            }
            return True
        except Exception as e:
            print(f"Error saving game state: {e}")
            return False
    
    def load_game_state(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Load game state for a session"""
        return self.game_states.get(session_id)
    
    def delete_game_state(self, session_id: str) -> bool:
        """Delete game state for a session"""
        if session_id in self.game_states:
            del self.game_states[session_id]
            return True
        return False
    
    def get_user_game_states(self, user_id: int) -> Dict[str, Any]:
        """Get all game states for a user"""
        user_states = {}
        for session_id, state in self.game_states.items():
            if state.get("game_data", {}).get("user_id") == user_id:
                user_states[session_id] = state
        return user_states
    
    def cleanup_old_states(self, days_old: int = 7) -> int:
        """Clean up game states older than specified days"""
        cutoff_date = datetime.now().timestamp() - (days_old * 24 * 60 * 60)
        deleted_count = 0
        
        sessions_to_delete = []
        for session_id, state in self.game_states.items():
            state_timestamp = datetime.fromisoformat(state["timestamp"]).timestamp()
            if state_timestamp < cutoff_date:
                sessions_to_delete.append(session_id)
        
        for session_id in sessions_to_delete:
            del self.game_states[session_id]
            deleted_count += 1
        
        return deleted_count

# Global game state manager instance
game_state_manager = GameStateManager()

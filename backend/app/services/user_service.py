from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
import os

from ..models.user import User, UserCreate, UserInDB
from ..database import get_db

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Mock database functions (replace with actual database operations)
def get_user(db: Session, user_id: int) -> Optional[User]:
    """Get user by ID"""
    # Mock implementation - replace with actual database query
    if user_id == 1:
        return User(
            id=1,
            username="demo_user",
            email="demo@example.com",
            full_name="Demo User",
            is_active=True,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
    return None

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Get user by email"""
    # Mock implementation - replace with actual database query
    if email == "demo@example.com":
        return User(
            id=1,
            username="demo_user",
            email="demo@example.com",
            full_name="Demo User",
            is_active=True,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
    return None

def get_user_by_username(db: Session, username: str) -> Optional[User]:
    """Get user by username"""
    # Mock implementation - replace with actual database query
    if username == "demo_user":
        return User(
            id=1,
            username="demo_user",
            email="demo@example.com",
            full_name="Demo User",
            is_active=True,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
    return None

def get_users(db: Session, skip: int = 0, limit: int = 100) -> list[User]:
    """Get list of users"""
    # Mock implementation - replace with actual database query
    return [
        User(
            id=1,
            username="demo_user",
            email="demo@example.com",
            full_name="Demo User",
            is_active=True,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
    ]

def create_user(db: Session, user: UserCreate) -> User:
    """Create a new user"""
    # Mock implementation - replace with actual database operations
    hashed_password = get_password_hash(user.password)
    db_user = User(
        id=2,  # In real implementation, this would be auto-generated
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        is_active=True,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    # In real implementation, save to database here
    return db_user

def update_user(db: Session, user_id: int, user_update: dict) -> Optional[User]:
    """Update user information"""
    # Mock implementation - replace with actual database operations
    user = get_user(db, user_id)
    if user:
        # Update user fields based on user_update
        for field, value in user_update.items():
            if value is not None:
                setattr(user, field, value)
        user.updated_at = datetime.now()
    return user

def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
    """Authenticate user with username and password"""
    user = get_user_by_username(db, username)
    if not user:
        return None
    
    # In real implementation, check hashed password
    # For demo purposes, accept any password for demo_user
    if username == "demo_user":
        return user
    
    return None

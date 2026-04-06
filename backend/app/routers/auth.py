"""Authentication Routes"""
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.auth_service import AuthService
from app.schemas.user import UserRegisterRequest, UserLoginRequest, TokenResponse, UserResponse
from app.core.dependencies import get_current_user
from app.models.user import User

from fastapi import APIRouter, Depends, status, Request
from app.core.rate_limit import limiter

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
async def register(request: Request, user_data: UserRegisterRequest, db: Session = Depends(get_db)):
    """Register a new user and return JWT token."""
    return AuthService.register(db, user_data)

@router.post("/login", response_model=TokenResponse)
@limiter.limit("5/minute")
async def login(request: Request, credentials: UserLoginRequest, db: Session = Depends(get_db)):
    """Login and return JWT token."""
    return AuthService.login(db, credentials)


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get current user profile."""
    return UserResponse.model_validate(current_user)

"""Dependency injection for FastAPI"""
from typing import List, Optional
from fastapi import Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.security import decode_token
from app.models.user import User


async def get_current_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db),
) -> User:
    """Get current authenticated user from JWT token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    if not authorization:
        raise credentials_exception
    
    # Extract token from "Bearer <token>" format
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise credentials_exception
    
    token = parts[1]
    payload = decode_token(token)
    
    if payload is None:
        raise credentials_exception
    
    user_id: str = payload.get("sub")
    
    if user_id is None:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    
    if user is None:
        raise credentials_exception
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated",
        )
    
    return user


def get_token_from_header(authorization: Optional[str] = None) -> Optional[str]:
    """Extract token from Authorization header."""
    if not authorization:
        return None
    
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        return None
    
    return parts[1]


def role_required(allowed_roles: List[str]):
    """Factory function to create role-checking dependency."""
    async def check_role(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"This action requires one of these roles: {', '.join(allowed_roles)}",
            )
        return current_user
    
    return check_role

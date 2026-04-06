"""User Management Routes"""
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.user_service import UserService
from app.core.dependencies import get_current_user, role_required, get_token_from_header
from app.models.user import User
from app.schemas.user import (
    UserUpdateRoleRequest, UserStatusUpdateRequest, UserResponse, UserListResponse
)
from typing import Optional
from fastapi import Header

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=UserListResponse)
async def list_users(
    page: int = 1,
    limit: int = 20,
    current_user: User = Depends(role_required(["admin"])),
    db: Session = Depends(get_db),
):
    """Get all users (admin only)."""
    return UserService.get_all_users(db, page=page, limit=limit)


@router.patch("/{user_id}/role", response_model=UserResponse)
async def update_user_role(
    user_id: str,
    role_data: UserUpdateRoleRequest,
    current_user: User = Depends(role_required(["admin"])),
    db: Session = Depends(get_db),
):
    """Update user role (admin only)."""
    return UserService.update_user_role(db, user_id, role_data)


@router.patch("/{user_id}/status", response_model=UserResponse)
async def update_user_status(
    user_id: str,
    status_data: UserStatusUpdateRequest,
    current_user: User = Depends(role_required(["admin"])),
    db: Session = Depends(get_db),
):
    """Update user active status (admin only)."""
    return UserService.update_user_status(db, user_id, status_data)


@router.delete("/{user_id}")
async def delete_user(
    user_id: str,
    current_user: User = Depends(role_required(["admin"])),
    db: Session = Depends(get_db),
):
    """Delete user (admin only)."""
    return UserService.delete_user(db, user_id)

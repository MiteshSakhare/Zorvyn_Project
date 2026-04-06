"""User Pydantic Schemas"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from uuid import UUID
from datetime import datetime
from app.models.user import RoleEnum


class UserRegisterRequest(BaseModel):
    """Schema for user registration."""
    email: EmailStr
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters")
    full_name: str = Field(..., min_length=1, max_length=255)


class UserLoginRequest(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """Schema for user response."""
    id: UUID
    email: str
    full_name: str
    role: RoleEnum
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """Schema for token response."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class UserUpdateRoleRequest(BaseModel):
    """Schema for updating user role."""
    role: RoleEnum


class UserStatusUpdateRequest(BaseModel):
    """Schema for updating user status."""
    is_active: bool


class UserListResponse(BaseModel):
    """Schema for user list response."""
    total: int
    page: int
    limit: int
    users: list[UserResponse]

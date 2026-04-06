"""User Management Service"""
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.user import User, RoleEnum
from app.schemas.user import UserUpdateRoleRequest, UserStatusUpdateRequest, UserResponse, UserListResponse
from fastapi import HTTPException, status


class UserService:
    """Service for user management operations."""
    
    @staticmethod
    def get_all_users(db: Session, page: int = 1, limit: int = 20) -> UserListResponse:
        """Get all users with pagination."""
        if page < 1 or limit < 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Page and limit must be greater than 0"
            )
        
        skip = (page - 1) * limit
        
        total = db.query(User).count()
        users = db.query(User).order_by(desc(User.created_at)).offset(skip).limit(limit).all()
        
        return UserListResponse(
            total=total,
            page=page,
            limit=limit,
            users=[UserResponse.model_validate(user) for user in users]
        )
    
    @staticmethod
    def update_user_role(db: Session, user_id: str, role_data: UserUpdateRoleRequest) -> UserResponse:
        """Update user role."""
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        user.role = role_data.role
        db.commit()
        db.refresh(user)
        
        return UserResponse.model_validate(user)
    
    @staticmethod
    def update_user_status(db: Session, user_id: str, status_data: UserStatusUpdateRequest) -> UserResponse:
        """Update user active status."""
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        user.is_active = status_data.is_active
        db.commit()
        db.refresh(user)
        
        return UserResponse.model_validate(user)
    
    @staticmethod
    def delete_user(db: Session, user_id: str) -> dict:
        """Hard delete user."""
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        db.delete(user)
        db.commit()
        
        return {"message": f"User {user_id} deleted successfully"}

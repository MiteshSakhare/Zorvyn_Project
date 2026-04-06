"""Authentication Service"""
from sqlalchemy.orm import Session
from app.models.user import User, RoleEnum
from app.core.security import hash_password, verify_password, create_access_token
from app.schemas.user import UserRegisterRequest, UserLoginRequest, TokenResponse, UserResponse
from fastapi import HTTPException, status


from app.services.audit import AuditService

class AuthService:
    """Service for authentication operations."""
    
    @staticmethod
    def register(db: Session, user_data: UserRegisterRequest) -> TokenResponse:
        """Register a new user."""
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new user with default role 'viewer'
        new_user = User(
            email=user_data.email,
            hashed_password=hash_password(user_data.password),
            full_name=user_data.full_name,
            role=RoleEnum.VIEWER,
            is_active=True,
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        # Log activity
        AuditService.log_activity(
            db=db,
            user_id=new_user.id,
            action="USER_REGISTER",
            entity_type="user",
            entity_id=str(new_user.id),
            details={"email": new_user.email}
        )
        
        # Generate token
        access_token = create_access_token(data={"sub": str(new_user.id)})
        
        return TokenResponse(
            access_token=access_token,
            user=UserResponse.model_validate(new_user)
        )
    
    @staticmethod
    def login(db: Session, credentials: UserLoginRequest) -> TokenResponse:
        """Authenticate user and return token."""
        user = db.query(User).filter(User.email == credentials.email).first()
        
        if not user or not verify_password(credentials.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is deactivated"
            )
        
        # Log activity
        AuditService.log_activity(
            db=db,
            user_id=user.id,
            action="USER_LOGIN",
            details={"status": "success"}
        )
        
        # Generate token
        access_token = create_access_token(data={"sub": str(user.id)})
        
        return TokenResponse(
            access_token=access_token,
            user=UserResponse.model_validate(user)
        )

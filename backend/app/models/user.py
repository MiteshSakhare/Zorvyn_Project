"""User Database Model"""
import uuid
from sqlalchemy import Column, String, Boolean, DateTime, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime, timezone
from app.database import Base
import enum


class RoleEnum(str, enum.Enum):
    """User role enumeration."""
    VIEWER = "viewer"
    ANALYST = "analyst"
    ADMIN = "admin"


class User(Base):
    """User database model."""
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(SQLEnum(RoleEnum), default=RoleEnum.VIEWER, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
    
    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email}, role={self.role})>"

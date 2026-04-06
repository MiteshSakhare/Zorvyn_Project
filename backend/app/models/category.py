"""Category Database Model"""
import uuid
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime, timezone
from app.database import Base


class Category(Base):
    """Category database model."""
    __tablename__ = "categories"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
    
    __table_args__ = (
        Index("idx_category_created_by", "created_by"),
    )
    
    def __repr__(self) -> str:
        return f"<Category(id={self.id}, name={self.name})>"

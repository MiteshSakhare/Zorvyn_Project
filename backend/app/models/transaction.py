"""Transaction Database Model"""
import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, Numeric, Date, Index, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime, date, timezone
from app.database import Base
from decimal import Decimal
import enum


class TransactionTypeEnum(str, enum.Enum):
    """Transaction type enumeration."""
    INCOME = "income"
    EXPENSE = "expense"


class Transaction(Base):
    """Transaction database model."""
    __tablename__ = "transactions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    amount = Column(Numeric(12, 2), nullable=False)
    type = Column(SQLEnum(TransactionTypeEnum), nullable=False, index=True)
    category_id = Column(UUID(as_uuid=True), ForeignKey("categories.id"), nullable=False, index=True)
    date = Column(Date, nullable=False, index=True)
    notes = Column(String(500), nullable=True)
    is_deleted = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
    
    __table_args__ = (
        Index("idx_transaction_user_date", "user_id", "date"),
        Index("idx_transaction_category", "category_id"),
    )
    
    def __repr__(self) -> str:
        return f"<Transaction(id={self.id}, user_id={self.user_id}, amount={self.amount}, type={self.type})>"

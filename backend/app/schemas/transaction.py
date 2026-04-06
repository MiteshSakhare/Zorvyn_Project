"""Transaction Pydantic Schemas"""
from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from datetime import datetime, date
from decimal import Decimal
from app.models.transaction import TransactionTypeEnum


class TransactionCreateRequest(BaseModel):
    """Schema for transaction creation."""
    amount: Decimal = Field(..., gt=0)
    type: TransactionTypeEnum
    category_id: UUID
    date: date
    notes: Optional[str] = Field(None, max_length=500)


class TransactionUpdateRequest(BaseModel):
    """Schema for transaction update."""
    amount: Optional[Decimal] = Field(None, gt=0)
    type: Optional[TransactionTypeEnum] = None
    category_id: Optional[UUID] = None
    date: Optional[date] = None
    notes: Optional[str] = Field(None, max_length=500)


class TransactionResponse(BaseModel):
    """Schema for transaction response."""
    id: UUID
    user_id: UUID
    amount: Decimal
    type: TransactionTypeEnum
    category_id: UUID
    date: date
    notes: Optional[str]
    is_deleted: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class TransactionListResponse(BaseModel):
    """Schema for transaction list response."""
    total: int
    page: int
    limit: int
    transactions: list[TransactionResponse]

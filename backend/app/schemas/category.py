"""Category Pydantic Schemas"""
from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from datetime import datetime


class CategoryCreateRequest(BaseModel):
    """Schema for category creation."""
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)


class CategoryResponse(BaseModel):
    """Schema for category response."""
    id: UUID
    name: str
    description: Optional[str]
    created_by: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

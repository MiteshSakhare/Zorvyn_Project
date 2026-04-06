"""Transaction Routes"""
from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.transaction_service import TransactionService
from app.services.category_service import CategoryService
from app.core.dependencies import get_current_user, role_required
from app.models.user import User
from app.schemas.transaction import (
    TransactionCreateRequest, TransactionUpdateRequest, TransactionResponse,
    TransactionListResponse
)
from datetime import date
from uuid import UUID
from typing import Optional

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.post("", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
async def create_transaction(
    transaction_data: TransactionCreateRequest,
    current_user: User = Depends(role_required(["analyst", "admin"])),
    db: Session = Depends(get_db),
):
    """Create a new transaction (analyst, admin)."""
    return TransactionService.create_transaction(db, current_user.id, transaction_data)


@router.get("", response_model=TransactionListResponse)
async def list_transactions(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1),
    type: Optional[str] = None,
    category_id: Optional[UUID] = None,
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    search: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get transactions with filtering and pagination."""
    is_admin_or_analyst = current_user.role in ["analyst", "admin"]
    
    return TransactionService.get_transactions(
        db,
        user_id=None if is_admin_or_analyst else current_user.id,
        is_admin=is_admin_or_analyst,
        type=type,
        category_id=category_id,
        date_from=date_from,
        date_to=date_to,
        search=search,
        page=page,
        limit=limit,
    )


@router.get("/{transaction_id}", response_model=TransactionResponse)
async def get_transaction(
    transaction_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get single transaction."""
    return TransactionService.get_transaction(db, transaction_id)


@router.put("/{transaction_id}", response_model=TransactionResponse)
async def update_transaction(
    transaction_id: UUID,
    transaction_data: TransactionUpdateRequest,
    current_user: User = Depends(role_required(["admin"])),
    db: Session = Depends(get_db),
):
    """Update transaction (admin only)."""
    return TransactionService.update_transaction(db, transaction_id, transaction_data)


@router.delete("/{transaction_id}")
async def delete_transaction(
    transaction_id: UUID,
    current_user: User = Depends(role_required(["admin"])),
    db: Session = Depends(get_db),
):
    """Soft delete transaction (admin only)."""
    return TransactionService.soft_delete_transaction(db, transaction_id)

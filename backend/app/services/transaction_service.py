"""Transaction Management Service"""
from sqlalchemy.orm import Session
from sqlalchemy import desc, and_, func
from app.models.transaction import Transaction
from app.models.category import Category
from app.schemas.transaction import (
    TransactionCreateRequest, TransactionUpdateRequest, TransactionResponse,
    TransactionListResponse
)
from fastapi import HTTPException, status
from datetime import date
from typing import Optional
from uuid import UUID
from app.services.audit import AuditService


class TransactionService:
    """Service for transaction management operations."""
    
    @staticmethod
    def create_transaction(
        db: Session, user_id: UUID, transaction_data: TransactionCreateRequest
    ) -> TransactionResponse:
        """Create a new transaction."""
        # Verify category exists
        category = db.query(Category).filter(Category.id == transaction_data.category_id).first()
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found"
            )
        
        new_transaction = Transaction(
            user_id=user_id,
            amount=transaction_data.amount,
            type=transaction_data.type,
            category_id=transaction_data.category_id,
            date=transaction_data.date,
            notes=transaction_data.notes,
        )
        
        db.add(new_transaction)
        db.commit()
        db.refresh(new_transaction)
        
        # Log activity
        AuditService.log_activity(
            db=db,
            user_id=user_id,
            action="TRANSACTION_CREATE",
            entity_type="transaction",
            entity_id=str(new_transaction.id),
            details={
                "amount": float(new_transaction.amount),
                "type": new_transaction.type,
                "category": category.name
            }
        )
        
        return TransactionResponse.model_validate(new_transaction)
    
    @staticmethod
    def get_transactions(
        db: Session,
        user_id: Optional[UUID] = None,
        is_admin: bool = False,
        type: Optional[str] = None,
        category_id: Optional[UUID] = None,
        date_from: Optional[date] = None,
        date_to: Optional[date] = None,
        search: Optional[str] = None,
        page: int = 1,
        limit: int = 20,
    ) -> TransactionListResponse:
        """Get transactions with filters and pagination."""
        if page < 1 or limit < 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Page and limit must be greater than 0"
            )
        
        # Build query
        query = db.query(Transaction).filter(Transaction.is_deleted == False)
        
        # Filter by user if not admin
        if user_id and not is_admin:
            query = query.filter(Transaction.user_id == user_id)
        
        # Apply optional filters
        if type:
            query = query.filter(Transaction.type == type)
        
        if category_id:
            query = query.filter(Transaction.category_id == category_id)
        
        if date_from:
            query = query.filter(Transaction.date >= date_from)
        
        if date_to:
            query = query.filter(Transaction.date <= date_to)
        
        if search:
            query = query.filter(Transaction.notes.ilike(f"%{search}%"))
        
        # Count total before pagination
        total = query.count()
        
        # Apply pagination
        skip = (page - 1) * limit
        transactions = query.order_by(desc(Transaction.date)).offset(skip).limit(limit).all()
        
        return TransactionListResponse(
            total=total,
            page=page,
            limit=limit,
            transactions=[TransactionResponse.model_validate(t) for t in transactions]
        )
    
    @staticmethod
    def get_transaction(db: Session, transaction_id: UUID) -> TransactionResponse:
        """Get a single transaction."""
        transaction = db.query(Transaction).filter(
            and_(Transaction.id == transaction_id, Transaction.is_deleted == False)
        ).first()
        
        if not transaction:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Transaction not found"
            )
        
        return TransactionResponse.model_validate(transaction)
    
    @staticmethod
    def update_transaction(
        db: Session, transaction_id: UUID, transaction_data: TransactionUpdateRequest
    ) -> TransactionResponse:
        """Update a transaction (admin only)."""
        transaction = db.query(Transaction).filter(
            and_(Transaction.id == transaction_id, Transaction.is_deleted == False)
        ).first()
        
        if not transaction:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Transaction not found"
            )
        
        old_data = {
            "amount": float(transaction.amount),
            "type": transaction.type,
            "category_id": str(transaction.category_id)
        }
        
        # Update fields
        if transaction_data.amount is not None:
            transaction.amount = transaction_data.amount
        if transaction_data.type is not None:
            transaction.type = transaction_data.type
        if transaction_data.category_id is not None:
            # Verify category exists
            category = db.query(Category).filter(
                Category.id == transaction_data.category_id
            ).first()
            if not category:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Category not found"
                )
            transaction.category_id = transaction_data.category_id
        if transaction_data.date is not None:
            transaction.date = transaction_data.date
        if transaction_data.notes is not None:
            transaction.notes = transaction_data.notes
        
        db.commit()
        db.refresh(transaction)
        
        # Log activity
        AuditService.log_activity(
            db=db,
            user_id=transaction.user_id,
            action="TRANSACTION_UPDATE",
            entity_type="transaction",
            entity_id=str(transaction.id),
            details={
                "before": old_data,
                "after": {
                    "amount": float(transaction.amount),
                    "type": transaction.type,
                    "category_id": str(transaction.category_id)
                }
            }
        )
        
        return TransactionResponse.model_validate(transaction)
    
    @staticmethod
    def soft_delete_transaction(db: Session, transaction_id: UUID) -> dict:
        """Soft delete a transaction (admin only)."""
        transaction = db.query(Transaction).filter(
            and_(Transaction.id == transaction_id, Transaction.is_deleted == False)
        ).first()
        
        if not transaction:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Transaction not found"
            )
        
        transaction.is_deleted = True
        db.commit()
        
        # Log activity
        AuditService.log_activity(
            db=db,
            user_id=transaction.user_id,
            action="TRANSACTION_DELETE",
            entity_type="transaction",
            entity_id=str(transaction_id),
            details={"notes": transaction.notes}
        )
        
        return {"message": f"Transaction {transaction_id} deleted successfully"}

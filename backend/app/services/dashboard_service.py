"""Dashboard Analytics Service"""
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, case
from app.models.transaction import Transaction, TransactionTypeEnum
from app.models.category import Category
from app.models.user import User
from app.schemas.dashboard import (
    DashboardSummary, CategoryTotal, CategoryBreakdownResponse,
    MonthlyTrend, DashboardTrendsResponse, RecentTransaction, RecentTransactionsResponse
)
from datetime import datetime, timedelta
from decimal import Decimal
from uuid import UUID
from typing import Optional


class DashboardService:
    """Service for dashboard analytics."""
    
    @staticmethod
    def get_summary(db: Session, user_id: Optional[UUID] = None, is_admin: bool = False) -> DashboardSummary:
        """Get dashboard summary statistics in a single pass."""
        # Use conditional aggregation for efficiency
        income_case = case(
            (Transaction.type == TransactionTypeEnum.INCOME, Transaction.amount),
            else_=0
        )
        expense_case = case(
            (Transaction.type == TransactionTypeEnum.EXPENSE, Transaction.amount),
            else_=0
        )

        stats_query = db.query(
            func.count(Transaction.id).label("count"),
            func.sum(income_case).label("income"),
            func.sum(expense_case).label("expenses")
        ).filter(Transaction.is_deleted == False)

        if user_id and not is_admin:
            stats_query = stats_query.filter(Transaction.user_id == user_id)
        
        result = stats_query.one()
        
        income = result.income or Decimal(0)
        expenses = result.expenses or Decimal(0)
        count = result.count or 0
        
        return DashboardSummary(
            total_income=income,
            total_expenses=expenses,
            net_balance=income - expenses,
            transaction_count=count,
        )
    
    @staticmethod
    def get_category_breakdown(
        db: Session, user_id: Optional[UUID] = None, is_admin: bool = False
    ) -> CategoryBreakdownResponse:
        """Get category-wise breakdown in a single efficient query."""
        income_case = case(
            (Transaction.type == TransactionTypeEnum.INCOME, Transaction.amount),
            else_=0
        )
        expense_case = case(
            (Transaction.type == TransactionTypeEnum.EXPENSE, Transaction.amount),
            else_=0
        )

        query = db.query(
            Category.id,
            Category.name,
            func.sum(income_case).label("income"),
            func.sum(expense_case).label("expenses")
        ).join(
            Transaction,
            and_(
                Transaction.category_id == Category.id,
                Transaction.is_deleted == False
            ),
            isouter=True
        )

        if user_id and not is_admin:
            query = query.filter(Transaction.user_id == user_id)
            
        results = query.group_by(Category.id, Category.name).all()
        
        categories = []
        total_income = Decimal(0)
        total_expenses = Decimal(0)
        
        for row in results:
            income = row.income or Decimal(0)
            expenses = row.expenses or Decimal(0)
            total_income += income
            total_expenses += expenses
            
            categories.append(CategoryTotal(
                category_id=row.id,
                category_name=row.name,
                income=income,
                expenses=expenses,
                total=income - expenses
            ))
            
        return CategoryBreakdownResponse(
            categories=categories,
            total_income=total_income,
            total_expenses=total_expenses,
        )
    
    @staticmethod
    def get_monthly_trends(
        db: Session, months: int = 6, user_id: Optional[UUID] = None, is_admin: bool = False
    ) -> DashboardTrendsResponse:
        """Get monthly trends in a single efficient query."""
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=30*months)
        
        income_case = case(
            (Transaction.type == TransactionTypeEnum.INCOME, Transaction.amount),
            else_=0
        )
        expense_case = case(
            (Transaction.type == TransactionTypeEnum.EXPENSE, Transaction.amount),
            else_=0
        )

        query = db.query(
            func.to_char(Transaction.date, 'YYYY-MM').label("month"),
            func.sum(income_case).label("income"),
            func.sum(expense_case).label("expenses")
        ).filter(
            and_(
                Transaction.is_deleted == False,
                Transaction.date >= start_date
            )
        )

        if user_id and not is_admin:
            query = query.filter(Transaction.user_id == user_id)
            
        results = query.group_by("month").order_by("month").all()
        
        trends = [
            MonthlyTrend(
                month=row.month,
                income=row.income or Decimal(0),
                expenses=row.expenses or Decimal(0),
                net=(row.income or Decimal(0)) - (row.expenses or Decimal(0))
            ) for row in results
        ]
        
        return DashboardTrendsResponse(trends=trends)
    
    @staticmethod
    def get_recent_transactions(
        db: Session, limit: int = 10, user_id: Optional[UUID] = None, is_admin: bool = False
    ) -> RecentTransactionsResponse:
        """Get recent transactions."""
        query = db.query(
            Transaction.id,
            Transaction.amount,
            Transaction.type,
            Category.name,
            Transaction.date,
            Transaction.notes
        ).join(
            Category, Transaction.category_id == Category.id
        ).filter(
            Transaction.is_deleted == False
        )
        
        if user_id and not is_admin:
            query = query.filter(Transaction.user_id == user_id)
        
        results = query.order_by(Transaction.date.desc()).limit(limit).all()
        
        transactions = [
            RecentTransaction(
                id=row[0],
                amount=row[1],
                type=row[2].value,
                category_name=row[3],
                date=row[4],
                notes=row[5]
            )
            for row in results
        ]
        
        return RecentTransactionsResponse(transactions=transactions)

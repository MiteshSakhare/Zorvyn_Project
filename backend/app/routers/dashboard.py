"""Dashboard Routes"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.dashboard_service import DashboardService
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.dashboard import (
    DashboardSummary, CategoryBreakdownResponse, DashboardTrendsResponse,
    RecentTransactionsResponse
)

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=DashboardSummary)
async def get_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get dashboard summary statistics."""
    import logging
    logger = logging.getLogger(__name__)
    
    # For admin/analyst, show all data. For viewers, show only their own data.
    role_str = str(current_user.role).lower() if current_user.role else "unknown"
    is_admin_or_analyst = role_str in ["analyst", "admin"]
    user_id = None if is_admin_or_analyst else current_user.id
    
    logger.info(f"Dashboard summary request - User: {current_user.email}, Role: {role_str}, IsAdminOrAnalyst: {is_admin_or_analyst}")
    
    return DashboardService.get_summary(
        db,
        user_id=user_id,
        is_admin=is_admin_or_analyst,
    )


@router.get("/by-category", response_model=CategoryBreakdownResponse)
async def get_category_breakdown(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get category-wise breakdown."""
    role_str = str(current_user.role).lower() if current_user.role else "unknown"
    is_admin_or_analyst = role_str in ["analyst", "admin"]
    user_id = None if is_admin_or_analyst else current_user.id
    
    return DashboardService.get_category_breakdown(
        db,
        user_id=user_id,
        is_admin=is_admin_or_analyst,
    )


@router.get("/trends", response_model=DashboardTrendsResponse)
async def get_trends(
    months: int = Query(6, ge=1, le=24),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get monthly trends."""
    role_str = str(current_user.role).lower() if current_user.role else "unknown"
    is_admin_or_analyst = role_str in ["analyst", "admin"]
    user_id = None if is_admin_or_analyst else current_user.id
    
    return DashboardService.get_monthly_trends(
        db,
        months=months,
        user_id=user_id,
        is_admin=is_admin_or_analyst,
    )


@router.get("/recent", response_model=RecentTransactionsResponse)
async def get_recent(
    limit: int = Query(10, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get recent transactions."""
    role_str = str(current_user.role).lower() if current_user.role else "unknown"
    is_admin_or_analyst = role_str in ["analyst", "admin"]
    user_id = None if is_admin_or_analyst else current_user.id
    
    return DashboardService.get_recent_transactions(
        db,
        limit=limit,
        user_id=user_id,
        is_admin=is_admin_or_analyst,
    )

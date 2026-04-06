"""Category Routes"""
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.category_service import CategoryService
from app.core.dependencies import get_current_user, role_required
from app.models.user import User
from app.schemas.category import CategoryCreateRequest, CategoryResponse

router = APIRouter(prefix="/categories", tags=["categories"])


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    category_data: CategoryCreateRequest,
    current_user: User = Depends(role_required(["admin"])),
    db: Session = Depends(get_db),
):
    """Create category (admin only)."""
    return CategoryService.create_category(db, category_data, current_user.id)


@router.get("", response_model=list[CategoryResponse])
async def list_categories(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all categories."""
    return CategoryService.get_all_categories(db)

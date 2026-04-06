"""Category Management Service"""
from sqlalchemy.orm import Session
from app.models.category import Category
from app.schemas.category import CategoryCreateRequest, CategoryResponse
from fastapi import HTTPException, status
from uuid import UUID


class CategoryService:
    """Service for category management."""
    
    @staticmethod
    def create_category(
        db: Session, category_data: CategoryCreateRequest, created_by: UUID
    ) -> CategoryResponse:
        """Create a new category (admin only)."""
        # Check if category name already exists
        existing = db.query(Category).filter(Category.name == category_data.name).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Category name already exists"
            )
        
        new_category = Category(
            name=category_data.name,
            description=category_data.description,
            created_by=created_by,
        )
        
        db.add(new_category)
        db.commit()
        db.refresh(new_category)
        
        return CategoryResponse.model_validate(new_category)
    
    @staticmethod
    def get_all_categories(db: Session) -> list[CategoryResponse]:
        """Get all categories."""
        categories = db.query(Category).order_by(Category.name).all()
        return [CategoryResponse.model_validate(cat) for cat in categories]
    
    @staticmethod
    def get_category(db: Session, category_id: UUID) -> CategoryResponse:
        """Get a single category."""
        category = db.query(Category).filter(Category.id == category_id).first()
        
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found"
            )
        
        return CategoryResponse.model_validate(category)

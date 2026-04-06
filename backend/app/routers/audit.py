from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.audit import AuditService
from app.core.dependencies import get_current_user, role_required
from app.models.user import User, RoleEnum
from typing import List, Optional

router = APIRouter(prefix="/audit", tags=["audit"])

@router.get("/logs", dependencies=[Depends(role_required([RoleEnum.ADMIN.value]))])
async def get_audit_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve audit logs (Admin only)."""
    return AuditService.get_logs(db, skip=skip, limit=limit)

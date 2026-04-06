from sqlalchemy.orm import Session
from app.models.audit import ActivityLog
from typing import Any, Dict, Optional
import uuid

class AuditService:
    @staticmethod
    def log_activity(
        db: Session,
        action: str,
        user_id: Optional[uuid.UUID] = None,
        entity_type: Optional[str] = None,
        entity_id: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None,
        ip_address: Optional[str] = None
    ):
        """Create a new activity log entry."""
        log_entry = ActivityLog(
            user_id=user_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            details=details,
            ip_address=ip_address
        )
        db.add(log_entry)
        db.commit()
        db.refresh(log_entry)
        return log_entry

    @staticmethod
    def get_logs(db: Session, skip: int = 0, limit: int = 100):
        """Retrieve activity logs."""
        return db.query(ActivityLog).order_by(ActivityLog.timestamp.desc()).offset(skip).limit(limit).all()

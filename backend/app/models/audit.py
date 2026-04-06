import uuid
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from app.database import Base

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action = Column(String, nullable=False) # e.g. "CREATE_TRANSACTION", "LOGIN"
    entity_type = Column(String, nullable=True) # e.g. "transaction", "user"
    entity_id = Column(String, nullable=True)
    details = Column(JSON, nullable=True)
    ip_address = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    # Relationship
    user = relationship("User", backref="activity_logs")

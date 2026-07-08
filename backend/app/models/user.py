import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    api_key = Column(String(255), unique=True, index=True)
    is_active = Column(Boolean, default=True)
    organization = Column(String(255))        # e.g. "Nairobi County Health"
    created_at = Column(DateTime, default=datetime.utcnow)
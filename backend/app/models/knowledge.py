import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, Integer
from sqlalchemy.dialects.postgresql import UUID
from pgvector.sqlalchemy import Vector
from app.core.database import Base

class KnowledgeChunk(Base):
    __tablename__ = "knowledge_chunks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source = Column(String(255), nullable=False)  # e.g. "WHO_IMCI_2014"
    section = Column(String(255))                 # e.g. "Severe Pneumonia"
    content = Column(Text, nullable=False)        # the actual text chunk
    embedding = Column(Vector(1536))              # vector embedding
    chunk_index = Column(Integer)                 # position in original doc
    created_at = Column(DateTime, default=datetime.utcnow)

class TriageRequest(Base):
    __tablename__ = "triage_requests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_data = Column(Text, nullable=False)   # JSON string of input
    response = Column(Text)                       # JSON string of output
    triage_level = Column(String(50))             # EMERGENCY/URGENT/ROUTINE
    confidence = Column(String(10))               # confidence score
    created_at = Column(DateTime, default=datetime.utcnow)
import json
import os
from datetime import datetime
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.models.knowledge import TriageRequest

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://medtriage:medtriage_secret@db:5432/medtriage"
)

engine = create_async_engine(
    DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")
)
AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)


async def log_triage_request(
    request_data: dict,
    response_data: dict,
    triage_level: str,
    confidence: float,
):
    """
    Log every triage request and response to the database.
    Audit trail is non-negotiable in a clinical context.
    """
    async with AsyncSessionLocal() as session:
        log_entry = TriageRequest(
            patient_data=json.dumps(request_data),
            response=json.dumps(response_data),
            triage_level=triage_level,
            confidence=str(confidence),
        )
        session.add(log_entry)
        await session.commit()
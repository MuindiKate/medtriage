import os
import asyncio
from pathlib import Path
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
from app.models.knowledge import KnowledgeChunk

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://medtriage:medtriage_secret@db:5432/medtriage"
)
engine = create_async_engine(
    DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")
)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


def chunk_text(text: str, chunk_size: int = 300, overlap: int = 50) -> list[str]:
    """Split text into overlapping chunks."""
    words = text.split()
    chunks = []
    start = 0
    while start < len(words):
        end = start + chunk_size
        chunk = " ".join(words[start:end])
        chunks.append(chunk)
        start += chunk_size - overlap
    return chunks


async def ingest_document(filepath: str, source: str, section: str = None):
    """Load a document, chunk it, store in database."""
    print(f"\nIngesting: {filepath}")

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    chunks = chunk_text(content)
    print(f"Created {len(chunks)} chunks")

    async with AsyncSessionLocal() as session:
        # Clear existing chunks for this source
        await session.execute(
            text("DELETE FROM knowledge_chunks WHERE source = :source"),
            {"source": source}
        )

        for i, chunk in enumerate(chunks):
            # Use a zero vector as placeholder — retrieval uses keyword matching
            knowledge_chunk = KnowledgeChunk(
                source=source,
                section=section or source,
                content=chunk,
                embedding=[0.0] * 384,
                chunk_index=i,
            )
            session.add(knowledge_chunk)

        await session.commit()
        print(f"Stored {len(chunks)} chunks")


async def run_ingestion():
    """Ingest all medical knowledge documents."""
    docs_path = Path("/app/app/knowledge/documents")

    documents = [
        {
            "filepath": docs_path / "who_imci.txt",
            "source": "WHO_IMCI_2014",
            "section": "WHO IMCI Guidelines"
        },
        {
            "filepath": docs_path / "kenya_clinical.txt",
            "source": "KENYA_CLINICAL_2016",
            "section": "Kenya Clinical Guidelines"
        },
    ]

    for doc in documents:
        await ingest_document(**doc)

    print("\n✅ Ingestion complete!")


if __name__ == "__main__":
    asyncio.run(run_ingestion())
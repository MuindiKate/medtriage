import os
import asyncio
from pathlib import Path
from sentence_transformers import SentenceTransformer
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.models.knowledge import KnowledgeChunk

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://medtriage:medtriage_secret@db:5432/medtriage")
engine = create_async_engine(
    DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")
)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

# Load embedding model
print("Loading embedding model...")
model = SentenceTransformer("all-MiniLM-L6-v2")
EMBEDDING_DIM = 384  # all-MiniLM-L6-v2 produces 384-dimensional vectors
print("Model loaded!")

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
    """Load a document, chunk it, embed it, store in pgvector."""
    print(f"\nIngesting: {filepath}")

    # Load document
    with open(filepath, "r", encoding="utf-8") as f:
        text = f.read()

    # Chunk it
    chunks = chunk_text(text)
    print(f"Created {len(chunks)} chunks")

    # Generate embeddings
    print("Generating embeddings...")
    embeddings = model.encode(chunks, show_progress_bar=True)

    # Store in database
    async with AsyncSessionLocal() as session:
        for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
            knowledge_chunk = KnowledgeChunk(
                source=source,
                section=section or source,
                content=chunk,
                embedding=embedding.tolist(),
                chunk_index=i,
            )
            session.add(knowledge_chunk)
        await session.commit()
        print(f"Stored {len(chunks)} chunks in database")

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
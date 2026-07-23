import os
import anthropic
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text

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

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))


def get_embedding(text: str) -> list[float]:
    """Generate embedding using a simple hash-based approach for retrieval."""
    # Since Anthropic doesn't have a standalone embeddings endpoint,
    # we use keyword-based retrieval as a fallback
    keywords = text.lower().split()
    return keywords


async def retrieve_relevant_knowledge(query: str, top_k: int = 3) -> list[dict]:
    """
    Retrieve relevant knowledge chunks using keyword matching.
    Returns top_k most relevant chunks.
    """
    query_words = set(query.lower().split())

    async with AsyncSessionLocal() as session:
        result = await session.execute(
            text("SELECT source, section, content FROM knowledge_chunks")
        )
        rows = result.fetchall()

    # Score each chunk by keyword overlap
    scored = []
    for row in rows:
        content_words = set(row.content.lower().split())
        overlap = len(query_words & content_words)
        scored.append({
            "source": row.source,
            "section": row.section,
            "content": row.content,
            "distance": 1 / (overlap + 1),
        })

    # Sort by relevance and return top_k
    scored.sort(key=lambda x: x["distance"])
    return scored[:top_k]
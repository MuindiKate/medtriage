import os
from sentence_transformers import SentenceTransformer
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

model = SentenceTransformer("all-MiniLM-L6-v2")


async def retrieve_relevant_knowledge(query: str, top_k: int = 3) -> list[dict]:
    """
    Convert query to embedding, retrieve top_k most similar
    knowledge chunks from pgvector.
    """
    # Generate embedding for the query
    query_embedding = model.encode(query).tolist()

    async with AsyncSessionLocal() as session:
        result = await session.execute(
            text("""
                SELECT source, section, content,
                       embedding <=> cast(:embedding as vector) as distance
                FROM knowledge_chunks
                ORDER BY distance
                LIMIT :top_k
            """),
            {
                "embedding": str(query_embedding),
                "top_k": top_k
            }
        )
        rows = result.fetchall()

    return [
        {
            "source": row.source,
            "section": row.section,
            "content": row.content,
            "distance": row.distance,
        }
        for row in rows
    ]
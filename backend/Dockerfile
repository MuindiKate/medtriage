FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir --timeout=300 \
    fastapi uvicorn[standard] pydantic pydantic-settings \
    sqlalchemy asyncpg alembic pgvector \
    redis anthropic \
    python-jose[cryptography] passlib[bcrypt] \
    python-multipart httpx python-dotenv \
    tenacity email-validator \
    langchain langchain-anthropic langchain-community

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
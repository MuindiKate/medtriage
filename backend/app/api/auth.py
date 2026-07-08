import uuid
import secrets
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
import os

from app.models.user import User
from app.schemas.auth import UserRegister, UserLogin, TokenResponse, UserResponse
from app.core.security import hash_password, verify_password, create_access_token, decode_access_token

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://medtriage:medtriage_secret@db:5432/medtriage")
engine = create_async_engine(DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://"))
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

router = APIRouter()
security = HTTPBearer()


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Dependency — validates JWT token and returns current user."""
    token = credentials.credentials
    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token.")

    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(User).where(User.email == payload.get("sub"))
        )
        user = result.scalar_one_or_none()

    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User not found or inactive.")

    return user


@router.post("/auth/register", response_model=UserResponse)
async def register(data: UserRegister):
    """Register a new CHW app or organization."""
    async with AsyncSessionLocal() as session:
        # Check if email already exists
        result = await session.execute(
            select(User).where(User.email == data.email)
        )
        existing = result.scalar_one_or_none()
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered.")

        # Create user
        user = User(
            email=data.email,
            hashed_password=hash_password(data.password),
            api_key=f"mt_{secrets.token_urlsafe(32)}",
            organization=data.organization,
        )
        session.add(user)
        await session.commit()
        await session.refresh(user)

    return UserResponse(
        id=user.id,
        email=user.email,
        organization=user.organization,
        api_key=user.api_key,
        created_at=user.created_at,
    )


@router.post("/auth/login", response_model=TokenResponse)
async def login(data: UserLogin):
    """Login and receive a JWT token."""
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(User).where(User.email == data.email)
        )
        user = result.scalar_one_or_none()

    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token = create_access_token({"sub": user.email})
    return TokenResponse(access_token=token)


@router.get("/auth/me", response_model=UserResponse)
async def me(current_user: User = Depends(get_current_user)):
    """Get current authenticated user."""
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        organization=current_user.organization,
        api_key=current_user.api_key,
        created_at=current_user.created_at,
    )
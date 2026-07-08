from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime


class UserRegister(BaseModel):
    email: EmailStr
    password: str
    organization: str | None = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int = 60 * 24 * 60  # seconds


class UserResponse(BaseModel):
    id: UUID
    email: str
    organization: str | None
    api_key: str | None
    created_at: datetime
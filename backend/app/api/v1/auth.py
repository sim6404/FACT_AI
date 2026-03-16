from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.config import settings
from pydantic import BaseModel
from datetime import datetime, timedelta
from jose import jwt

router = APIRouter()


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int


@router.post("/token", response_model=TokenResponse)
async def login(
    form: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db),
):
    """
    개발용 로컬 인증 — 프로덕션에서는 OIDC/SAML SSO로 대체.
    """
    # TODO: verify against users table
    # Placeholder: accept any credentials in dev mode
    if not settings.DEBUG:
        raise HTTPException(status_code=403, detail="Use SSO in production")

    payload = {
        "sub":   form.username,
        "email": form.username,
        "exp":   datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return TokenResponse(access_token=token, expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60)


@router.get("/me")
async def me():
    """현재 사용자 정보 — 실제로는 JWT 검증 후 DB에서 조회"""
    return {
        "id": 1,
        "email": "admin@fourd.co.kr",
        "name": "김관리",
        "department_code": "management",
        "role_code": "admin",
    }

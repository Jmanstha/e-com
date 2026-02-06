from fastapi import APIRouter, Depends, FastAPI, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_async_session
from app.models.dbmodel import User
from app.schemas.schema import UserCreate, UserResponse
from app.services.crud import create_user, get_user_by_email

router = APIRouter()


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


@router.post("/login")
async def login(
    db: AsyncSession = Depends(get_async_session),
):
    pass

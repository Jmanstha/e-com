from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.models.dbmodel import User
from app.schemas.schema import UserCreate
from app.utils.hash import get_password_hash


async def create_user(*, session: AsyncSession, user_create: UserCreate) -> User:
    db_obj = User.model_validate(
        user_create, update={"hashed_password": get_password_hash(user_create.password)}
    )
    session.add(db_obj)
    await session.commit()
    await session.refresh(db_obj)
    return db_obj


async def get_user_by_email(*, session: AsyncSession, email: str) -> User | None:
    statement = select(User).where(User.useremail == email)
    # could not user .first() in the same line because it would apply on the promise of the async operation and not the result of the execution
    result = await session.execute(statement)
    session_user = result.scalars().first()
    return session_user

from app.models.dbmodel import User
from app.schemas.schema import UserCreate
from app.utils.security import get_password_hash, verify_password
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select


async def create_user(
    *,
    session: AsyncSession,
    user_create: UserCreate,
) -> User:
    db_obj = User.model_validate(
        user_create,
        update={"hashed_password": await get_password_hash(user_create.password)},
    )
    # needed to remove timezone awareness cause idk asyncpg a bitch
    if db_obj.created_at and db_obj.created_at.tzinfo:
        db_obj.created_at = db_obj.created_at.replace(tzinfo=None)

    session.add(db_obj)
    await session.commit()
    await session.refresh(db_obj)
    return db_obj


async def get_user_by_email(
    *,
    session: AsyncSession,
    email: str,
) -> User | None:
    statement = select(User).where(User.useremail == email)
    # could not user .first() in the same line because it would apply on the promise of the async operation and not the result of the execution
    result = await session.execute(statement)
    session_user = result.scalars().first()
    return session_user


# Dummy hash to use for timing attack prevention when user is not found
# This is an Argon2 hash of a random password, used to ensure constant-time comparison
DUMMY_HASH = "$argon2id$v=19$m=65536,t=3,p=4$MjQyZWE1MzBjYjJlZTI0Yw$YTU4NGM5ZTZmYjE2NzZlZjY0ZWY3ZGRkY2U2OWFjNjk"


async def authenticate(
    *,
    session: AsyncSession,
    email: str,
    password: str,
) -> User | None:
    db_user = await get_user_by_email(session=session, email=email)
    if not db_user:
        # Prevent timing attacks by running password verification even when user doesn't exist
        # This ensures the response time is similar whether or not the email exists
        await verify_password(password, DUMMY_HASH)
        return None

    verified, updated_password_hash = await verify_password(
        password, db_user.hashed_password
    )
    if not verified:
        return None
    if updated_password_hash:
        db_user.hashed_password = updated_password_hash
        session.add(db_user)
        await session.commit()
        await session.refresh(db_user)
    return db_user

import os

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.ext.asyncio.engine import AsyncEngine

DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql+asyncpg://postgres:jman@db:5432/ecomdb"
)

# Use create_async_engine for asyncpg
engine = AsyncEngine(create_async_engine(DATABASE_URL, echo=True))


async def get_db():
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    async with async_session() as session:
        yield sessionengine(DATABASE_URL)

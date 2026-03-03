import os
from typing import AsyncGenerator

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set!")

engine = create_async_engine(DATABASE_URL, echo=True, future=True)

# removing the init_db() to create the tables and everything because im making almebic do it instead useing alembic upgread head in the docker startup command script
# async def init_db():
#     async with engine.begin() as conn:
#         # alembic creates the tables for me so i dont need this line but it doesnt hurt
#         await conn.run_sync(SQLModel.metadata.create_all)


async def check_db_connection():
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
            print("Database connection successful.")
    except Exception as e:
        print(f"Database connection failed: {e}")
        raise e


# async_sessionmaker returns a generator for the session not an actual session instance hence the generator hint
async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async_session = async_sessionmaker(
        engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )
    async with async_session() as session:
        yield session

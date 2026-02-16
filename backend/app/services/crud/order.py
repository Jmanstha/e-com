import uuid

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select


async def create_order(
    *,
    session: AsyncSession,
):
    pass

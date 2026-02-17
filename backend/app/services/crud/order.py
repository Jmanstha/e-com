import uuid

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.models.dbmodel import User


async def create_order(
    *,
    session: AsyncSession,
    user: User,
):



async def create_order_item(
    *,
    session: AsyncSession,
    user: User,
):
    pass

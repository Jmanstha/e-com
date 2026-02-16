import uuid

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.models.dbmodel import Product
from app.schemas.schema import ProductCreate


async def create_product(
    *,
    session: AsyncSession,
    product_create: ProductCreate,
) -> Product:
    db_obj = Product.model_validate(
        product_create,
    )

    session.add(db_obj)
    await session.commit()
    await session.refresh(db_obj)
    return db_obj


async def get_product_by_name(
    *,
    session: AsyncSession,
    name: str,
) -> Product | None:
    statement = select(Product).where(Product.name == name)
    result = await session.execute(statement)
    product = result.scalars().first()
    return product


async def get_products_paginated(
    *,
    session: AsyncSession,
    limit: int,
    offset: int,
):
    statement = select(Product).offset(offset).limit(limit)
    result = await session.execute(statement)
    result_scaled = result.scalars().all()
    return result_scaled


async def get_product_by_id(
    *,
    session: AsyncSession,
    product_id: uuid.UUID,
) -> Product:
    statement = select(Product).where(Product.id == product_id)
    result = await session.execute(statement)
    product = result.scalars().first()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    return product

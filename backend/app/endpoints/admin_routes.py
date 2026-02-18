import os
import uuid
from typing import Annotated, List

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_async_session
from app.models.dbmodel import Product, User
from app.schemas.schema import (
    CartItemDisplay,
    DisplayTotalPrice,
    ProductCreate,
    ProductDisplay,
    ProductUpdate,
)

# Unified import from the new modular structure
from app.services import crud
from app.services.deps import get_current_active_admin, get_current_user

router = APIRouter()


session_dep = Annotated[AsyncSession, Depends(get_async_session)]


@router.post("/products")
async def admin_create_new_product(
    db: session_dep,
    product_in: ProductCreate,
    userAdmin: User = Depends(get_current_active_admin),
):
    # Check if exists using modular crud
    product_exists = await crud.get_product_by_name(session=db, name=product_in.name)
    if product_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product already registered",
        )

    product = await crud.create_product(session=db, product_create=product_in)
    return {"message": f"Successfully created product. Name:{product.name}"}


@router.patch("/products/{product_id}")
async def update_product(
    product_id: uuid.UUID,
    product_data: ProductUpdate,
    db: session_dep,
):
    # 1. Get the existing product from the DB
    db_product = await db.get(Product, product_id)
    if not db_product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    # 2. Extract the data the user actually sent (ignore the None values)
    # This returns a dictionary to me only with the values i updated
    update_dict = product_data.model_dump(exclude_unset=True)

    # 3. Apply the updates to the DB object
    db_product.sqlmodel_update(update_dict)

    db.add(db_product)
    await db.commit()
    await db.refresh(db_product)

    return db_product

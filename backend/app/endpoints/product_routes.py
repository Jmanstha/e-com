import os
import uuid
from typing import Annotated, List

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_async_session
from app.models.dbmodel import User
from app.schemas.schema import (
    CartItemDisplay,
    DisplayTotalPrice,
    ProductCreate,
    ProductDisplay,
)

# Unified import from the new modular structure
from app.services import crud
from app.services.deps import get_current_active_admin, get_current_user

router = APIRouter()
load_dotenv()

# Dependency Alias
session_dep = Annotated[AsyncSession, Depends(get_async_session)]


@router.get("/", response_model=List[ProductDisplay])
async def list_products(
    db: session_dep,
):
    limit_str = os.getenv("PRODUCT_LIMIT_PER_PAGE")
    if not limit_str:
        raise RuntimeError("PRODUCT_LIMIT_PER_PAGE env var not set")
    page = 1
    limit = int(limit_str)
    offset = (page - 1) * limit

    # Accessing via crud module
    products = await crud.get_products_paginated(
        session=db,
        limit=limit,
        offset=offset,
    )
    return products


@router.get("/update_stock")
async def update_stock(
    name: str,
    stock: int,
    db: session_dep,
):
    product = await crud.update_product_stock(session=db, name=name, stock=stock)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )
    return {
        "message": f"Succesfullly updated {product.name}s stock value to {product.stock}"
    }

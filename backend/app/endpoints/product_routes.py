import os
from typing import Annotated, List

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, FastAPI, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_async_session
from app.models.dbmodel import Product, User
from app.schemas.schema import ProductCreate, ProductDisplay
from app.services.crud import (
    create_product,
    get_product_by_name,
    get_products_paginated,
)
from app.services.deps import get_current_active_admin, get_current_user

router = APIRouter()

load_dotenv()


session = Annotated[AsyncSession, Depends(get_async_session)]


@router.get("/products", response_model=List[ProductDisplay])
async def list_products(
    page: int,
    db: session,
    user: User = Depends(get_current_user),
):
    PRODUCT_LIMIT_PER_PAGE = os.getenv("PRODUCT_LIMIT_PER_PAGE")
    if PRODUCT_LIMIT_PER_PAGE is None:
        raise RuntimeError("PRODUCT_LIMIT_PER_PAGE env var not set")

    offset = (page - 1) * int(PRODUCT_LIMIT_PER_PAGE)
    products = await get_products_paginated(
        session=db,
        limit=int(PRODUCT_LIMIT_PER_PAGE),
        offset=offset,
    )
    return products


@router.post("/products")
async def create_new_product(
    db: session,
    product_in: ProductCreate,
    userAdmin: User = Depends(get_current_active_admin),
):
    product_exists = await get_product_by_name(session=db, name=product_in.name)
    if product_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User email already registered",
        )

    product = await create_product(
        session=db,
        product_create=product_in,
    )
    if product:
        return {"message": f"Succesfully created product. ID:{product.id}"}

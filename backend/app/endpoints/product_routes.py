import os
import uuid
from typing import Annotated, List

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, FastAPI, HTTPException, status
from fastapi.exceptions import DependencyScopeError
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_async_session
from app.models.dbmodel import Product, User
from app.schemas.schema import CartItemDisplay, ProductCreate, ProductDisplay
from app.services.crud import (
    check_for_cart_or_create,
    create_cart_item,
    create_product,
    get_cartitems,
    get_product_by_id,
    get_product_by_name,
    get_products_paginated,
)
from app.services.deps import get_current_active_admin, get_current_user

router = APIRouter()

load_dotenv()


session = Annotated[AsyncSession, Depends(get_async_session)]


@router.get("/", response_model=List[ProductDisplay])
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


@router.get("/cartitems", response_model=List[CartItemDisplay])
async def list_users_cart_items(
    db: session,
    user: User = Depends(get_current_user),
):
    result = await get_cartitems(
        session=db,
        user=user,
    )
    return result


@router.get("/{name}", response_model=ProductDisplay)
async def search_products_by_name(
    name: str,
    db: session,
    user: User = Depends(get_current_user),
):
    product = await get_product_by_name(
        session=db,
        name=name,
    )
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    return product


@router.post("/")
async def create_new_product(
    db: session,
    product_in: ProductCreate,
    userAdmin: User = Depends(get_current_active_admin),
):
    product_exists = await get_product_by_name(session=db, name=product_in.name)
    if product_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product already registered",
        )

    product = await create_product(
        session=db,
        product_create=product_in,
    )
    if product:
        return {"message": f"Succesfully created product. ID:{product.id}"}


@router.post("/cart")
async def add_to_cart(
    product_id: uuid.UUID,
    quantity: int,
    db: session,
    user: User = Depends(get_current_user),
):
    product = await get_product_by_id(
        session=db,
        product_id=product_id,
    )
    cart = await check_for_cart_or_create(
        session=db,
        user=user,
    )
    cart_item = await create_cart_item(
        session=db,
        cart_id=cart.id,
        product=product,
        quantity=quantity,
    )
    return {"message": f"Added{product.name} to cart Succesfully"}

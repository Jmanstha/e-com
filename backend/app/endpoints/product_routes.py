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
    page: int,
    db: session_dep,
    user: User = Depends(get_current_user),
):
    limit_str = os.getenv("PRODUCT_LIMIT_PER_PAGE")
    if not limit_str:
        raise RuntimeError("PRODUCT_LIMIT_PER_PAGE env var not set")

    limit = int(limit_str)
    offset = (page - 1) * limit

    # Accessing via crud module
    products = await crud.get_products_paginated(
        session=db,
        limit=limit,
        offset=offset,
    )
    return products


@router.get("/cartitems", response_model=List[CartItemDisplay])
async def list_users_cart_items(
    db: session_dep,
    user: User = Depends(get_current_user),
):
    # This now calls the optimized join query in crud/cart.py
    return await crud.get_cartitems(session=db, user=user)


@router.get("/cartprice", response_model=DisplayTotalPrice)
async def list_users_total_cart_price(
    db: session_dep,
    user: User = Depends(get_current_user),
):
    return await crud.get_total_price(session=db, user=user)


@router.post("/")
async def create_new_product(
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


@router.post("/cart")
async def add_to_cart(
    product_id: uuid.UUID,
    quantity: int,
    db: session_dep,
    user: User = Depends(get_current_user),
):
    product = await crud.get_product_by_id(session=db, product_id=product_id)
    cart = await crud.check_for_cart_or_create(session=db, user=user)

    await crud.create_cart_item(
        session=db,
        cart_id=cart.id,
        product=product,
        quantity=quantity,
    )
    return {"message": f"Added {product.name} to cart successfully"}


@router.post("/order")
async def order_items_in_cart(
    db: session_dep,
    user: User = Depends(get_current_user),
):
    # This will call the logic in crud/order.py
    order = await crud.create_order(
        session=db,
        user=user,
    )
    await crud.create_order_items(
        session=db,
        user=user,
        order_id=order.id,
    )
    await crud.clear_cart(
        session=db,
        user=user,
    )
    await db.commit()
    await db.refresh(order)

    return {"message": "Order placed successfully", "order_id": order.id}


@router.get("/{name}", response_model=ProductDisplay)
async def search_products_by_name(
    name: str,
    db: session_dep,
    user: User = Depends(get_current_user),
):
    product = await crud.get_product_by_name(session=db, name=name)

    # The 404 is actually handled inside your get_product_by_name,
    # but keeping this for safety:
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )
    return product

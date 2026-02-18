import uuid
from typing import Annotated, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_async_session
from app.models.dbmodel import User
from app.schemas.schema import (
    CartItemDisplay,
    CartItemUpdate,
    DisplayTotalPrice,
)

# Unified import from the new modular structure
from app.services import crud
from app.services.deps import get_current_active_admin, get_current_user

router = APIRouter()

session_dep = Annotated[AsyncSession, Depends(get_async_session)]


@router.get("/", response_model=List[CartItemDisplay])
async def list_users_cart_items(
    db: session_dep,
    user: User = Depends(get_current_user),
):
    # This now calls the optimized join query in crud/cart.py
    return await crud.get_cartitems(session=db, user=user)


@router.get("/total", response_model=DisplayTotalPrice)
async def list_users_total_cart_price(
    db: session_dep,
    user: User = Depends(get_current_user),
):
    return await crud.get_total_price(session=db, user=user)


@router.post("/item")
async def add_to_cart(
    product_id: uuid.UUID,
    quantity: int,
    db: session_dep,
    user: User = Depends(get_current_user),
):
    product = await crud.get_product_by_id(session=db, product_id=product_id)
    if product.stock < quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": "insufficient_stock",
                "message": f"Not enough stock for {product.name}",
                "available_stock": product.stock,
                "product_id": str(product.id),
            },
        )
    cart = await crud.check_for_cart_or_create(session=db, user=user)

    await crud.create_cart_item(
        session=db,
        cart_id=cart.id,
        product=product,
        quantity=quantity,
    )
    return {"message": f"Added {product.name} to cart successfully"}


@router.delete("/item/{product_id}")
async def remove_item_from_cart(
    product_id: uuid.UUID,
    db: session_dep,
    user: User = Depends(get_current_user),
):
    await crud.remove_cart_item(
        session=db,
        user=user,
        product_id=product_id,
    )
    await db.commit()


@router.patch("/item/{product_id}")
async def update_cart_item_quantity(
    product_id: uuid.UUID,
    item_data: CartItemUpdate,
    db: session_dep,
    user: User = Depends(get_current_user),
):
    cart_item = await crud.update_quantity(
        session=db,
        user=user,
        product_id=product_id,
        new_quantity=item_data.quantity,
    )
    if cart_item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found in cart"
        )
    return {"message": f"Item quantity set to {cart_item.quantity}"}

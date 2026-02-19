import os
import uuid
from typing import Annotated, List

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_async_session
from app.models.dbmodel import User

# from app.schemas.schema import ( )
# Unified import from the new modular structure
from app.schemas.schema import OrderItemDisplay
from app.services import crud
from app.services.deps import get_current_active_admin, get_current_user

router = APIRouter()

session_dep = Annotated[AsyncSession, Depends(get_async_session)]


@router.post("/")
async def order_items_in_cart(
    db: session_dep,
    user: User = Depends(get_current_user),
):
    async with db.begin():
        order = await crud.create_order(
            session=db,
            user=user,
        )
        # If any of these raise an HTTPException (like your stock check),
        # the 'begin' block will automatically ROLLBACK the order created above.
        await crud.create_order_items(
            session=db,
            user=user,
            order_id=order.id,
        )
        await crud.clear_cart(
            session=db,
            user=user,
        )
        # We refresh INSIDE the transaction so the data is loaded
        # before the session potentially resets.
        await db.refresh(order)

    return {"message": "Order placed successfully", "order_id": order.id}


@router.post("/orders", response_model=list[OrderItemDisplay])
async def list_orders(
    db: session_dep,
    user: User = Depends(get_current_user),
):
    order_item = await crud.get_users_order_items(
        session=db,
        user=user,
    )
    return order_item

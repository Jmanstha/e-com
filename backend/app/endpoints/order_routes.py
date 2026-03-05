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
    try:
        # Use begin_nested() instead of begin()
        # because i already use a .being() during my db initialization
        async with db.begin_nested():
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

        # The nested transaction commits to the main transaction here
        await db.commit()
        await db.refresh(order)
        return {"message": "Order placed successfully", "order_id": order.id}

    except HTTPException as e:
        raise e
    except Exception as e:
        await db.rollback()  # Ensure rollback on actual crashes
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=list[OrderItemDisplay])
async def list_orders(
    db: session_dep,
    user: User = Depends(get_current_user),
):
    order_item = await crud.get_users_order_items(
        session=db,
        user=user,
    )
    return order_item

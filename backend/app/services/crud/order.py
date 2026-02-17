import uuid

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.models.dbmodel import Cart, CartItem, Order, OrderItem, Product, User
from app.services import crud


async def create_order(
    *,
    session: AsyncSession,
    user: User,
) -> Order:
    total_price = await crud.get_total_price(session=session, user=user)
    order = Order(
        user_id=user.id,
        total_price=total_price.total_price,
        status="Pending",
    )
    if order.ordered_at and order.ordered_at.tzinfo:
        order.ordered_at = order.ordered_at.replace(tzinfo=None)
    session.add(order)

    return order


async def create_order_items(
    *,
    session: AsyncSession,
    user: User,
    order_id: uuid.UUID,
) -> None:
    stmt = (
        select(Product.id, Product.price, CartItem.quantity)
        .join(CartItem, Product.id == CartItem.product_id)  # pyright: ignore
        .join(Cart, CartItem.cart_id == Cart.id)  # pyright: ignore
        .where(Cart.user_id == user.id)
    )

    result = await session.execute(stmt)
    items = result.all()

    created_items = []

    for item in items:
        order_item = OrderItem(
            order_id=order_id,
            product_id=item.id,
            quantity=item.quantity,
            price_at_purchase=item.price,
        )
        session.add(order_item)
        created_items.append(order_item)

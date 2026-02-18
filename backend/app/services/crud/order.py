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
        select(Product, CartItem.quantity)
        .join(CartItem, Product.id == CartItem.product_id)  # pyright: ignore
        .join(Cart, CartItem.cart_id == Cart.id)  # pyright: ignore
        .where(Cart.user_id == user.id)
    )

    result = await session.execute(stmt)
    # result.all() will return tuples of (Product, quantity)
    items = result.all()

    for product, quantity in items:
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

        order_item = OrderItem(
            order_id=order_id,
            product_id=product.id,
            quantity=quantity,
            price_at_purchase=product.price,
        )

        product.stock -= quantity

        session.add(order_item)
        session.add(product)


async def get_users_order_items(
    *,
    session: AsyncSession,
    user: User,
):
    stmt = (
        select(Product.name, OrderItem.quantity, Order.status)
        .join(OrderItem, Product.id == OrderItem.product_id)  # pyright: ignore
        .join(Order, OrderItem.order_id == Order.id)  # pyright: ignore
        .where(Order.user_id == user.id)
    )
    result = await session.execute(stmt)
    order_item = result.all()
    if not order_item:
        # Note: Usually an empty cart is just [], but here is your 404 logic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )
    return order_item

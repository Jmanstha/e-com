import uuid

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import delete, select

from app.models.dbmodel import Cart, CartItem, Order, OrderItem, Product, User
from app.schemas.schema import CreateOrderRequest, OrderItemDisplay, OrderStatus
from app.services import crud


async def create_order(
    *,
    payload: CreateOrderRequest,
    session: AsyncSession,
    user: User,
) -> Order:
    total_price = await crud.get_total_price(session=session, user=user)
    order = Order(
        user_id=user.id,
        total_price=total_price.total_price,
        status=OrderStatus.PENDING,
        latitude=payload.latitude,
        longitude=payload.longitude,
        address=payload.address,
        phone_number=payload.phone_number,
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
        .with_for_update()  # eliminated race conditions by locking the row
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
        select(Product.name, OrderItem, Order)
        .join(OrderItem, Product.id == OrderItem.product_id)  # pyright: ignore
        .join(Order, OrderItem.order_id == Order.id)  # pyright: ignore
        .where(Order.user_id == user.id)
    )
    result = await session.execute(stmt)
    order_item = result.all()
    if not order_item:
        return []
    return [
        OrderItemDisplay(
            id=r.OrderItem.id,
            name=r.name,
            quantity=r.OrderItem.quantity,
            status=r.Order.status,
            date=r.Order.ordered_at,
        )
        for r in order_item
    ]


async def cancel_order_item(
    *,
    order_item_id: uuid.UUID,
    session: AsyncSession,
    user: User,
):
    stmt = select(OrderItem).where(OrderItem.id == order_item_id)
    result = await session.execute(stmt)
    order_item = result.scalar_one_or_none()

    if order_item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Order item not found"
        )
    stmt = select(Product).where(Product.id == order_item.product_id)
    result = await session.execute(stmt)
    product = result.scalar_one()
    product.stock += order_item.quantity

    delete_stmt = delete(OrderItem).where(
        OrderItem.id == order_item_id  # pyright: ignore
    )
    await session.execute(delete_stmt)

    return product

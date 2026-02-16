import uuid

from app.models.dbmodel import Cart, CartItem, Product, User
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select


async def create_cart(
    *,
    session: AsyncSession,
    user: User,
) -> Cart:
    new_cart = Cart(user_id=user.id)
    session.add(new_cart)
    await session.commit()
    await session.refresh(new_cart)
    return new_cart


async def check_for_cart_or_create(
    *,
    session: AsyncSession,
    user: User,
) -> Cart:
    statement = select(Cart).where(Cart.user_id == user.id)
    result = await session.execute(statement)
    cart_exists = result.scalars().first()
    if cart_exists:
        return cart_exists

    new_cart = await create_cart(
        session=session,
        user=user,
    )
    return new_cart


async def create_cart_item(
    *,
    session: AsyncSession,
    cart_id: uuid.UUID,
    product: Product,
    quantity: int,
) -> CartItem:
    statement = select(CartItem).where(
        CartItem.cart_id == cart_id,
        CartItem.product_id == product.id,
    )
    result = await session.execute(statement)
    cart_item = result.scalars().first()

    if cart_item:
        cart_item.quantity += quantity
    else:
        cart_item = CartItem(
            cart_id=cart_id,
            product_id=product.id,
            quantity=quantity,
        )
        session.add(cart_item)

    await session.commit()
    await session.refresh(cart_item)

    return cart_item


async def get_cartitems(
    *,
    session: AsyncSession,
    user: User,
):
    # MY ATTEMPT
    # stmt = select(Cart).where(Cart.user_id == user.id)
    # result = await session.execute(stmt)
    # cart = result.scalars().first()
    #
    # if cart is None:
    #     raise HTTPException(
    #         status_code=status.HTTP_404_NOT_FOUND,
    #         detail="Cart not found",
    #     )
    #
    # stmt = select(CartItem).where(CartItem.cart_id == cart.id)
    # result = await session.execute(stmt)
    # cart_items = result.scalars().all()
    #
    # cart_data = []
    # for cart_item in cart_items:
    #     print(cart_item.id)
    #     stmt = select(Product).where(Product.id == cart_item.product_id)
    #     result = await session.execute(stmt)
    #     product = result.scalars().first()
    #     if product is None:
    #         raise HTTPException(
    #             status_code=status.HTTP_404_NOT_FOUND,
    #             detail="LOLOLOLOLOL not found",
    #         )
    #     cart_data.append(
    #         CartItemDisplay(
    #             name=product.name,
    #             quantity=cart_item.quantity,
    #         )
    #     )
    # return cart_data

    # OPTIMIZED
    # Dont need an instance of product cuz its linked via a foreign key, joins create this super row form the given contraints and the select only picks out the data that i actually need
    stmt = (
        select(Product.name, CartItem.quantity)
        .join(CartItem, Product.id == CartItem.product_id)  # pyright: ignore
        .join(Cart, CartItem.cart_id == Cart.id)  # pyright: ignore
        .where(Cart.user_id == user.id)
    )

    result = await session.execute(stmt)
    cart_data = result.all()

    # Optional: If you strictly want that 404 when the cart is empty
    if not cart_data:
        # Note: Usually an empty cart is just [], but here is your 404 logic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart or items not found",
        )

    # SQLAlchemy Rows automatically map to your Pydantic 'CartItemDisplay'
    return cart_data

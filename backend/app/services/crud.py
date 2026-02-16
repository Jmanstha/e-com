import uuid
from typing import List

from fastapi import HTTPException, status
from sqlalchemy import cast
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlmodel import select

from app.models.dbmodel import Cart, CartItem, Product, User
from app.schemas.schema import CartItemDisplay, ProductCreate, UserCreate
from app.utils.security import get_password_hash, verify_password


async def create_user(
    *,
    session: AsyncSession,
    user_create: UserCreate,
) -> User:
    db_obj = User.model_validate(
        user_create,
        update={"hashed_password": await get_password_hash(user_create.password)},
    )
    # needed to remove timezone awareness cause idk asyncpg a bitch
    if db_obj.created_at and db_obj.created_at.tzinfo:
        db_obj.created_at = db_obj.created_at.replace(tzinfo=None)

    session.add(db_obj)
    await session.commit()
    await session.refresh(db_obj)
    return db_obj


async def get_user_by_email(
    *,
    session: AsyncSession,
    email: str,
) -> User | None:
    statement = select(User).where(User.useremail == email)
    # could not user .first() in the same line because it would apply on the promise of the async operation and not the result of the execution
    result = await session.execute(statement)
    session_user = result.scalars().first()
    return session_user


# Dummy hash to use for timing attack prevention when user is not found
# This is an Argon2 hash of a random password, used to ensure constant-time comparison
DUMMY_HASH = "$argon2id$v=19$m=65536,t=3,p=4$MjQyZWE1MzBjYjJlZTI0Yw$YTU4NGM5ZTZmYjE2NzZlZjY0ZWY3ZGRkY2U2OWFjNjk"


async def authenticate(
    *,
    session: AsyncSession,
    email: str,
    password: str,
) -> User | None:
    db_user = await get_user_by_email(session=session, email=email)
    if not db_user:
        # Prevent timing attacks by running password verification even when user doesn't exist
        # This ensures the response time is similar whether or not the email exists
        await verify_password(password, DUMMY_HASH)
        return None

    verified, updated_password_hash = await verify_password(
        password, db_user.hashed_password
    )
    if not verified:
        return None
    if updated_password_hash:
        db_user.hashed_password = updated_password_hash
        session.add(db_user)
        await session.commit()
        await session.refresh(db_user)
    return db_user


async def create_product(
    *,
    session: AsyncSession,
    product_create: ProductCreate,
) -> Product:
    db_obj = Product.model_validate(
        product_create,
    )

    session.add(db_obj)
    await session.commit()
    await session.refresh(db_obj)
    return db_obj


async def get_product_by_name(
    *,
    session: AsyncSession,
    name: str,
) -> Product | None:
    statement = select(Product).where(Product.name == name)
    result = await session.execute(statement)
    product = result.scalars().first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )
    return product


async def get_products_paginated(
    *,
    session: AsyncSession,
    limit: int,
    offset: int,
):
    statement = select(Product).offset(offset).limit(limit)
    result = await session.execute(statement)
    result_scaled = result.scalars().all()
    return result_scaled


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


async def get_product_by_id(
    *,
    session: AsyncSession,
    product_id: uuid.UUID,
) -> Product:
    statement = select(Product).where(Product.id == product_id)
    result = await session.execute(statement)
    product = result.scalars().first()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    return product


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

import uuid
from datetime import datetime, timezone
from typing import Any

from pydantic_core.core_schema import nullable_schema
from sqlmodel import Column, Field, Relationship, SQLModel, String

from app.schemas.schema import OrderStatus, UserBase


class User(UserBase, table=True):
    __tablename__: Any = "User"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False,
    )
    hashed_password: str
    is_admin: bool = Field(default=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Product(SQLModel, table=True):
    __tablename__: Any = "Product"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False,
    )
    name: str = Field(unique=True, index=True)
    price: int
    description: str
    stock: int = Field(default=0, nullable=False)


class Order(SQLModel, table=True):
    __tablename__: Any = "Order"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False,
    )
    ordered_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    user_id: uuid.UUID = Field(foreign_key="User.id", nullable=False)
    total_price: int
    status: OrderStatus = Field(
        sa_column=Column(String, nullable=False, server_default="pending")
    )


class OrderItem(SQLModel, table=True):
    __tablename__: Any = "OrderItem"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False,
    )
    order_id: uuid.UUID = Field(
        foreign_key="Order.id",
        nullable=False,
    )
    product_id: uuid.UUID = Field(
        foreign_key="Product.id",
        nullable=False,
    )
    quantity: int = Field(nullable=False)
    price_at_purchase: int = Field(nullable=False)


class Cart(SQLModel, table=True):
    __tablename__: Any = "Cart"
    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False,
    )
    user_id: uuid.UUID = Field(
        foreign_key="User.id",
        nullable=False,
    )


class CartItem(SQLModel, table=True):
    __tablename__: Any = "CartItem"
    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False,
    )
    cart_id: uuid.UUID = Field(
        foreign_key="Cart.id",
        nullable=False,
    )
    product_id: uuid.UUID = Field(
        foreign_key="Product.id",
        nullable=False,
    )
    quantity: int

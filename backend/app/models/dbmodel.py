import uuid
from datetime import datetime, timezone
from typing import Any

from sqlmodel import Field, SQLModel

from app.schemas.schema import UserBase


class User(UserBase, table=True):
    __tablename__: Any = "User"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False,
    )
    password_hash: str
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


class Order(SQLModel, table=True):
    __tablename__: Any = "Order"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False,
    )
    ordered_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # thinking of making this the users and products link table cuz every user that is associated with the product is an order


class OrderItem(SQLModel, table=True):
    __tablename__: Any = "OrderItem"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False,
    )
    product_id: int = Field(foreign_key="Product.id", primary_key=True)
    user_id: int = Field(foreign_key="User.id", primary_key=True)
    quantity: int = Field(nullable=False)


class Cart(SQLModel, table=True):
    __tablename__: Any = "Cart"
    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False,
    )
    pass

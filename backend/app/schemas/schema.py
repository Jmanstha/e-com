import uuid
from datetime import datetime, timezone
from enum import Enum
from typing import Optional

from sqlmodel import Field, SQLModel


# base info for every user
class UserBase(SQLModel):
    username: str
    useremail: str = Field(unique=True, index=True)
    userphone: str = Field(unique=True, index=True)


# input schema to take in password
class UserCreate(UserBase):
    password: str


# output schema to show id maybe
class UserResponse(UserBase):
    id: uuid.UUID
    is_admin: bool


class Token(SQLModel):
    access_token: str
    token_type: str = Field(default="bearer")
    expires_in: int


class TokenPayload(SQLModel):
    sub: str | None = None


class ProductCreate(SQLModel):
    name: str
    price: int
    description: str
    category: str


class ProductDisplay(SQLModel):
    id: uuid.UUID
    name: str
    price: int
    description: str
    stock: int
    category: str
    image_url: str | None


class CartItemDisplay(SQLModel):
    id: uuid.UUID
    name: str
    quantity: int
    price: int
    product_id: uuid.UUID


class DisplayTotalPrice(SQLModel):
    total_price: int


class OrderStatus(str, Enum):
    PENDING = "pending"  # Order created, but money hasn't moved
    PAID = "paid"  # Money received
    SHIPPED = "shipped"  # Package with the courier
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class OrderItemDisplay(SQLModel):
    id: uuid.UUID
    name: str
    quantity: int
    status: OrderStatus
    date: datetime


class CartItemUpdate(SQLModel):
    # We use Field to ensure the quantity is at least 0
    quantity: int = Field(..., ge=0, description="The new quantity for the item")


class ProductUpdate(SQLModel):
    name: str | None = None
    price: int | None = None
    description: str | None = None
    stock: int | None = None
    category: str | None = None
    image_url: str | None = None


class CreateOrderRequest(SQLModel):
    phone_number: str
    latitude: float
    longitude: float
    address: str


class PaymentInitiate(SQLModel):
    order_id: uuid.UUID
    amount: int  # in paisa

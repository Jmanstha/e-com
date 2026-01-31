from typing import Any

from sqlmodel import SQLModel

from app.schemas.schema import ProductBase, UserBase


class UsersTable(UserBase, table=True):
    __tablename__: Any = "UsersTable"
    pass


# thinking of making this the users and products link table cuz every user that is associated with the product is an order
class OrdersTable(SQLModel, table=True):
    __tablename__: Any = "OrdersTable"
    pass


class ProductTable(ProductBase, table=True):
    __tablename__: Any = "ProductTable"
    pass

from sqlmodel import SQLModel


# base info for every user
class UserBase(SQLModel):
    pass


# base info for every Product
class ProductBase(SQLModel):
    pass


# input schema to take in password
class UserCreate(UserBase):
    pass


# output schema to show id maybe
class UserResponse(UserBase):
    pass

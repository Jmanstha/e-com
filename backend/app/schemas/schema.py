import uuid

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

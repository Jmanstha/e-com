import os
from datetime import datetime, timedelta, timezone
from typing import Any

import jwt
from dotenv import find_dotenv, load_dotenv
from pwdlib import PasswordHash

# Initialize with recommended Argon2 settings
password_hash = PasswordHash.recommended()

load_dotenv()
print(f"Loading .env from: {find_dotenv()}")

SECRET_KEY = os.getenv("SECRET_KEY")
print(f"SECRET_KEY: {SECRET_KEY}")

if SECRET_KEY is None:
    raise RuntimeError("SECRET_KEY env var is not set")

ALGORITHM = os.getenv("ALGORITHM")
if ALGORITHM is None:
    raise RuntimeError("ALGORITHM env var is not set")


async def get_password_hash(password: str) -> str:
    return password_hash.hash(password)


async def verify_password(
    plain_password: str, hashed_password: str
) -> tuple[bool, str | None]:
    return password_hash.verify_and_update(plain_password, hashed_password)


async def create_access_token(subject: str | Any, expires_delta: timedelta) -> str:
    expire = datetime.now(timezone.utc).replace(tzinfo=None) + expires_delta
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

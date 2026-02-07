from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI

from app.database import init_db
from app.endpoints import auth_routes, product_routes
from app.models.dbmodel import User
from app.services.deps import get_current_user


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(lifespan=lifespan)

app.include_router(auth_routes.router, prefix="/auth")
app.include_router(product_routes.router, prefix="/products")


@app.get("/")
async def root(
    user: User = Depends(get_current_user),
):
    return {"message": "E-com API is running"}

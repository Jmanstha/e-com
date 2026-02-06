from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.database import init_db
from app.endpoints import auth_routes, product_routes


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(lifespan=lifespan)

app.include_router(auth_routes.router, prefix="/auth")
app.include_router(product_routes.router, prefix="/products")


@app.get("/")
async def root():
    return {"message": "E-com API is running"}

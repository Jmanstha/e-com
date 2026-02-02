import uvicorn
from fastapi import FastAPI

from app.endpoints import auth_routes, product_routes

app = FastAPI()

app.include_router(auth_routes.router, prefix="/auth")
app.include_router(product_routes.router, prefix="/products")


@app.get("/")
async def root():
    return {"message": "E-com API is running"}

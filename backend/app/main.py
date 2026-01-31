from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI

from app.endpoints import auth_routes, product_routes

app = FastAPI()

app.include_router(auth_routes.router, prefix="/auth")
app.include_router(product_routes.router, prefix="/products")

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

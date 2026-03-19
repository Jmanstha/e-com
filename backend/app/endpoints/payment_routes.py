import os

import httpx
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException

from app.schemas.schema import PaymentInitiate

router = APIRouter()

load_dotenv()


# send a post requst to kpg with reuired info to get pidx and payment_rl
@router.post("/initiate")
async def initiate_kpg(data: PaymentInitiate):
    payload = {
        "return_url": "http://localhost:5173/payment/verify",
        "website_url": "http://localhost:5173",
        "amount": data.amount,
        "purchase_order_id": str(data.order_id),
        "purchase_order_name": str(data.order_id),  # or any string works for now
    }
    KHALTI_SECRET_KEY = os.getenv("KHALTI_SECRET_KEY")
    if KHALTI_SECRET_KEY is None:
        raise RuntimeError("KHALTI_INITIATE_URL env var not set")

    headers = {"Authorization": f"Key {KHALTI_SECRET_KEY}"}
    print(f"KEY: '{KHALTI_SECRET_KEY}'")

    KHALTI_INITIATE_URL = os.getenv("KHALTI_INITIATE_URL")
    if KHALTI_INITIATE_URL is None:
        raise RuntimeError("KHALTI_INITIATE_URL env var not set")

    async with httpx.AsyncClient() as client:
        res = await client.post(
            KHALTI_INITIATE_URL,
            json=payload,
            headers=headers,
        )
    return res.json()  # contains payment_url, pidx


# verify with kpg that the transation was complete
@router.post("/verify")
async def verify_payment(pidx: str):
    headers = {"Authorization": f"Key {os.getenv('KHALTI_SECRET_KEY')}"}

    KHALTI_VERIFY_URL = os.getenv("KHALTI_VERIFY_URL")
    if KHALTI_VERIFY_URL is None:
        raise RuntimeError("KHALTI_INITIATE_URL env var not set")

    async with httpx.AsyncClient() as client:
        res = await client.post(
            KHALTI_VERIFY_URL,
            json={"pidx": pidx},
            headers=headers,
        )
        data = res.json()
        # data.status == "Completed" means payment successful
        # update your order status here
        return data

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import time
import sqlite3
import pandas as pd
import os

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

tabla = None
if not os.path.exists("clients_credit.xlsx"):
    tabla = pd.DataFrame({"quantity": []})
else:
    tabla = pd.read_excel("clients_credit.xlsx", index_col=0)


@app.get("/")
def hello_world():
    return "Hello world!"


@app.post("/add_credit/")
def register_payment(payload: dict):
    account = payload.get("account")
    credit_card_number = payload.get("credit_card")
    cvv = payload.get("cvv")
    exp_date = payload.get("exp_date")
    quantity = int(payload.get("quantity"))

    cur_credit = 0
    try:
        cur_credit = tabla.loc[account, "quantity"].iloc[0]
    except Exception:
        ...

    cur_credit += quantity
    tabla.loc[account, "quantity"] = cur_credit
    tabla.to_excel("clients_credit.xlsx")

    print(account, quantity)
    return {"credits": quantity}


@app.get("/get_credit/")
def get_credits(payload: dict):
    account = payload.get("account")
    try:
        credits = tabla.loc[account, "quantity"].iloc[0]
        return {"credits": credits}
    except Exception:
        return {"credits": 0}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

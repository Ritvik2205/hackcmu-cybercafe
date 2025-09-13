import uvicorn
from fastapi import FastAPI
import json
import time
import sqlite3

app = FastAPI()


@app.get("/")
def hello_world():
    return "Hello world!"


@app.post("/payload")
def register_payment(payload: dict):
    account = payload.get("account")
    quantity = payload.get("quantity")

    print(account, quantity)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

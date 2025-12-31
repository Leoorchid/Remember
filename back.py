from fastapi import FastAPI
import sqlite3
from pydantic import BaseModel
import bcrypt

app = FastAPI()

conn = sqlite3.connect("mem.db")
cur = conn.cursor()
cur.execute(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password BLOB NOT NULL);"
)
conn.commit()
conn.close


def createAcc(username, password):
    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
    print(hashed)
    conn = sqlite3.connect("mem.db")
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO users (username,password) VALUES (?,?)",
        (username, hashed),
    )
    conn.commit()
    conn.close()
    signAcc(username, password)


def signAcc(username, password):
    conn = sqlite3.connect("mem.db")
    cur = conn.cursor()
    cur.execute(f"SELECT password FROM users WHERE username=?", (username,))
    storedHash = cur.fetchone()[0]
    if bcrypt.checkpw(password.encode(), storedHash):
        return {"message": "Win"}
    else:
        return {"message": "Fail"}


class Acc(BaseModel):
    username: str
    password: str


@app.get("/")
def root():
    return {"message": "Welcome"}


@app.post("/post/signAcc")
def psignAcc(acc: Acc):
    return signAcc(acc.username, acc.password)


@app.post("/post/createAcc")
def pcreateAcc(acc: Acc):
    return createAcc(acc.username, acc.password)


signAcc("Guest", "123456")

from fastapi import FastAPI
import sqlite3
from pydantic import BaseModel
import bcrypt
from typing import List, Dict
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["http://127.0.0.1:5500", "http://localhost:5500"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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


def delAcc(username):
    conn = sqlite3.connect("mem.db")
    cur = conn.cursor()
    cur.execute("DELETE FROM users WHERE username = ?", (username,))
    conn.commit()
    conn.close()


def delSet(name):
    conn = sqlite3.connect("cardset.db")
    cur = conn.cursor()
    cur.execute(f"DROP TABLE IF EXISTS {name}")
    conn.commit()
    conn.close()


def changeSet(num, term, definition, name, newName):
    conn = sqlite3.connect("cardset.db")
    cur = conn.cursor()
    cur.execute(f"UPDATE {name} SET term = ? WHERE id=?", (term, num))
    cur.execute(f"UPDATE {name} SET definition = ? WHERE id=?", (definition, num))
    cur.execute(f"ALTER TABLE {name} RENAME TO {newName}")
    conn.commit()
    conn.close()


class Acc(BaseModel):
    username: str
    password: str


class Card(BaseModel):
    num: int
    term: str
    definition: str


class CardSet(BaseModel):
    title: str
    user: str
    cards: List[Card]


class CardSetC(BaseModel):
    title: str
    newTitle: str
    cards: List[Card]


@app.get("/")
def root():
    return {"message": "Welcome"}


@app.post("/post/signAcc")
def psignAcc(acc: Acc):
    return signAcc(acc.username, acc.password)


@app.post("/post/createAcc")
def pcreateAcc(acc: Acc):
    return createAcc(acc.username, acc.password)


@app.post("/post/deleteAcc")
def pdelAcc(acc: Acc):
    return delAcc(acc.username)


@app.post("/post/createSet")
def createSet(cardset: CardSet):
    conn = sqlite3.connect("cardset.db")
    cur = conn.cursor()

    cur.execute(
        f"CREATE TABLE IF NOT EXISTS {cardset.user} (id INTEGER, title TEXT , term TEXT NOT NULL, definition TEXT NOT NULL);"
    )
    conn.commit()

    cur.execute(f"SELECT id FROM {cardset.user}")
    row = cur.fetchall()
    if row != []:
        idNum = row[len(row) - 1][0] + 1

    else:
        idNum = 1
    conn.commit()
    cur.execute(f"DELETE FROM {cardset.user} WHERE title=?", (cardset.title,))
    cur = conn.cursor()
    try:
        for card in cardset.cards:
            cur.execute(
                f"INSERT INTO {cardset.user} (id,title,term,definition) VALUES(?,?,?,?)",
                (idNum, cardset.title, card.term, card.definition),
            )
        conn.commit()
        conn.close()
    except Exception as e:
        print(e)
        print("Failed")
        return
    else:

        print("Saved")
    return


@app.post("/post/delSet")
def pdelSet(cardSet: CardSet):
    delSet(cardSet.title)


@app.post("/post/changeSet")
def pchangeSet(cardSet: CardSetC):
    for card in cardSet.cards:
        print(card.num, card.term, card.definition, cardSet.title, cardSet.newTitle)
        changeSet(card.num, card.term, card.definition, cardSet.title, cardSet.newTitle)


@app.get("/get/viewCard")
def viewCard(user: str):
    conn = sqlite3.connect("cardset.db")
    cur = conn.cursor()
    cur.execute(f"SELECT * FROM {user}")
    rows = cur.fetchall()
    lastrow = -10000
    obj = {}
    for i, row in enumerate(rows):

        if row[0] == lastrow:
            obj[row[1]][row[2]] = row[3]
        else:
            obj[row[1]] = {row[2]: row[3]}
        lastrow = row[0]
    print(obj)
    return obj

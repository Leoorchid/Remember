from fastapi import FastAPI
import sqlite3
from pydantic import BaseModel
import bcrypt
from typing import List, Dict

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


def delAcc(username):
    conn = sqlite3.connect("mem.db")
    cur = conn.cursor()
    cur.execute("DELETE FROM users WHERE username = ?", (username,))
    conn.commit()
    conn.close()


def delSet(name):
    conn = sqlite3.connect("cards.db")
    cur = conn.cursor()
    cur.execute(f"DROP TABLE IF EXISTS {name}")
    conn.commit()
    conn.close()


def changeSet(num, term, definition, name, newName):
    conn = sqlite3.connect("cards.db")
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
    conn = sqlite3.connect("cards.db")
    cur = conn.cursor()
    cur.execute(
        f"CREATE TABLE IF NOT EXISTS {cardset.title} (id INTEGER PRIMARY KEY , term TEXT UNIQUE NOT NULL, definition TEXT NOT NULL);"
    )
    conn.commit()
    conn.close
    cur = conn.cursor()
    try:
        for card in cardset.cards:
            cur.execute(
                f"INSERT INTO {cardset.title} (id,term,definition) VALUES(?,?,?)",
                (card.num, card.term, card.definition),
            )
        conn.commit()
        conn.close()
    except ():
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

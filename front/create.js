cardSetDiv = document.getElementById("cardSetDiv")
saveBtn = document.getElementById("saveBtn")
addCardBtn = document.getElementById("addCardBtn")
titleInput = document.getElementById("titleInput")





let cardSet = {
    title: "",
    user: "Leo",
    cards: []
}
let idNum = 1


function onStart() {

}

class Card {

    constructor(term, def) {
        this.term = term
        this.definition = def
        this.num = idNum

        const newCard = document.createElement("div")

        this.card = newCard

        const cardTermBox = document.createElement("div")
        const cardTerm = document.createElement("textarea")
        const cardTermLabel = document.createElement("div")
        cardTermLabel.innerText = "Term"
        cardTermBox.append(cardTermLabel, cardTerm)

        const cardDefBox = document.createElement("div")
        const cardDef = document.createElement("textarea")
        const cardDefLabel = document.createElement("div")
        cardDefLabel.innerText = "Definition"
        cardDefBox.append(cardDefLabel, cardDef)

        newCard.classList.add("card")
        cardTerm.classList.add("cardInput", "cardTerm")
        cardDef.classList.add("cardInput", "cardDef")
        cardTermBox.classList.add("cardInputBox", "cardTermBox")
        cardDefBox.classList.add("cardInputBox", "cardDefBox")

        cardTerm.placeholder = term
        cardDef.placeholder = def

        cardTerm.addEventListener("input", (event) => {
            this.term = this.card.querySelector(".cardTerm").value
            cardSet.cards[this.num - 1].term = this.term




        })
        cardDef.addEventListener("input", (event) => {
            this.definition = this.card.querySelector(".cardDef").value
            cardSet.cards[this.num - 1].definition = this.definition
        })

        newCard.appendChild(cardTermBox)
        newCard.appendChild(cardDefBox)

        cardSetDiv.appendChild(newCard)

        idNum++




        cardSet.cards.push({
            "num": this.num,
            "term": this.term,
            "definition": this.definition
        })



    }

}

function createCard() {
    new Card("", "")

}


createCard()

addCardBtn.addEventListener("click", () => {
    createCard()
})

saveBtn.addEventListener("click", () => {
    console.log(cardSet.cards)
    data = {}
    cardSet.title = titleInput.value
    fetch("http://127.0.0.1:8000/post/createSet", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cardSet)

    })

})
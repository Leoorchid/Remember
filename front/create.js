const cardSetDiv = document.getElementById("cardSetDiv")
const saveBtn = document.getElementById("saveBtn")
const addCardBtn = document.getElementById("addCardBtn")
const titleInput = document.getElementById("titleInput")
const descInput = document.getElementById("descInput")
const cardsCount = document.getElementById("cardsCount")

let cardSet = {
    title: "",
    description: "",
    subject: "",
    visibility: "private",
    user: "Leo",
    cards: []
}
let idNum = 1

// ── Auto-grow textareas ──
function autoGrow(el) {
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
}

// ── Char counters ──
function bindCounter(inputId, counterId, max) {
    const input = document.getElementById(inputId)
    const counter = document.getElementById(counterId)
    if (!input || !counter) return
    input.addEventListener('input', () => {
        const len = input.value.length
        counter.textContent = `${len} / ${max}`
        counter.className = 'char-count' + (len >= max ? ' over' : len > max * 0.9 ? ' warn' : '')
    })
}
bindCounter('titleInput', 'titleCount', 80)
bindCounter('descInput', 'descCount', 240)
descInput.addEventListener('input', () => autoGrow(descInput))

// ── Update card count badge ──
function updateCount() {
    const n = cardSet.cards.length
    cardsCount.textContent = `${n} card${n !== 1 ? 's' : ''}`
}

// ── Card class ──
class Card {
    constructor(term, def) {
        this.term = term
        this.definition = def
        this.num = idNum

        // Wrapper
        const newCard = document.createElement("div")
        newCard.classList.add("card-item")
        this.card = newCard

        // Header row (number + delete button)
        const cardHeader = document.createElement("div")
        cardHeader.classList.add("card-header")

        const cardNumber = document.createElement("div")
        cardNumber.classList.add("card-number")
        cardNumber.innerText = `Card ${String(this.num).padStart(2, '0')}`

        const removeBtn = document.createElement("button")
        removeBtn.classList.add("btn-delete-card")
        removeBtn.setAttribute("type", "button")
        removeBtn.setAttribute("aria-label", "Delete card")
        removeBtn.innerText = "✕"
        removeBtn.addEventListener("click", () => {
            cardSet.cards = cardSet.cards.filter(c => c.num !== this.num)
            newCard.remove()
            // Re-number remaining cards
            document.querySelectorAll('.card-number').forEach((el, i) => {
                el.textContent = `Card ${String(i + 1).padStart(2, '0')}`
            })
            updateCount()
        })

        cardHeader.append(cardNumber, removeBtn)

        // Term box
        const cardTermBox = document.createElement("div")
        const cardTerm = document.createElement("textarea")
        const cardTermLabel = document.createElement("div")
        cardTermLabel.innerText = "Term"
        cardTermBox.append(cardTermLabel, cardTerm)

        // Def box
        const cardDefBox = document.createElement("div")
        const cardDef = document.createElement("textarea")
        const cardDefLabel = document.createElement("div")
        cardDefLabel.innerText = "Definition"
        cardDefBox.append(cardDefLabel, cardDef)

        // Classes
        cardTerm.classList.add("cardInput", "cardTerm")
        cardDef.classList.add("cardInput", "cardDef")
        cardTermBox.classList.add("cardInputBox", "cardTermBox")
        cardDefBox.classList.add("cardInputBox", "cardDefBox")

        cardTerm.placeholder = "Enter term…"
        cardDef.placeholder = "Enter definition…"
        cardTerm.rows = 1
        cardDef.rows = 1

        // Listeners
        cardTerm.addEventListener("input", () => {
            autoGrow(cardTerm)
            const entry = cardSet.cards.find(c => c.num === this.num)
            if (entry) entry.term = cardTerm.value
        })
        cardDef.addEventListener("input", () => {
            autoGrow(cardDef)
            const entry = cardSet.cards.find(c => c.num === this.num)
            if (entry) entry.definition = cardDef.value
        })

        newCard.append(cardHeader, cardTermBox, cardDefBox)
        cardSetDiv.appendChild(newCard)

        idNum++

        cardSet.cards.push({
            num: this.num,
            term: this.term,
            definition: this.definition
        })
        updateCount()
    }
}

function createCard() {
    new Card("", "")
}

// Start with one blank card
createCard()

addCardBtn.addEventListener("click", () => {
    createCard()
    // Scroll to new card
    cardSetDiv.lastElementChild.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    })
})

saveBtn.addEventListener("click", () => {
    cardSet.title = titleInput.value
    cardSet.description = descInput.value
    cardSet.subject = document.getElementById("subjectInput").value
    cardSet.visibility = document.getElementById("visibilityInput").value

    console.log(cardSet)

    fetch("http://127.0.0.1:8000/post/createSet", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cardSet)
    })
})
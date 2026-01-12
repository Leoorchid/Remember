setHolder = document.getElementById("setholder")
viewHolder = document.getElementById("viewholder")
testViewBtn = document.getElementById("TestView")
FlashCardView = document.getElementById("FlashCardView")
viewSwitchDiv = document.querySelector(".view-switch")
cardContainer = document.getElementById("CardContainer")

console.log(viewSwitchDiv)
async function loadSet(user = "Leo") {
    const re = await fetch(`http://127.0.0.1:8000/get/viewCard?user=${user}`)
    const data = await re.json()
    console.log(data)

    viewCardPreview(data)
}

function viewCardPreview(data) {
    for (const key in data) {
        const length = Object.keys(data[key]).length
        console.log(length)

        const setDiv = document.createElement("div")
        setDiv.className = "setDiv"
        setDiv.addEventListener("click", () => {
            setHolder.style.display = "none"
            viewSwitchDiv.style.display = "inline-flex"
            viewCard(data[key], key)
        })

        const titleDiv = document.createElement("div")
        titleDiv.className = "titleDiv"
        titleDiv.innerText = key
        setDiv.append(titleDiv)

        const numDiv = document.createElement("div")
        numDiv.className = "numDiv"
        numDiv.innerText = length
        setDiv.append(numDiv)

        setHolder.append(setDiv)

    }
}

function viewCard(data, title) {

    for (const key in data) {
        const cardDiv = document.createElement("div")
        cardDiv.className = "cardDiv"


        const termDiv = document.createElement("div")
        termDiv.className = "termDiv"
        termDiv.innerText = key
        cardDiv.append(termDiv)

        const defDiv = document.createElement("div")
        defDiv.className = "defDiv"
        defDiv.innerText = data[key]

        cardDiv.append(defDiv)
        cardContainer.append(cardDiv)


        testViewBtn.addEventListener("click", () => {
            cardContainer.style.display = "none"
            //DO NEXT randomize test sheet

        })


    }




}






loadSet()
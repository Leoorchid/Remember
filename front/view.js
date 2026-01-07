setHolder = document.getElementById("setholder")
viewHolder = document.getElementById("viewholder")


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

        setDiv = document.createElement("div")
        setDiv.className = "setDiv"
        setDiv.addEventListener("click", () => {
            setHolder.style.display = "none"
            viewHolder.style.display = "block"
            viewCard(data[key], key)
        })

        titleDiv = document.createElement("div")
        titleDiv.className = "titleDiv"
        titleDiv.innerText = key
        setDiv.append(titleDiv)

        numDiv = document.createElement("div")
        numDiv.className = "numDiv"
        numDiv.innerText = length
        setDiv.append(numDiv)

        setHolder.append(setDiv)

    }
}

function viewCard(data, title) {
    for (const key in data) {
        cardDiv = document.createElement("div")
        cardDiv.className = "cardDiv"


        termDiv = document.createElement("div")
        termDiv.className = "termDiv"
        termDiv.innerText = key
        cardDiv.append(termDiv)

        defDiv = document.createElement("div")
        defDiv.className = "defDiv"
        defDiv.innerText = data[key]

        cardDiv.append(defDiv)

        viewHolder.append(cardDiv)


    }




}



loadSet()
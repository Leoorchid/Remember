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


        


    }

    testViewBtn.addEventListener("click", () => {
        cardContainer.style.display = "none"
        let arrTerms = []
        let arrDefs = []
        //DO NEXT randomize test sheet
        i =1
        for(const key in data){
            
            arrTerms.push(key)
            arrDefs.push(data[key])
            
        }
        
        



        //-----------------

        const testSheet = document.createElement("div")
        document.body.append(testSheet)

        arrTerms.forEach(term => {
            let defs = [data[term]]
            let copyDefs = arrDefs.slice()
            
            let questionDiv = document.createElement("div")


            let question = document.createElement("div")
            question.innerText = term

            field = document.createElement("fieldset")
            let a1D = document.createElement("div")
            let a1 = document.createElement("input")
            a1.type = "radio"
            let a1L = document.createElement("label")
            

            a1D.append(a1)
            a1D.append(a1L)

            let a2D = document.createElement("div")
            let a2 = document.createElement("input")
            a2.type = "radio"
            let a2L = document.createElement("label")

            

            a2D.append(a2)
            a2D.append(a2L)

            let a3D = document.createElement("div")
            let a3 = document.createElement("input")
            a3.type = "radio"
            let a3L = document.createElement("label")

           

            a3D.append(a3)
            a3D.append(a3L)
            let a4D = document.createElement("div")
            let a4 = document.createElement("input")
            a4.type = "radio"
            let a4L = document.createElement("label")

            
            
            
            
            let rng 
            while(true){
                rng = copyDefs.splice(Math.ceil(Math.random()*copyDefs.length)-1,1)
                if(rng!=data[term]){
                    defs.push(rng[0])
                    break
                } 
            }
            while(true){
                rng = copyDefs.splice(Math.ceil(Math.random()*copyDefs.length)-1,1)
                if(rng!=data[term]){
                    defs.push(rng[0])
                    break
                }   
            }
            while(true){
                rng = copyDefs.splice(Math.ceil(Math.random()*copyDefs.length)-1,1)
                if(rng!=data[term]){
                    defs.push(rng[0])
                    break
                }
            }

            a1L.innerText = defs.pop(Math.ceil(Math.random()*defs.length-1))
            a2L.innerText = defs.pop(Math.ceil(Math.random()*defs.length-1))
            a3L.innerText = defs.pop(Math.ceil(Math.random()*defs.length-1))
            a4L.innerText = defs.pop(Math.ceil(Math.random()*defs.length-1))
            
            
            
            

            console.log(defs)
                
                
                
            

            a4D.append(a4)
            a4D.append(a4L)

            questionDiv.append(question)
            field.append(a1D)
            field.append(a2D)
            field.append(a3D)
            field.append(a4D)
            questionDiv.append(field)

            document.body.append(questionDiv)
            

        });


    })


}






loadSet()
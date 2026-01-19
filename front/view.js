const setHolder = document.getElementById("setholder")
const viewHolder = document.getElementById("viewholder")
const testViewBtn = document.getElementById("TestView")
const FlashCardView = document.getElementById("FlashCardView")
const viewSwitchDiv = document.querySelector(".view-switch")
const cardContainer = document.getElementById("CardContainer")


async function loadSet(user = "Leo") {
    const re = await fetch(`http://127.0.0.1:8000/get/viewCard?user=${user}`)
    const data = await re.json()
    console.log(data)

    viewCardPreview(data)
}

function viewCardPreview(data) {
    for (const key in data) {
        const length = Object.keys(data[key]).length
        

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

    //Make Test
    testViewBtn.addEventListener("click", () => {
        console.log("running test")
        cardContainer.style.display = "none"
        let arrTerms = []
        let arrDefs = []
        let i = 1
        for(const key in data){
            
            arrTerms.push(key)
            arrDefs.push(data[key])
            
        }
        
        



        //----------------

        const testSheet = document.createElement("div")
        document.body.append(testSheet)
        let rightArr = {}
        let tempArrTerms = arrTerms.slice()
        

        let copyArrTerms = []
        lengthOftemp = tempArrTerms.length
        for(let i =0;i<lengthOftemp;i++){
            let rng = Math.ceil(Math.random()*tempArrTerms.length-1)
            copyArrTerms.push(tempArrTerms.splice(rng,1))
            
        }
        
        
        copyArrTerms.forEach(term => {
            let defs = [data[term]]
            let copyDefs = arrDefs.slice()
            rightArr[term] = data[term]
            
            
            
            let questionDiv = document.createElement("div")


            let question = document.createElement("div")
            question.innerText = term

            let field = document.createElement("fieldset")
            let a1D = document.createElement("div")
            let a1 = document.createElement("input")
            a1.type = "radio"
            a1.name = term
            let a1L = document.createElement("label")
            

            a1D.append(a1)
            a1D.append(a1L)

            let a2D = document.createElement("div")
            let a2 = document.createElement("input")
            a2.type = "radio"
            a2.name = term
            let a2L = document.createElement("label")

            

            a2D.append(a2)
            a2D.append(a2L)

            let a3D = document.createElement("div")
            let a3 = document.createElement("input")
            a3.type = "radio"
            a3.name = term
            let a3L = document.createElement("label")

           

            a3D.append(a3)
            a3D.append(a3L)
            let a4D = document.createElement("div")
            let a4 = document.createElement("input")
            a4.type = "radio"
            a4.name = term
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
           
            a = defs.pop(Math.ceil(Math.random()*defs.length-1))
            b = defs.pop(Math.ceil(Math.random()*defs.length-1))
            c = defs.pop(Math.ceil(Math.random()*defs.length-1))
            d = defs.pop(Math.ceil(Math.random()*defs.length-1))

            a1L.innerText = a
            a1.value = a
            a2L.innerText = b
            a2.value = b
            a3L.innerText = c
            a3.value = c
            a4L.innerText = d
            a4.value = d
            
            
            
            

           
                
                
                
            

            a4D.append(a4)
            a4D.append(a4L)

            questionDiv.append(question)
            field.append(a1D)
            field.append(a2D)
            field.append(a3D)
            field.append(a4D)
            questionDiv.append(field)

            
            testSheet.append(questionDiv)
            

        });
            let submitTestBtn = document.createElement("button")
            submitTestBtn.style.width = "10%"
            submitTestBtn.style.height = "10%"
            submitTestBtn.innerText = "Submit"
            submitTestBtn.style.display = "block"
            testSheet.append(submitTestBtn)
            submitTestBtn.id = "submitTestBtn"
            

            submitTestBtn.addEventListener("click",()=>{
                let picks = document.querySelectorAll("input:checked")
                numRight = 0
                for(const pick of picks){
                    console.log(pick.value)
                    if (rightArr[pick.name]==pick.value)
                    {
                        
                        numRight++
                        
                    }
                console.log(numRight)

                }

                testSheet.style.display = "none"
                console.log(`SCORE: ${NnumRight }`)
                
                
            })

    })


}



function sumbit(){
    return
}


loadSet()
createBtn = document.getElementById("createBtn")
viewBtn = document.getElementById("viewBtn")



createBtn.addEventListener("click", () => {
    window.location.href = "create.html"
})

arr = ["a","b","c","d","e"]

arr.forEach(l => {
    rng = Math.ceil(Math.random()*5)
    console.log(rng)
     a= arr.pop(rng)
     console.log(a)
    
});
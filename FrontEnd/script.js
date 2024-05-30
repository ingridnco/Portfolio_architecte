

async function apiRequestWorks() {
    const url = "http://localhost:5678/api/works/"
    const response = await fetch(url)
    const gallery= await response.json()

    let divGallery =document.querySelector(".gallery")
            let galleryPictures = ""
        gallery.forEach(item=>{
            galleryPictures +=
                `<figure id="${item.id}" class="cat${item.categoryId} cat0">
                <img src="${item.imageUrl}">
                <figcaption>${item.title}</figcaption>
                </figure>` 
        })
        divGallery.innerHTML = galleryPictures

}
apiRequestWorks()

/*****************************************************************/

async function apiRequestCategory() {
    const url = "http://localhost:5678/api/categories/"
    const response = await fetch(url)
        const categories= await response.json()
      

    let filtersContainer = document.createElement('div')
    let divGallery =document.querySelector(".gallery")
    divGallery.parentNode.insertBefore(filtersContainer, divGallery)
    filtersContainer.classList.add("filtersContainer")

    const catSet = new Set()
    for (let cat of categories){
    catSet.add(cat.name)
    }

    const catArray = Array.from(catSet)
    let filters = `
        <div id="btnCat0" class="btnActive">Tous</div>`
        for(i=0; i<catArray.length;i++){
        filters+=`<div id="btnCat${[i+1]}">${catArray[i]}</div>`
        }

    filtersContainer.innerHTML = filters

        let figures= document.querySelectorAll(".gallery figure")
        figures.forEach(fig=>{
            fig.classList.remove("hidden")
        })
     
    function afficherCategories(btnCat,classeCat){
        btnCat= document.getElementById(btnCat)
            btnCat.addEventListener("click",()=>{ 
            let figures= document.querySelectorAll(".gallery figure")
            figures.forEach(fig=>{
                if(fig.classList.contains(classeCat)){
            fig.classList.remove("hidden")
                }else {
            fig.classList.add("hidden")
                }
            })
        })
    }

    for (let i= 0;i<4;i++){
    afficherCategories("btnCat"+i,"cat"+i)
    }

    let btnCat =[]
    for (let i=0;i<4;i++){
        btnCat[i] =document.getElementById("btnCat"+i)
        }

    function btnClick(event) {
        btnCat.forEach(btn => {
            btn.classList.remove("btnActive")
        })
        event.target.classList.add("btnActive")
    }

    btnCat.forEach(btn => {
        btn.addEventListener("click", btnClick)
    })

  
    }

apiRequestCategory()  




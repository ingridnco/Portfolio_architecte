/*****************appel API Works**************************/
async function apiRequestWorks() {
    try {    
        const url = "http://localhost:5678/api/works/"
        const response = await fetch(url)
        const gallery = await response.json()

        let divGallery = document.querySelector("#portfolio .gallery")
        let galleryPictures = ""
        gallery.forEach(item => 
            galleryPictures += `<figure id = "${item.id}" class = "cat${item.categoryId} cat0">
                <img src = "${item.imageUrl}">
                <figcaption>${item.title}</figcaption>
                </figure>`
        )

        divGallery.innerHTML = galleryPictures   
    } catch (error) {
        console.log("Erreur dans la création de la gallery : ", error.message)
    }
}
apiRequestWorks()

/********************appel API Categories**********************/
async function apiRequestCategories() {
    let categories
    try {
        const url = "http://localhost:5678/api/categories/"
        const response = await fetch(url)
        categories = await response.json()
    } catch (error) {
        console.log("Erreur dans l'appel à l'API : ", error.message)    
    }  

    try{
        let filtersContainer = document.createElement("div")
        let divGallery = document.querySelector(".gallery")
        divGallery.parentNode.insertBefore(filtersContainer, divGallery)
        filtersContainer.classList.add("filtersContainer")

        //récupération des 3 catégories
        const catSet = new Set()
        for (let cat of categories) {
            catSet.add(cat.name)
        }

        //création des boutons filtres
        const catArray = [...catSet] //copie vraie du tableau
        let filtersBtn=`
            <div id="btnCat0" class="btnActive">Tous</div>`
        for (let i = 0; i < catArray.length; i++) {
            filtersBtn += `<div id="btnCat${[i + 1]}">${catArray[i]}</div>`
        }
        filtersContainer.innerHTML = filtersBtn
            
    } catch (error) {
        console.log("Erreur dans la création des boutons filtres : ", error.message)    
    }   
}

async function filtrerCategories() { 
   await apiRequestCategories()
    try{
    let btnCat = [] 
        for (let i = 0; i < 4; i++) {
            btnCat[i] = document.getElementById("btnCat" + i)

            function filterCategories(event) {
                let figures = Array.from(document.querySelectorAll(".gallery figure"))
                let filterFigures = figures.filter(fig => fig.classList.contains("cat" + i))
                
                figures.forEach(fig => fig.style.display ="none")   //efface tous les travaux
                filterFigures.forEach(fig => fig.style.display ="block")   //affiche les travaux filtrés
            
                btnCat.forEach(btn => btn.classList.remove("btnActive"))
                event.currentTarget.classList.add("btnActive")
            }
            btnCat[i].addEventListener("click", filterCategories)
        }
    } catch (error) {
        console.log("Erreur dans l'action des boutons filtres : ", error.message)    
    }  
}

 async function tokenLocalStorage(){
     await filtrerCategories()
    let tokenStorage = window.localStorage.getItem("token")
    let logout

    try{
        if (tokenStorage !== null) {
        console.log("storageLocal ok : " + tokenStorage)

        let header=document.querySelector("header")
        header.style.marginTop ="100px"

        logout = document.querySelector(".logout")
        logout.classList.remove("hidden")

        const login = document.querySelector(".login")
        login.classList.add("hidden")

        const blackBanner = document.querySelector(".edit")
        blackBanner.classList.remove("hidden")

        const modifProjet = document.querySelector(".btnModifier")
        modifProjet.classList.remove("hidden")

        const filtersBar = document.querySelector(".filtersContainer")
        filtersBar.classList.add("hidden")

    } else {
        throw new Error("token non sauvegardé")
    }
    } catch (error) {
        console.log("Gestion du token : ", error.message)    
    }  

    try {
        logout.addEventListener("click", () => {
            window.localStorage.removeItem("token")
            window.location.reload()
            let header=document.querySelector("header")
            header.style.marginTop ="50px"
        })
    } catch (error) {
        console.log("Déconnecté")
    }
}
tokenLocalStorage()


async function apiRequestModale() {
    try {        
    const url = "http://localhost:5678/api/works/"
    const response = await fetch(url)
    const gallery = await response.json()

    let divGallery = document.querySelector(".galleryModale")
    let galleryPictures = ""
    gallery.forEach(item => 
        galleryPictures += `<figure id = "${item.id}" class = "cat${item.categoryId} cat0"><div class="trashIcon"><i class="fa-solid fa-sm fa-trash-can"></i></div>
            <img src = "${item.imageUrl}">
            </figure>`
    )

    divGallery.innerHTML = galleryPictures   
    
    } catch (error) {
        console.log("Erreur dans la création de la modale : ", error.message)
    }
}
apiRequestModale()


try{
    let modale=document.getElementById("modale")

    function afficherModale(){
        modale.style.display="flex"
    }

    function fermerModale(){
        modale.style.display="none"
    }

    let btnModifier=document.querySelector(".btnModifier")
    btnModifier.addEventListener("click",afficherModale)

    let faXmark=document.querySelector(".fa-xmark")
    faXmark.addEventListener("click",fermerModale)

    modale.addEventListener("click", (event)=> {
        if (event.target.id==="modale") {
            fermerModale()  
        }
    })
} catch (error) {
    console.log("Erreur dans la gestion de la modale : ", error.message)
}



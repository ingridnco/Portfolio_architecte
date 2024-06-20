/*****************appel API Works**************************/
async function apiRequestWorks() {
    try{
        const url = "http://localhost:5678/api/works/"
        const response = await fetch(url)
        let gallery = await response.json()
        return gallery
    } catch (error) {
        console.log("Erreur dans l'appel à l'API : ", error.message)    
    }  
}

function createGallery(gallery) {
    try{    
        let divGallery = document.querySelector("#portfolio .gallery")
        divGallery.innerHTML = ""

        let galleryPictures=""
        gallery.forEach(item => {          
            galleryPictures += 
                `<figure id = "${item.id}" class = "cat${item.categoryId} cat0">
                <img src = "${item.imageUrl}">
                <figcaption>${item.title}</figcaption>
                </figure>`     
        })
        divGallery.innerHTML = galleryPictures 
    } catch (error) {
        console.log("Erreur dans la création de la gallery : ", error.message)
    }
}

/********************appel API Categories**********************/
async function apiRequestCategories() {
    try {
        const url = "http://localhost:5678/api/categories/"
        const response = await fetch(url)
        let categories = await response.json()
        return categories
    } catch (error) {
        console.log("Erreur dans l'appel à l'API : ", error.message)    
    }  
}

function createCategories(categories){
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
        categories = [...catSet] //copie vraie du tableau
        let filtersBtn=
            `<div id="btnCat0" class="btnActive">Tous</div>`
        for (let i = 0; i < categories.length; i++) {
            filtersBtn += 
            `<div id="btnCat${[i + 1]}">${categories[i]}</div>`
        }
        filtersContainer.innerHTML = filtersBtn
         
    } catch (error) {
        console.log("Erreur dans la création des boutons filtres : ", error.message)    
    }   
}

function filterCategories() {
    try{
        let btnCat = [] 
        for (let i = 0; i < 4; i++) {
            btnCat[i] = document.getElementById("btnCat" + i)
            btnCat[i].addEventListener("click", event => {
                let figures = Array.from(document.querySelectorAll(".gallery figure"))
                figures.forEach(fig => fig.style.display ="none") //masque tous les travaux
                let filterFigures = figures.filter(fig => fig.classList.contains("cat" + i))
                filterFigures.forEach(fig => fig.style.display ="block")   //affiche les travaux filtrés

                btnCat.forEach(btn => btn.classList.remove("btnActive"))
                event.currentTarget.classList.add("btnActive")
            })
        }
    } catch (error) {
        console.log("Erreur dans l'action des boutons filtres : ", error.message)    
    }  
}

function tokenLocalStorage(){
    let tokenStorage = window.localStorage.getItem("token")
    let logout

    try{
        if (tokenStorage !== null) {
            console.log("storageLocal ok : " + tokenStorage)
            let header=document.querySelector("header")
            header.style.marginTop ="100px"

            //afficher les éléments admin:
            logout = document.querySelector(".logout") //bouton logout
            logout.classList.remove("hidden")
            const blackBanner = document.querySelector(".edit")//bandeau noir au-dessus du header
            blackBanner.classList.remove("hidden")
            const modifProjet = document.querySelector(".btnModifier")//bouton modifier
            modifProjet.classList.remove("hidden")

            //masquer les éléments :
            const filtersBar = document.querySelector(".filtersContainer")//boutons filtres
            filtersBar.classList.add("hidden")
            const login = document.querySelector(".login")//bouton login
            login.classList.add("hidden")

        } else {
            throw new Error("token non sauvegardé")
        }
    } catch (error) {
        console.log("Gestion du token : ", error.message)    
    }  
    //gestion du logout:
    try {
        logout.addEventListener("click", () => {
            window.localStorage.removeItem("token")
            let header=document.querySelector("header")
            header.style.marginTop ="50px"
            location.reload()
        })
    } catch (error) {
        console.log("Déconnecté")
    }
    
}

function createModale(gallery){
    try{
        let divGalleryModale = document.querySelector(".galleryModale")
        divGalleryModale.innerHTML = ""
        
        let modaleGallery = ""
        gallery.forEach(item => {
            modaleGallery += 
                    `<figure id="mod-${item.id}" class="cat${item.categoryId} cat0"><div class="trashIcon"><i id = "${item.id}" class="fa-solid fa-sm fa-trash-can"></i></div>
                    <img src="${item.imageUrl}">
                    </figure>`
        })
        divGalleryModale.innerHTML = modaleGallery
    } catch (error) {
        console.log("Erreur dans la création de la modale : ", error.message)
    }
}

function gererModale(){

    try{//afficher la modale en cliquant sur modifier
        let modale=document.getElementById("modaleContainer")
        let btnModifier=document.querySelector(".btnModifier")
        btnModifier.addEventListener("click",() =>{ 
            modale.style.display="flex"
            //toujours afficher la page suppression de la modale en premier
            let modaleDeleteWorks=document.querySelector(".modaleDeleteWorks")
            modaleDeleteWorks.classList.remove("hidden")
            let modaleAddWorks=document.querySelector(".modaleAddWorks")
            modaleAddWorks.classList.add("hidden")      
        })

        function fermerModale(){
            modale.style.display="none"
        }
        //fermer en cliquant sur la croix
        document.querySelectorAll(".fa-xmark")
                .forEach(mark=>mark.addEventListener("click",fermerModale))
        //fermer en cliquant en dehors de la modale
        modale.addEventListener("click", event => {
            if (event.target.id==="modaleContainer") {
                fermerModale()  
            }   
        })
        let btnAddPhoto=document.querySelector(".btnAddPhoto")
        let modaleDeleteWorks=document.querySelector(".modaleDeleteWorks")
        let modaleAddWorks=document.querySelector(".modaleAddWorks")
        btnAddPhoto.addEventListener("click",()=>{  
            modaleDeleteWorks.classList.add("hidden")
            modaleAddWorks.classList.remove("hidden")
        })

    } catch (error) {
        console.log("Erreur dans la gestion de la modale : ", error.message)
    }
}

function setDeleteBtns(gallery){
    try{  
        const btnSuppr = document.querySelectorAll(".trashIcon i")
        btnSuppr.forEach(btn=>{
            btn.addEventListener("click", async event =>{
                let button = event.currentTarget
                let tokenStorage = window.localStorage.getItem("token") 
            
                let url = `http://localhost:5678/api/works/${button.id}`
                const response =  await fetch(url, {
                    method: "DELETE",
                    headers: { 
                        "Authorization": `Bearer ${tokenStorage}`, 
                        "Accept": "*/*" 
                    }
                })

                if(response.ok){
                    gallery=gallery.filter(item=>item.id !== Number(button.id))
                    console.log('gallery:', gallery)
                    createGallery(gallery)
                    createModale(gallery)
                    setDeleteBtns(gallery)
                    
                }else{
                    throw new Error("l'API ne reconnaît pas ce fichier.")
                }
            })
        })
    } catch (error) {
        console.log("Impossible d'effacer :", error.message)
    } 
            
}

async function appels(){
    let gallery = await apiRequestWorks()
    createGallery(gallery)
    let categories = await apiRequestCategories()
    createCategories(categories)
    filterCategories() 
    tokenLocalStorage()
    createModale(gallery)
    gererModale()
    setDeleteBtns(gallery)

}
    
appels()

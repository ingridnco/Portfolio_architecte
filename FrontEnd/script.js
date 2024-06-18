//let gallery=[]
//let categories=[]
/*****************appel API Works**************************/
async function apiRequestWorks() {
    try{
        const url = "http://localhost:5678/api/works/"
        const response = await fetch(url)
        const gallery = await response.json()
        return gallery
    } catch (error) {
        console.log("Erreur dans l'appel à l'API : ", error.message)    
    }  
}

async function createGallery() {
    const gallery = await apiRequestWorks()
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
        return gallery
    } catch (error) {
        console.log("Erreur dans la création de la gallery : ", error.message)
    }
}


/********************appel API Categories**********************/
async function apiRequestCategories() {
    try {
        const url = "http://localhost:5678/api/categories/"
        const response = await fetch(url)
        const categories = await response.json()
        return categories
    } catch (error) {
        console.log("Erreur dans l'appel à l'API : ", error.message)    
    }  
}

async function createCategories(){
    const categories = await apiRequestCategories()
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
        let filtersBtn=
            `<div id="btnCat0" class="btnActive">Tous</div>`
        for (let i = 0; i < catArray.length; i++) {
            filtersBtn += 
            `<div id="btnCat${[i + 1]}">${catArray[i]}</div>`
        }
        filtersContainer.innerHTML = filtersBtn
            
    } catch (error) {
        console.log("Erreur dans la création des boutons filtres : ", error.message)    
    }   
}
       

async function filterCategories() {
    await createCategories()
    try{
        let btnCat = [] 
        for (let i = 0; i < 4; i++) {
            btnCat[i] = document.getElementById("btnCat" + i)
            btnCat[i].addEventListener("click", (event)=>{
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

async function tokenLocalStorage(){
    await filterCategories()
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
tokenLocalStorage()


async function createModale(){
    const gallery= await createGallery()
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

async function gererModale(){
    await createModale()
    try{
        let modale=document.getElementById("modale")

        let btnModifier=document.querySelector(".btnModifier")
        btnModifier.addEventListener("click",() => modale.style.display="flex")

        function fermerModale(){
            modale.style.display="none"
        }

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
}

async function deleteItem(){
    await gererModale() 
    const btnSuppr = document.querySelectorAll(".trashIcon i")
    btnSuppr.forEach(btn=>{
        btn.addEventListener("click", deleteBtn)
    })
}      
deleteItem()

async function deleteBtn(event){
    const btn = event.currentTarget
    let gallery = await createGallery()
    try{   
        let tokenStorage = window.localStorage.getItem("token") 
        let url = `http://localhost:5678/api/works/${btn.id}`
        const response =  await fetch(url, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${tokenStorage}`, 
                "Accept": "*/*" 
                }
        })

        if(response.ok){
            gallery=gallery.filter(item=>item.id !== Number(btn.id))
            await createGallery()
            await createModale()
            await deleteItem()
        }else{
            throw new Error("l'API ne reconnaît pas ce fichier.")
        }
    } catch (error) {
        console.log("Impossible d'effacer :", error.message)
    } 
        
}

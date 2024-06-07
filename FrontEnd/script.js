/*****************appel API Works**************************/
async function apiRequestWorks() {
    const url = "http://localhost:5678/api/works/"
    const response = await fetch(url)
    const gallery = await response.json()

    let divGallery = document.querySelector(".gallery")
    let galleryPictures = ""
    gallery.forEach(item => 
        galleryPictures += `<figure id = "${item.id}" class = "cat${item.categoryId} cat0">
            <img src = "${item.imageUrl}">
            <figcaption>${item.title}</figcaption>
            </figure>`
    )

    divGallery.innerHTML = galleryPictures
}
apiRequestWorks()

/********************appel API Categories**********************/
async function apiRequestCategories() {
    const url = "http://localhost:5678/api/categories/"
    const response = await fetch(url)
    const categories = await response.json()

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
    
}

async function filtrerCategories() { 
    await apiRequestCategories()
    let btnCat = [] 
    for (let i = 0; i < 4; i++) {
        btnCat[i] = document.getElementById("btnCat" + i)

        function filterCategories(event) {
            let figures = document.querySelectorAll(".gallery figure")
            figures.forEach((fig) => {
                if (fig.classList.contains("cat" + i)) {
                    fig.classList.remove("hidden")
                } else {
                    fig.classList.add("hidden")
                }
            })
            btnCat.forEach(btn => btn.classList.remove("btnActive"))
            event.currentTarget.classList.add("btnActive")
        }
        btnCat[i].addEventListener("click", filterCategories)
    }
}

 async function tokenLocalStorage(){
     await filtrerCategories()
    let tokenStorage = window.localStorage.getItem("token")
    let logout

    if (tokenStorage !== null) {
        console.log("storageLocal ok" + tokenStorage)

        let header=document.querySelector("header")
        header.style.marginTop ="100px"

        logout = document.querySelector(".logout")
        logout.classList.remove("hidden")

        const login = document.querySelector(".login")
        login.classList.add("hidden")

        const blackBanner = document.querySelector(".edit")
        blackBanner.classList.remove("hidden")

        const modifProjet = document.querySelector(".modifier")
        modifProjet.classList.remove("hidden")

        const filtersBar = document.querySelector(".filtersContainer")
        filtersBar.classList.add("hidden")

    } else {
        console.log("token non sauvegardé")
    }
    
    try {
        logout.addEventListener("click", () => {
            window.localStorage.removeItem("token")
            window.location.reload()
            let header=document.querySelector("header")
            header.style.marginTop ="50px"
        })
    } catch (error) {
        console.log("déconnexion")
    }
}
tokenLocalStorage()



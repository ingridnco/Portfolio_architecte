/*****************affichage dynamique des Works**************************/
async function apiRequestWorks() {
    try {
        const url = "http://localhost:5678/api/works/"
        const response = await fetch(url)
        let gallery = await response.json()
        return gallery
    } catch (error) {
        console.log("Erreur dans l'appel à l'API : ", error.message)
    }
}

function createGallery(gallery) {
    try {
        let divGallery = document.querySelector("#portfolio .gallery")
        divGallery.innerHTML = ""

        let galleryPictures = ""
        gallery.forEach(item => {
            galleryPictures +=
                `<figure id="${item.id}" class="cat${item.categoryId} cat0">
                <img src="${item.imageUrl}">
                <figcaption>${item.title}</figcaption>
                </figure>`
        })
        divGallery.innerHTML = galleryPictures
    } catch (error) {
        console.log("Erreur dans la création de la gallery : ", error.message)
    }
}

/********************affichage dynamique des Categories**********************/
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

function createCategories(categories) {
    try {
        const filtersContainer = document.createElement("div")
        const divGallery = document.querySelector(".gallery")
        divGallery.parentNode.insertBefore(filtersContainer, divGallery)
        filtersContainer.classList.add("filtersContainer")

        //récupération des 3 catégories
        const catSet = new Set()
        for (let cat of categories) {
            catSet.add(cat.name)
        }

        //création des boutons filtres
        categories = [...catSet] //copie vraie du tableau
        let filtersBtn =
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

function filterCategories(categories) {
    try {
        const btnCat = []
        for (let i = 0; i < categories.length + 1; i++) {
            btnCat[i] = document.getElementById("btnCat" + i)
            btnCat[i].addEventListener("click", event => {
                const figures = Array.from(document.querySelectorAll(".gallery figure"))
                figures.forEach(fig => fig.style.display = "none") //masque tous les travaux
                const filterFigures = figures.filter(fig => fig.classList.contains("cat" + i))
                filterFigures.forEach(fig => fig.style.display = "block") //affiche les travaux filtrés

                btnCat.forEach(btn => btn.classList.remove("btnActive")) // les boutons non filtrés reprennent la couleur normale
                event.currentTarget.classList.add("btnActive")  //colore le bouton du filtre actif en vert
            })
        }
    } catch (error) {
        console.log("Erreur dans l'action des boutons filtres : ", error.message)
    }
}


/*************************Gestion du token*********************************/
function tokenLocalStorage() {
    let tokenStorage = window.localStorage.getItem("token")
    let logout

    try {
        if (tokenStorage) {
            console.log("storageLocal ok : " + tokenStorage)
            let header = document.querySelector("header")
            header.style.marginTop = "100px"

            //afficher les éléments admin:
            logout = document.querySelector(".logout") //bouton logout
            logout.classList.remove("hidden")
            const blackBanner = document.querySelector(".edit")//bandeau noir au-dessus du header
            blackBanner.classList.remove("hidden")
            const modifProjet = document.querySelector(".btnModifier")//bouton modifier
            modifProjet.classList.remove("hidden")

            //masquer les éléments :
            const login = document.querySelector(".login")//bouton login
            login.classList.add("hidden")
            const filtersBar = document.querySelector(".filtersContainer")//boutons filtres
            filtersBar.classList.add("hidden")

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
            let header = document.querySelector("header")
            header.style.marginTop = "50px"
            location.reload()
        })
    } catch (error) {
        console.log("Déconnecté")
    }
}

/*********************************Modale*********************************/
function createModale(gallery) {
    try {
        const divGalleryModale = document.querySelector(".galleryModale")
        divGalleryModale.innerHTML = ""

        let modaleGallery = ""
        gallery.forEach(item => {
            modaleGallery +=
                `<figure id="mod-${item.id}" class="cat${item.categoryId} cat0"><div class="trashIcon"><i id="${item.id}" class="fa-solid fa-sm fa-trash-can"></i></div>
                <img src="${item.imageUrl}">
                </figure>`
        })
        divGalleryModale.innerHTML = modaleGallery
        setDeleteBtns(gallery)
    } catch (error) {
        console.log("Erreur dans la création de la modale : ", error.message)
    }
}

function gererModale() {
    try {//afficher la modale en cliquant sur modifier
        const modale = document.getElementById("modaleContainer")
        const btnModifier = document.querySelector(".btnModifier")
        btnModifier.addEventListener("click", () => {
            modale.style.display = "flex"
            //toujours afficher la page "suppression" de la modale en premier
            const modaleDeleteWorks = document.querySelector(".modaleDeleteWorks")
            modaleDeleteWorks.classList.remove("hidden")
            const modaleAddWorks = document.querySelector(".modaleAddWorks")
            modaleAddWorks.classList.add("hidden")
        })

        function fermerModale() {
            modale.style.display = "none"
            resetForm()
        }
        //fermer en cliquant sur la croix
        document.querySelectorAll(".fa-xmark")
            .forEach(mark => mark.addEventListener("click", fermerModale))
        //fermer en cliquant en dehors de la modale
        modale.addEventListener("click", event => {
            if (event.target.id === "modaleContainer") {
                fermerModale()
                resetForm()
            }
        })
        const btnAddPhoto = document.querySelector(".btnAddPhoto")
        const modaleDeleteWorks = document.querySelector(".modaleDeleteWorks")
        const modaleAddWorks = document.querySelector(".modaleAddWorks")
        btnAddPhoto.addEventListener("click", () => {
            modaleDeleteWorks.classList.add("hidden")
            modaleAddWorks.classList.remove("hidden")
        })

    } catch (error) {
        console.log("Erreur dans la gestion de la modale : ", error.message)
    }
}

/*************************Supprimer un projet*****************************/
function setDeleteBtns(gallery) {
    try {
        const btnSuppr = document.querySelectorAll(".trashIcon i")
        btnSuppr.forEach(btn => {
            btn.addEventListener("click", async event => {
                const button = event.currentTarget
                const tokenStorage = window.localStorage.getItem("token")

                const url = `http://localhost:5678/api/works/${button.id}`
                const response = await fetch(url, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${tokenStorage}`,
                        "Accept": "*/*"
                    }
                })

                if (response.ok) {
                    const index = gallery.findIndex(item => item.id === Number(button.id))
                    gallery.splice(index, 1) // Suppression de l'élément dans gallery
                    console.log('gallery:', gallery)
                    createGallery(gallery)
                    createModale(gallery)

                } else {
                    alert("Votre session a expiré. Vous allez être redirigé.")
                    window.localStorage.removeItem("token")
                    location.reload()
                }
            })
        })
    } catch (error) {
        console.log("Impossible d'effacer :", error.message)
    }
}

/*************************Ajouter un projet*****************************/
//prévisualiser l'image du projet à envoyer:
const image = document.getElementById("image")
const photoContainer = document.getElementById("photoContainer")
const inputFile = document.getElementById("photo")
function previewPicture(input) {
   try{ 
    const [picture] = input.files
        if (picture.size <= 4 * 1024 * 1024) {
            const reader = new FileReader()
            reader.onload = function (event) {
                image.src = event.target.result
                image.style.display = "block"
                photoContainer.style.display = "none"
            }
            reader.readAsDataURL(picture)
        }else {
            resetForm()
            alert("La taille du fichier doit être inférieure à 4 Mo.")
        }
   }catch(error){
        console.log("Erreur:", error.message)
    }
}

inputFile.addEventListener("change", function(){ 
    previewPicture(this)
})
  
//réinitialiser le formulaire :
const submitButton = document.querySelector(".submitButton")
function resetForm(){
    const form = document.getElementById("formulaire")
    const erreurChamp=document.getElementById("erreurChamp")
    form.reset()
    image.src = ""
    photoContainer.style.display = "flex"
    if(erreurChamp){
        erreurChamp.innerHTML = ""}
    submitButton.removeAttribute("id")
}//reset form en cliquant sur la preview :
document.getElementById("image").addEventListener("click", () => resetForm())

//menu select dynamique
const categoryID = document.getElementById("category")
function menuSelect(categories){
    let categoriesMenu=`<option value="0"></option>`
    console.log('categories:', categories)
    for(cat of categories){  
        categoriesMenu+=`<option value="${cat.id}">${cat.name}</option>`
    }
    categoryID.innerHTML=categoriesMenu
}

const inputTitle = document.getElementById("titre")
//Activation du bouton valider sous conditions :
function validateBtn(){
    const erreurChamp=document.getElementById("erreurChamp")
    const formFilled=inputFile.files.length > 0 && inputTitle.value.trim() !== "" && categoryID.value !== "0"
    if (formFilled) {
        if (erreurChamp) {erreurChamp.innerHTML = ""}
        submitButton.setAttribute("id","btnValiderActive")
    } else {
        submitButton.removeAttribute("id")
    }  
}  
inputFile.addEventListener("change", validateBtn)
inputTitle.addEventListener("input", validateBtn)
categoryID.addEventListener("change", validateBtn)

//affichage d'un message d'erreur selon la complétion du formulaire :
function validateForm(event) {
    try{
        const erreurChamp=document.getElementById("erreurChamp")
        const messageErreur="Veuillez remplir tous les champs."
        const formMessage = document.getElementById("formulaire")
        const formFilled=inputFile.files.length > 0 && inputTitle.value.trim() !== "" && categoryID.value !== "0"
        
        if (!formFilled) {
            event.preventDefault()
            if (!erreurChamp) {
                // création du message d'erreur s'il n'existe pas
                const createBalise = `<p id="erreurChamp">${messageErreur}</p>`
                const messagePlace = formMessage.children.item(5)
                messagePlace.insertAdjacentHTML("afterend", createBalise)
            } else {
                // mise à jour s'il existe déjà
                erreurChamp.innerHTML = messageErreur
            }
        } else {
            // effacement du message si form ok
            if (erreurChamp) {
                erreurChamp.innerHTML = ""}
        }
    }catch(error){
        console.log("error:", error.message)

    }
}    
submitButton.addEventListener("click", validateForm)

//préparation de l'appel API pour l'ajout :
async function addNewPhoto(event) {
    event.preventDefault()
    //construction de l'objet FormData :
    const form = event.target
    const formData = new FormData()

    const titre = document.getElementById("titre").value
    console.log('titre:', titre)
    formData.append("title", titre)

    const imageUrl = document.getElementById("photo").files[0]
    console.log('imageUrl:', imageUrl)
    formData.append("image", imageUrl)
    
    const categoryId = document.getElementById("category").value
    console.log('categoryId:', categoryId)
    formData.append("category", categoryId)

    //Appel API
    try {
        const tokenStorage = window.localStorage.getItem("token")
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${tokenStorage}`
            },
            body: formData
        })

        if (!response.ok) {
            throw new Error("Erreur lors de l'envoi de l'image. Vérifiez que tous les champs sont remplis.")
        }
        
        const newPhoto = await response.json()
        gallery.push(newPhoto)  // Mise à jour de la gallery
        createGallery(gallery)
        createModale(gallery)

        // Réinitialise form
        form.reset()

        // Ferme la modale après ajout photo
        photoContainer.style.display = "flex"
        image.style.display = "none"
        document.getElementById("modaleContainer").style.display = "none"

    } catch (error) {
        console.error("Erreur:", error.message)
    }
}
//Clic sur le bouton valider :
document.querySelector(".addPhotoForm").addEventListener("submit", addNewPhoto)

let gallery = []

async function appels() {
    gallery = await apiRequestWorks()
    createGallery(gallery)
    let categories = await apiRequestCategories()
    createCategories(categories)
    filterCategories(categories)
    tokenLocalStorage()
    createModale(gallery)
    gererModale()
    menuSelect(categories)
}
appels()

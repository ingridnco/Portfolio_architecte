const emailConnect = document.getElementById("email")
const passwordConnect = document.getElementById("password")
const formConnect = document.querySelector("#form")
const url = "http://localhost:5678/api/users/login"


function balisesErreurs(balise,message,messageErreur){ 
    try{   if (!balise){
                let article = document.querySelector("article")
                let messagePlace = article.children.item(0)                 
                messagePlace.insertAdjacentHTML("afterend",message)
            } else {//si elle existe déjà:
                balise.innerHTML = messageErreur
            }
        }catch(error){
            console.log("Problème dans la fonction balisesErreurs : ", error.message)
        }
}


try {
    formConnect.addEventListener("submit", async (event) => {
        event.preventDefault()

        const login = {
            email: emailConnect.value,
            password: passwordConnect.value,
        }
        const chargeUtile = JSON.stringify(login)
        console.log(login)

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: chargeUtile,
        })
        const getToken = await response.json()

        if (response.ok) {
            console.log("Utilisateur connecté", getToken.token)
            window.localStorage.setItem("token", getToken.token)
            location.href = "index.html"
        } else {
            let messageErreur = "Email et/ou mot de passe incorrect(s)."
            if(emailConnect.value ==="" && passwordConnect.value ===""){
                messageErreur="Les champs sont vides."
            }else if(emailConnect.value ===""){
                messageErreur="L'email est vide."
            }else if(passwordConnect.value ===""){
            messageErreur="Le mot de passe est vide."
            }

            try{
                let baliseErreur1=document.getElementById("baliseErreur1")
                let createMessage1=`<p id="baliseErreur1">${messageErreur}</p>`    
                balisesErreurs(baliseErreur1,createMessage1,messageErreur)

                let baliseErreur2=document.getElementById("baliseErreur2")
                let createMessage2= `<p id="baliseErreur2">Utilisateur non connecté</p>`
                balisesErreurs(baliseErreur2,createMessage2,"Utilisateur non connecté")
            }catch(error){
                console.log("Erreur lors de la création de baliseErreur 1 ou 2 : ",error.message)
            }

        }
        })
    
} catch (error) {
    console.log("connexion impossible")
}




const emailConnect = document.getElementById("email")
const passwordConnect = document.getElementById("password")
const formConnect = document.querySelector("#form")
const url = "http://localhost:5678/api/users/login"




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
        } else {//messages d'erreur
            let messageErreur = "Email et/ou mot de passe incorrect(s)"
            if(emailConnect.value ===""){
                messageErreur="L'email est vide"
            }else if(passwordConnect.value ===""){
                messageErreur="Le mot de passe est vide"
            }
            /**balise pour message d'erreur**/
            //récupération si la balise existe déjà:(pour éviter les doublons)
            let baliseErreur=document.getElementById("baliseErreur")
            //si elle n'existe pas:
            if (!baliseErreur){
                let article = document.querySelector("article") 
                let createMessage=`<p id="baliseErreur">${messageErreur}</p>` 
                let messagePlace = article.children.item(0)                 
                messagePlace.insertAdjacentHTML("afterend",createMessage)  
            } else {//si elle existe déjà:
                baliseErreur.innerHTML =messageErreur 
                console.log(messageErreur)  
            }

            let baliseErreur2=document.getElementById("baliseErreur2")
            //si elle n'existe pas:
            if (!baliseErreur2){
                let article = document.querySelector("article")
                let messagePlace = article.children.item(0)  
                messagePlace.insertAdjacentHTML("afterend",`<p id="baliseErreur2">Utilisateur non connecté</p>`)
        }
        }
    })
} catch (error) {
    console.log(error.message)
}


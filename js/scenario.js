/** @type {Jeu} jeu */
let jeu;  // variable globale représentant le jeu actuel
var canvas = document.getElementById("canvas");
let popup = document.getElementById("popup");
let popupmessage = document.getElementById("popup-message");
var victorySound = new Audio('../sounds/8-bit-Victory.mp3')

function miseAJour() {
    jeu.verifVictoire();
    if(jeu.EtatJeu == 1){
        victorySound.play();
        openPopup("Vous avez gagné ! 🥳​");
    } else if (jeu.EtatJeu == -1){
        openPopup("Vous avez perdu ! 💥");
        jeu.afficherMines();
    }
}


/**
 * Démarre une nouvelle partie
 */
function nouvellePartie() {
    if (jeu instanceof Jeu){
        jeu.stopRevealMines = true;
    }
    jeu = new Jeu(0.2);
    jeu.nettoyerGrile();
    jeu.genererGrille();
}

document.getElementById("nouvelle-partie").addEventListener("click", (event) => {
    event.preventDefault();
    nouvellePartie();
});


window.addEventListener("load", function () {
    nouvellePartie();
});

canvas.addEventListener("click", function(event) {
    if (jeu.EtatJeu != 0){return}
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    var colonne = Math.floor(x / 20);
    var ligne = Math.floor(y / 20);

    if (colonne >19){colonne = 19}
    if (ligne >19){ligne = 19}
    jeu.revelerCase(ligne,colonne);
    miseAJour();
});

canvas.addEventListener("contextmenu", function(event) {
    if (jeu.EtatJeu != 0){return}
    event.preventDefault();
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    var colonne = Math.floor(x / 20);
    var ligne = Math.floor(y / 20);

    if (colonne >19){colonne = 19}
    if (ligne >19){ligne = 19}
    jeu.CreerDrapeau(ligne,colonne);
});

function openPopup(text) {
    popupmessage.innerHTML = text;
    popup.classList.add("show");
}

function closePopup() {
    popup.classList.remove("show");
}
function getHeures() {
    const now = new Date();
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    let seconds = now.getSeconds().toString().padStart(2, '0');

    const time = `${hours}:${minutes}:${seconds}`;
    document.getElementById('heure').innerText = time;
}

setInterval(getHeures, 1000);
getHeures();
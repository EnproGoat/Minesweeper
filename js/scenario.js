/** @type {Jeu} jeu */
let jeu;  // variable globale représentant le jeu actuel
let message = document.getElementById("message");
let score = document.getElementById("score");
let AfficheEnCours = false;
var canvas = document.getElementById("canvas");
/**
 * Met à jour la partie et l'affichage pour le joueur en fonction de la position du joueur
 * - indique si la partie est gagnée ou perdue
 * - indique le nombre de mines à proximité du joueur
 * - affiche le score du joueur
 * - met à jour l'image représentant le joueur
 */
function miseAJour() {
}


/**
 * Démarre une nouvelle partie
 */
function nouvellePartie() {
    jeu = new Jeu(0.2);
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
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    var colonne = Math.floor(x / 20);
    var ligne = Math.floor(y / 20);

    if (colonne >19){colonne = 19}
    if (ligne >19){ligne = 19}
    jeu.revelerCase(ligne,colonne);
});

const directions = [
    [-1, 0], [1, 0],
    [0, -1], [0, 1],
    [-1, -1], [-1, 1], [1, -1], [1, 1] 
];
var canvas = document.getElementById("canvas");
const fenetreJeu = document.querySelector("#demineur");
var context = canvas.getContext("2d");
if (window.location.protocol === "file:") {
    var explosionSound = new Audio('sounds/8-bit-explosion.wav');
} else {
    var explosionSound = new Audio('../sounds/8-bit-explosion.wav');
}
explosionSound.volume = 0.15;

class Jeu {
    constructor(probaMine) {
        this.probaMine = probaMine;
        this.carte = [];
        this.carteSafe = [];
        this.EtatJeu = 0;
        this.etatCaseInconnu = false;
        this.stopRevealMines = true;

        //Creation carte
        for (let i = 0; i < 20; i++) {
            this.carte[i] = [];
            for (let j = 0; j < 20; j++) {
                this.carte[i][j] = Math.random() < this.probaMine;
            }
        }

        //Pour vérifier que la case révélé est bien decouverte comme sûr
        for (let i = 0; i < 20; i++) {
            this.carteSafe[i] = [];
            for (let j = 0; j < 20; j++) {
                this.carteSafe[i][j] = false;
            }
        }
    }

    verifVictoire() {
        for (let i = 0; i < this.carteSafe.length; i++) {
            for (let j = 0; j < this.carteSafe[i].length; j++) {
                if (this.carteSafe[i][j] === false && this.carte[i][j] !== true) {
                    return;
                 }
            }
        }
        this.EtatJeu = 1;
    }

    /**
     * Affiche toutes les mines
     */
    afficherMines() {
        let delay = 0;
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 20; j++) {
                if (this.carte[i][j] == true){
                    setTimeout(() => {
                        if (!this.stopRevealMines) {
                            this.creationExplosion(i, j);
                        }
                    }, delay);
                    delay += 200;
                }
                if(this.stopRevealMines == true){
                    break;
                }
            }
            if(this.stopRevealMines == true){
                break;
            }
        }
    }

    /**
     * Renvoie le nombre de mines voisines de la position courante du joueur
     * @returns {number} nombre de mines adjacentes à la position du joueur
     */
    nbMinesVoisines(i,j) {
        let nbMines = 0;
        directions.forEach(([di , dj])=>{
            let ligneVoisine = di + i;
            let colonneVoisine = dj + j;
            if (ligneVoisine >= 0 && ligneVoisine < this.carte.length &&
                colonneVoisine >= 0 && colonneVoisine < this.carte[0].length) {
                if (this.carte[ligneVoisine][colonneVoisine] === true) { 
                    nbMines++; 
                }
            }
        });
        if (nbMines == 0 && this.carteSafe[i][j] === false){
            this.revelerCase(i,j);
        }
        
        return nbMines;
    }

    creationExplosion(i,j){
        this.CreerCaseReveler(i , j, "💥");
            fenetreJeu.classList.add("vibration");
            setTimeout(() => {
                fenetreJeu.classList.remove("vibration");
            }, 100);
            if (!explosionSound.paused) {
                explosionSound.currentTime = 0;
            }
            explosionSound.play();
    }

    revelerCase(i, j){
        if (this.carteSafe[i][j] || this.EtatJeu != 0) return;
        if(this.carte[i][j] === true){
            this.creationExplosion(i,j);
            this.stopRevealMines = false;
            this.EtatJeu = -1;
        } else {
            this.CreerCaseReveler(i,j,"");
            this.carteSafe[i][j] = true;
            directions.forEach(([di , dj])=>{
                let ligneVoisine = i + di;
                let colonneVoisine = j + dj;

                if (ligneVoisine >= 0 && ligneVoisine < this.carte.length &&
                    colonneVoisine >= 0 && colonneVoisine < this.carte[0].length) {
                    if (this.carte[ligneVoisine][colonneVoisine] === false && this.carteSafe[ligneVoisine][colonneVoisine] === false){
                        let nbMines = this.nbMinesVoisines(di + i, dj + j);
                        if(nbMines == 0){
                            this.CreerCaseReveler(ligneVoisine, colonneVoisine,"");
                        } else {
                            this.CreerCaseReveler(ligneVoisine, colonneVoisine,nbMines);
                        }
                        this.carteSafe[ligneVoisine][colonneVoisine] = true;
                    }
                }
                
            });
        }
    }

    genererGrille() {
        context.beginPath();
    
        for (var x = 0; x <= 400; x += 20) {
            context.moveTo(x, 0);
            context.lineTo(x, 400);
        }
    
        for (var y = 0; y <= 400; y += 20) {
            context.moveTo(0, y);
            context.lineTo(400, y);
        }
    
        context.strokeStyle = "black";
        context.stroke();
        if (this.etatCaseInconnu == false){
            this.genererCaseInconnu();
        }
    }
    
    nettoyerGrile(){
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    genererCaseInconnu() {
        this.etatCaseInconnu = true;
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 20; j++) {
                this.CreerCaseInconnu(i,j,"");
            }
        }
        this.genererGrille();
    }

    CreerDrapeau(ligne,colonne){
        this.CreerCaseInconnu(ligne,colonne,"🚩")
    }

    CreerCaseInconnu(ligne, colonne,contenu) {
        let x = colonne * 20;
        let y = ligne * 20;
        let padding = 2;
    
        context.fillStyle = "lightgray";
        context.fillRect(x + padding, y + padding, 20 - 2 * padding, 20 - 2 * padding);
    
        context.strokeStyle = "white";
        context.beginPath();
        context.moveTo(x + padding, y + padding);
        context.lineTo(x + 20 - padding, y + padding);
        context.stroke();
    
        context.beginPath();
        context.moveTo(x + padding, y + padding);
        context.lineTo(x + padding, y + 20 - padding);
        context.stroke();
    
        context.strokeStyle = "darkgray";
        context.beginPath();
        context.moveTo(x + padding, y + 20 - padding);
        context.lineTo(x + 20 - padding, y + 20 - padding);
        context.stroke();
    
        context.beginPath();
        context.moveTo(x + 20 - padding, y + padding);
        context.lineTo(x + 20 - padding, y + 20 - padding);
        context.stroke();

        context.fillStyle = "black";
        context.font = "10px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(contenu, x + 10, y + 10)
    }
    
    CreerCaseReveler(ligne, colonne, contenu) {
        let x = colonne * 20;
        let y = ligne * 20;
    
        context.fillStyle = "white";
        context.fillRect(x, y, 20, 20);
    
        context.strokeStyle = "black";
        context.strokeRect(x, y, 20, 20); 
    
        context.fillStyle = "black";
        context.font = "10px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(contenu, x + 10, y + 10);
        this.genererGrille();
    }
    
}

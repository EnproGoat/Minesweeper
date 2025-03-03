const directions = [
    [-1, 0], [1, 0],
    [0, -1], [0, 1],
    [-1, -1], [-1, 1], [1, -1], [1, 1] 
];
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

class Jeu {
    constructor(probaMine) {
        this.probaMine = probaMine;
        this.carte = [];
        this.carteSafe = [];
        this.EtatJeu = 0;

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


    /**
     * Affiche toutes les mines
     */
    afficherMines() {
        
    }

    /**
     * Cache toutes les mines
     */
    cacherMines() {
        
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

    revelerCase(i, j){
        if (this.carteSafe[i][j]) return;
        if(this.carte[i][j] === true){
            this.CreerCase(i , j, "💥");
            this.EtatJeu = -1;
        } else {
            this.CreerCase(i,j,"");
            this.carteSafe[i][j] = true;
            directions.forEach(([di , dj])=>{
                let ligneVoisine = i + di;
                let colonneVoisine = j + dj;

                if (ligneVoisine >= 0 && ligneVoisine < this.carte.length &&
                    colonneVoisine >= 0 && colonneVoisine < this.carte[0].length) {
                    if (this.carte[ligneVoisine][colonneVoisine] === false && this.carteSafe[ligneVoisine][colonneVoisine] === false){
                        let nbMines = this.nbMinesVoisines(di + i, dj + j);
                        if(nbMines == 0){
                            this.CreerCase(ligneVoisine, colonneVoisine,"");
                        } else {
                            this.CreerCase(ligneVoisine, colonneVoisine,nbMines);
                        }
                        this.carteSafe[ligneVoisine][colonneVoisine] = true;
                    }
                }
                
            });
        }
    }

    genererGrille() {
        context.clearRect(0, 0, canvas.width, canvas.height);
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
    }
    

    
    CreerCase(ligne, colonne, contenu) {
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
    }
    

    /*
    genererGrille() {
        let champ = document.getElementById("champ");
        champ.innerHTML = "";
    
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 20; j++) {
                let caseDiv = document.createElement("div");
                caseDiv.classList.add("case", "hidden");
                caseDiv.dataset.ligne = i;
                caseDiv.dataset.colonne = j;
    
                caseDiv.style.position = "absolute";
                caseDiv.style.top = (34 + i * 20) + "px";
                caseDiv.style.left = (50 + j * 20) + "px";
                caseDiv.style.width = "20px";
                caseDiv.style.height = "20px";
                caseDiv.addEventListener("click", () => this.revelerCase(i, j));
                caseDiv.addEventListener("contextmenu", (e) => {
                    e.preventDefault();
                    //marquerMine(i, j);
                });
    
                champ.appendChild(caseDiv);
            }
        }
    }
    */
    
}

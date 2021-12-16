// I. Entête
let svg = d3.select("svg");

let compteur = 0;

let ennemis = [];

let tire = [];

let missile = 0;

let xSouris = 0;

let pause = false;

let tireE = [];

// II. Dessin

// Mettre à jour les coordonnées
function updateCoords() {
    svg.selectAll("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
}

function updateCoordsEnnemi() {
    svg.selectAll("#mechant")
        .attr("x", d => d.x)
        .attr("y", d => d.y);
}

// Créer un entier aléatoire

function entierAlea(n) {
    return Math.floor(Math.random() * n);
}

// Fonction pour la fusée
svg.style("background-color", "#000000");

svg.append("use")
    .attr("id", "fantome")
    .attr("href", "#fusee")
    .style("display", "none")
    .style("z-index", 2);

// Création de la ligne de délimitation
svg.append("g").append("line")
    .attr("stroke", "white")
    .attr("x1", "0")
    .attr("y1", "75")
    .attr("x2", "100")
    .attr("y2", "75")
    .style("z-index", 2);

// Fonction pour les ennemis
function newEnnemi() {

    let update = svg.selectAll("#mechant").data(ennemis);

    update.enter()
        .append("use")
        .attr("class", "actif")
        .attr("id", "mechant")
        .attr("href", "#ennemi")
        .style("background-color", "red")
        .transition()
        .duration(500);

    update.exit()
        .remove();

    updateCoordsEnnemi();
}

// Fonction pour les tires des ennemis
function missileEnnemi() {

    let varEnnemi = svg.selectAll("circle.missileE").data(tireE);

    varEnnemi.enter()
        .append("circle")
        .attr("class", "missileE")
        // .attr("id", "tirMissile")
        .attr("r", 1)
        .style("fill", "yellow");

    varEnnemi.exit()
        .remove();
    updateCoords();
}

// Fonction pour les tires de la fusée
function missileFusee() {

    let varMissile = svg.selectAll("circle.missile").data(tire);

    varMissile.enter()
        .append("circle")
        .attr("class", "missile")
        .attr("id", "tirMissile")
        .attr("r", 1)
        .style("fill", "#2bff00");

    varMissile.exit()
        .remove();
    updateCoords();
}

// Fonction pour supprimer un élément d'un tableau
function suppressionDansTableau(tableau, critere) {
    let suppression = false;
    for (let i = tableau.length - 1; i >= 0; i--) {
        if (critere(tableau[i])) {
            tableau.splice(i, 1);
            suppression = true;
        }
    }
    return suppression;
}

// Fonction pour avoir la distance entre 2 éléments a et b

function distance(a, b) {
    let dx = a.x - b.x;
    let dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);

}

// Points qui augmente quand on touche un ennemi
function mouvementTire() {
    if (pause == false) {
        if (suppressionDansTableau(ennemis, ennemi => suppressionDansTableau(tire, missile => distance(ennemi, missile) < 7))) {
            // missileEnnemi();
            newEnnemi();
            // Afficher score
            let points = document.querySelector("span.nbPoints").innerHTML;

            points = parseInt(points);
            document.querySelector("span.nbPoints").innerHTML = points + 1;
            document.querySelector('.score').innerHTML = points;
            // Stopper le jeu 
            if (points == 19) {
                document.querySelector('.win').style.zIndex = 2;
                if (pause == false) {
                    pause = true;
                };

                document.querySelector('.rejouer').addEventListener('click', function () {
                    location.reload();
                });
            } else {
                updateCoords();
            }
        } else {
            return;
        }
    }
};

// Vie diminue quand un missile des ennemis touche la fusée
function toucheFusee() {
    if (pause == false) {
        if (suppressionDansTableau(tireE, tireEnnemi => distance(tireEnnemi, {
                x: xSouris,
                y: 85
            }) < 1)) {
            missileEnnemi();
            newEnnemi();
            let vieNombre = document.querySelector("span.nbVie").innerHTML;
            vieNombre = parseInt(vieNombre);
            document.querySelector("span.nbVie").innerHTML = vieNombre - 1;

        } else {
            updateCoords();
        }
    } else {
        return;
    }
}

// Permet d'avoir les coordonnées de la souris
function coordSouris(e) {
    if (pause == false) {
        xSouris = d3.pointer(e)[0];
    } else {
        return
    }
}

function positionSouris(e) {
    if (pause == false) {
        let pointer = d3.pointer(e);
        d3.select("#fantome")
            .attr("x", pointer[0] - 8.5)
            .attr("y", "80");
    } else {
        return
    }
}

// III. Moteur

// test pour savoir si un ennemi a terminé sa chute
function chuteEnCours(d) {
    return d.y < 75;
}

document.querySelector('.jouer').addEventListener('click', function () {
    document.querySelector('.play').style.zIndex = -1;
    document.addEventListener('keydown', function (event) {
        if (pause == false) {
            pause = true;
            document.querySelector('.pause').style.zIndex = 2;
        } else {
            pause = false;
            document.querySelector('.pause').style.zIndex = -1;
        }
    });
    // a) Action de la souris avec la fusée

    if (pause == false) {
        svg.on("mouseenter", function (e) {
            positionSouris(e);
            d3.select("#fantome")
                .style("display", null);
        })

        svg.on("mousemove", function (e) {
            positionSouris(e);
            coordSouris(e);
        })
    }

    // b) Action des ennemis qui tombent 

    // Toutes les 50ms: les ennemis tombent un peu
    setInterval(function () {
        if (pause == false) {
            if (ennemis.length == 0) return;
            ennemis.forEach(function (d) {
                d.vitesse += 2; //la vitesse augmente (accélération pendant la chute)
                d.y += d.vitesse / 100; //y augmente en fonction de la vitesse 

                if (chuteEnCours(d) == false) {
                    // Un ennemi à traversé, la vie diminue
                    let vieCompteur = document.querySelector("span.nbVie").innerHTML;
                    vieCompteur = parseInt(vieCompteur);
                    document.querySelector("span.nbVie").innerHTML = vieCompteur - 1;
                    if (vieCompteur == 1) {
                        // alert("Game Over")
                        if (pause == false) {
                            pause = true;
                        };
                        document.querySelector('.perdu').style.zIndex = 3;
                        document.querySelector('.rejouerperdu').addEventListener('click', function () {
                            location.reload();
                        });
                    }
                }

            });

            if (ennemis.every(chuteEnCours))
                updateCoordsEnnemi();
            else {
                ennemis = ennemis.filter(chuteEnCours);
                newEnnemi();
            }
        } else {
            return;
        }

    }, 50);

    // Toutes les 1100ms: un nouvel ennemi est ajoutée en haut
    setInterval(function () {
        if (pause == false) {
            compteur++;
            ennemis.push({
                x: entierAlea(100),
                y: 0,
                vitesse: entierAlea(40) + 2,
                id: compteur
            });
            newEnnemi();
        } else {
            return;
        }
    }, 900);

    // Missile des ennemis
    let missileE = 0;

    setInterval(function () {
        if (pause == false) {
            if (tireE.length == 0) return;
            tireE.forEach(function (d) {
                d.vitesse += 2;
                d.y += d.vitesse / 80;
            });
        } else {
            return;
        }
    }, 10);

    setInterval(function () {
        let numEnnemi = entierAlea(ennemis.length);
        if (pause == false) {
            missileE++;
            tireE.push({
                x: ennemis[numEnnemi].x + 5,
                y: ennemis[numEnnemi].y + 5,
                vitesse: 200,
                id: missileE
            });
            missileEnnemi();
        } else {
            return;
        }
    }, 1000);

    // Missile de la fusée

    setInterval(function () {
        if (pause == false) {
            if (tire.length == 0) return;
            tire.forEach(function (d) {
                d.vitesse += 2;
                d.y += d.vitesse / -80;
            });
        } else {
            return
        }
    }, 10);

    setInterval(function () {
        if (pause == false) {
            missile++;
            tire.push({
                x: xSouris,
                y: 85,
                vitesse: 200,
                id: missile
            });
            missileFusee();
        } else {
            return;
        }
    }, 250);

    // Appel de la fonction des points qui augmente quand on touche un ennemi
    setInterval(mouvementTire, 1);

    // Appel de la fonction de la vie qui diminue quand un missile des ennemis touche la fusée
    setInterval(toucheFusee, 1);
})


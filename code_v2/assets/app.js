// I. Entête
let svg = d3.select("svg");

let mainlayer = svg.append("g")

let compteur = 0;

let ennemis = [];

let tire = [];

let missile = 0;

let xSouris = 0;

// II. Dessin

// a) Function pour la fusée
svg.style("background-image", "url('assets/image/espace.jpg')");

svg.append("use")
    .attr("id", "fantome")
    .attr("href", "#fusee")
    .style("display", "none")
    .style("z-index", 2);

// b) Function pour les ennemis

function entierAlea(n) {
    return Math.floor(Math.random() * n);
}

// Création des ennemis
function update_DOM() {

    let update = svg.selectAll("circle.actif").data(ennemis);

    update.enter()
        .append("circle")
        .attr("class", "actif")
        .attr("id", "ennemi")
        .style("fill", "white")
        .transition()
        .duration(500)
        .attr("r", 2);

    update.exit()
        .remove();

    update_coords();

    // Faire disparaitre les ennemis

    // update.exit() //transition de sortie
    // .attr("class", "inactif")
    // .transition()
    // .duration(500)
    // .style("fill", "white")
    // .attr("r", 0)
    // .remove();
}

// Permet de mettre à jour les coordonnées
function update_coords() {
    svg.selectAll("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
}

// Fonction pour les tirs de la fusée
function missileFusee() {

    let varMissile = svg.selectAll("circle.missile").data(tire);

    varMissile.enter()
        .append("circle")
        .attr("class", "missile")
        .attr("id", "tirMissile")
        .attr("r", 1)
        .style("fill", "red");

    varMissile.exit()
        .remove();
    update_coords();
}

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

function distance(a, b) {
    let dx = a.x - b.x;
    let dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);

}

function mouvementTire() {
    if (suppressionDansTableau(ennemis, ennemi => suppressionDansTableau(tire, missile => distance(ennemi, missile) < 2))) {
        missileFusee();
        update_DOM();
    } else {
        update_coords();
    }
}

// Permet d'avoir les coordonnées de la souris
function positionFantome(e) {
    let pointer = d3.pointer(e);
    d3.select("#fantome")
        .attr("x", pointer[0] - 4.5)
        .attr("y", "80");

}

function coord_souris(e) {
    xSouris = d3.pointer(e)[0];
}

// III. Moteur

// a) Action de la souris avec la fusée
svg.on("mouseenter", function (e) {
    positionFantome(e);
    d3.select("#fantome")
        .style("display", null)
})

svg.on("mousemove", function (e) {
    positionFantome(e);
    coord_souris(e);
})

// b) Action des ennemis qui tombent 

// test pour savoir si un ennemi a terminé sa chute
function chute_en_cours(d) {
    return d.y < 70;
}

//toutes les 50ms: les ennemis tombent un peu
setInterval(function () {
    if (ennemis.length == 0) return;
    ennemis.forEach(function (d) {
        d.vitesse += 2; //la vitesse augmente (accélération pendant la chute)
        d.y += d.vitesse / 100; //y augmente en fonction de la vitesse 
    });

    if (ennemis.every(chute_en_cours))
        update_coords();
    else {
        ennemis = ennemis.filter(chute_en_cours);
        update_DOM();
    }

}, 50);

//toutes les 1100ms: un nouvel ennemi est ajouté en haut
setInterval(function () {
    compteur++;
    ennemis.push({
        x: entierAlea(100),
        y: 0,
        vitesse: entierAlea(40) + 2,
        id: compteur
    });
    update_DOM();
}, 1100);

// c) Action des missiles de la fusée

setInterval(function () {
    if (tire.length == 0) return;
    tire.forEach(function (d) {
        d.vitesse += 2;
        d.y += d.vitesse / -80;
    });
}, 10);

setInterval(function () {
    missile++;
    tire.push({
        x: xSouris,
        y: 85,
        vitesse: 200,
        id: missile
    });
    missileFusee();
}, 250);

setInterval(mouvementTire, 1);
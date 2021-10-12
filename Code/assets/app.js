// Entête
let svg = d3.select("svg");

let mainlayer = svg.append("g")

let compteur = 0;

let coordonnees = [];

let tire = [];

let missile = 0;

let xSouris = 0;

// Dessin

    // a) Function pour la fusée
svg.style("background-color", "#010614");

function positionFantome(e) {
    let pointer = d3.pointer(e);
    d3.select("#fantome")
        .attr("x", pointer[0] - 4.5)
        .attr("y", "80");
        
}

svg.append("use")
    .attr("id", "fantome")
    .attr("href", "#fusee")
    .style("display", "none")
    .style("z-index", 2);

    // b) Function pour les ennemis

function entierAlea(n) {
    return Math.floor(Math.random() * n);
}

function update_DOM() {

    let update =
        svg
        .selectAll("circle.actif")
        .data(coordonnees, d => d.id);
    update.exit() //transition de sortie
        .attr("class", "inactif")
        .transition()
        .duration(500)
        .style("fill", "white")
        .attr("r", 0)
        .remove();

    update.enter()
        .append("circle")
        .attr("class", "actif")
        .attr("r", 0)
        .style("fill", "white")
        .transition()
        .duration(500)
        .attr("r", 2)
    update_coords();
}

function update_coords() {
    svg
        .selectAll("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
}

function coord_souris(e){
    xSouris = d3.pointer(e)[0];
}

function missileFusee() {

    let varMissile =
        svg
        .selectAll("circle.missile")
        .data(tire, d => d.id);
    // update.exit() //transition de sortie
    //     .attr("class", "inactif")
    //     .transition()
    //     .duration(500)
    //     .style("fill", "red")

    //     .remove();

    varMissile.enter()
        .append("circle")
        .attr("class", "missile")
        .attr("r", 1)
        .style("fill", "red");
        update_coords()
}


// Moteur

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

    // b) Action des gouttes qui tombent 

// test pour savoir si une goute a terminé sa chute
function chute_en_cours(d) {
    return d.y < 70;
}

//toutes les 50ms: les goutes tombent un peu
setInterval(function () {
    if (coordonnees.length == 0) return;
    coordonnees.forEach(function (d) {
        d.vitesse += 2; //la vitesse augmente (accélération pendant la chute)
        d.y += d.vitesse / 80; //y augmente en fonction de la vitesse 
    });

    if (coordonnees.every(chute_en_cours))
        update_coords();
    else {
        coordonnees = coordonnees.filter(chute_en_cours);
        update_DOM();
    }

}, 50);

//toutes les 100ms: une nouvelle goutte est ajoutÃ©e en haut
setInterval(function () {
    compteur++;
    coordonnees.push({
        x: entierAlea(100),
        y: 0,
        vitesse: entierAlea(40) + 20,
        id: compteur
    });
    update_DOM();
}, 1100);

    // c) 

setInterval(function () {
    if (tire.length == 0) return;
    tire.forEach(function (d) {
        d.vitesse += 2; 
        d.y += d.vitesse / -80; 
    });

    // if (tire.every(chute_en_cours))
    //     update_coords();
    // else {
    //     tire = tire.filter(chute_en_cours);
    //     missileFusee();
    // }

}, 50);


setInterval(function () {
    missile++;
    tire.push({
        x: xSouris,
        y: 85,
        vitesse: 20,
        id: missile
    });
    missileFusee();
    // console.log(tire)
}, 200);



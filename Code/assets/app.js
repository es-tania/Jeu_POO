let svg = d3.select("svg");

svg.style("background-color", "#010614");

//on ajoute un groupe qui sert de "couche principale"
let mainlayer = svg.append("g")

//puis un fantome, qui sera toujours au premier plan (initialement invisible)
svg.append("use")
    .attr("id","fantome")
    .attr("href", "#fusee")
    .style("display","none")
    .style("z-index",2)
    ;

// mouvements de la souris: entrÃ©e, dÃ©placement, sortie. On gÃ¨re la visibilitÃ© et la position du fantome
// fonction annexe pour gÃ©rer la position
function positionFantome(e) {
    let pointer = d3.pointer(e);
    d3.select("#fantome")
        .attr("x", pointer[0]-9)
        .attr("y", "80")
}
//entrÃ©e
svg.on("mouseenter", function(e) {    
    positionFantome(e);
    d3.select("#fantome")
        .style("display",null)
} )
//dÃ©placement
svg.on("mousemove", function(e) {
    positionFantome(e);    
} )
//sortie
svg.on("mouseleave", function(e) {
    d3.select("#fantome")
        .style("display","none")
} )


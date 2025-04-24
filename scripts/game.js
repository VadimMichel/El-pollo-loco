let canvas;
let world;


function init(){
    canvas = document.getElementById("content");
    world = new World(canvas);
    
    console.log(world["character"])
}
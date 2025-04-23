let canvas;
let ctx;

function init(){
    let world = new World();
    canvas = document.getElementById("content");
    ctx = canvas.getContext("2d");
    console.log(world["character"])
}
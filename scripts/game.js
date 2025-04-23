let canvas;
let ctx;
let world = new World();

function init(){
    canvas = document.getElementById("content");
    ctx = canvas.getContext("2d");
    console.log(world["character"])
}
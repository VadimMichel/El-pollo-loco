let canvas;
let world;
let keyboard = new Keyboard();
let backgroundAudio = new Audio ("audio/latin-traditional-music-spanish-mexican-background-intro-theme-258024.mp3");

function init(){
    canvas = document.getElementById("content");
    world = new World(canvas, keyboard);
}


window.addEventListener("keydown", (event) => {
    if(event.key == 'ArrowLeft'){
        keyboard.LEFT = true;
    }else if (event.key == 'ArrowRight'){
        keyboard.RIGHT = true;
    }else if (event.key == 'ArrowUp'){
        keyboard.UP = true;
    }else if (event.key == 'ArrowDown'){
        keyboard.DOWN = true;
    }else if (event.key == ' '){
        keyboard.SPACE = true;
    }else if (event.key == 'd'){
        keyboard.D = true;
    }
})

window.addEventListener("keyup", (event) => {
    if(event.key == 'ArrowLeft'){
        keyboard.LEFT = false;
    }else if (event.key == 'ArrowRight'){
        keyboard.RIGHT = false;
    }else if (event.key == 'ArrowUp'){
        keyboard.UP = false;
    }else if (event.key == 'ArrowDown'){
        keyboard.DOWN = false;
    }else if (event.key == ' '){
        keyboard.SPACE = false;
    }else if (event.key == 'd'){
        keyboard.D = false;
    }
})
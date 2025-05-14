let canvas;
let world;
let intervalIds =[];
let keyboard = new Keyboard();
let startGame = false;

function startGameBotton(){
    canvas = document.getElementById("content");
    initLevel();
    world = new World(canvas, keyboard);
    document.getElementById("overlay").classList.add("d-none");
    document.getElementById("winLoseContent").classList.add("d-none");
    world.playedSound = false;
    GameSounds.playAudio(GameSounds.BACKGROUND_MUSIK, 0.1, true);
}

function stopGame(){
    intervalIds.forEach(clearInterval);
}

function setStoppableInterval(fn, time){
    let id = setInterval(fn, time);
    intervalIds.push(id);
}

function restartGame(){
    stopGame();
    startGameBotton();
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

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById("btnRight").addEventListener("touchstart", (event) => {
        event.preventDefault();
        keyboard.RIGHT = true;
    });

    document.getElementById("btnRight").addEventListener("touchend", (event) => {
        event.preventDefault();
        keyboard.RIGHT = false;
    });

    document.getElementById("btnLeft").addEventListener("touchstart", (event) => {
        event.preventDefault();
        keyboard.LEFT = true;
    });

    document.getElementById("btnLeft").addEventListener("touchend", (event) => {
        event.preventDefault();
        keyboard.LEFT = false;
    });

    document.getElementById("btnUp").addEventListener("touchstart", (event) => {
        event.preventDefault();
        keyboard.UP = true;
    });

    document.getElementById("btnUp").addEventListener("touchend", (event) => {
        event.preventDefault();
        keyboard.UP = false;
    });

    document.getElementById("btnThrow").addEventListener("touchstart", (event) => {
        event.preventDefault();
        keyboard.D = true;
    });

    document.getElementById("btnThrow").addEventListener("touchend", (event) => {
        event.preventDefault();
        keyboard.D = false;
    });
});
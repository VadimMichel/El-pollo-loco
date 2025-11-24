/** @type {HTMLCanvasElement|null} Canvas element where the game is rendered. */
let canvas;
/** @type {World|undefined} Root game world instance. */
let world;
/** @type {number[]} Array of interval IDs created by setInterval so they can be cleared later. */
let intervalIds =[];
/** @type {Keyboard} Global keyboard input state object. */
let keyboard = new Keyboard();
/** @type {boolean} Flag to indicate whether the game has started. */
let startGame = false;

/**
 * Read saved settings from localStorage and apply them.
 * Currently checks the "soundMute" key (expects boolean stored as JSON).
 * If the key is missing, mute is assumed to be false.
 *
 * Side effects:
 * - Calls GameSounds.muteGame or GameSounds.unMuteGame depending on stored value.
 *
 * @returns {void}
 */
function getFromLocalStorage() {
    let isSoundMuted = JSON.parse(localStorage.getItem("soundMute"));
    const id = '';
    if (isSoundMuted === null) {
        isSoundMuted = false;
    }
    if (isSoundMuted) {
        GameSounds.muteGame(id);
    } else if (!isSoundMuted){
        GameSounds.unMuteGame(id);
    }
}

/**
 * Initialize canvas, level and world and show the game UI.
 *
 * Side effects:
 * - Replaces the content wrapper with a new canvas element.
 * - Creates a new World instance assigned to the global `world`.
 *
 * @returns {void}
 */
function startGameBotton(){
    getFromLocalStorage();
    initializeCanvas();
    initLevel();
    world = new World(canvas, keyboard);
    showGameUI();
}

/**
 * Stop all active game intervals and reset game state flags.
 *
 * @returns {void}
 */
function stopGame(){
    intervalIds.forEach(clearInterval);
    if (world) {
        world.playedSound = false;
    }
}

/**
 * Wrapper around setInterval that remembers the created interval ID so it can be cleared later.
 *
 * @param {Function} fn - Function to be executed on each interval tick.
 * @param {number} time - Interval delay in milliseconds.
 * @returns {number} The interval ID returned by setInterval.
 */
function setStoppableInterval(fn, time){
    let id = setInterval(fn, time);
    intervalIds.push(id);
    return id;
}

/**
 * Restart the game by stopping active intervals and starting the game again.
 *
 * @returns {void}
 */
function restartGame(){
    stopGame();
    startGameBotton();
}

/**
 * Toggle the visibility (fullscreen-hide class) of the gamepad container.
 *
 * @returns {void}
 */
function displayGamePad(){
    gamepad = document.getElementById("gamepadContent");
    gamepad.classList.toggle("fullscreen-hide");
}

/**
 * Create/replace the canvas element inside the content wrapper.
 * Sets the canvas size to 720x480 and assigns it to the global `canvas` variable.
 *
 * @returns {void}
 */
function initializeCanvas(){
    wrapperRef = document.getElementById("contentWrapper");
    wrapperRef.innerHTML = "";
    wrapperRef.innerHTML = `<canvas id="content" width="720" height="480"></canvas>`;
    canvas = document.getElementById("content");
}

/**
 * Show game-related UI elements and hide win/lose content.
 *
 * @returns {void}
 */
function showGameUI(){
    document.getElementById("topBtnContent").classList.remove("d-none");
    document.getElementById("gamepadContent").classList.remove("d-none");
    document.getElementById("winLoseContent").classList.add("d-none");
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

/**
 * Reload the current page to reset the application state.
 *
 * @returns {void}
 */
function reloadPage(){
    location.reload();
}
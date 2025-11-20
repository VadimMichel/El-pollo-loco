/**
 * @fileoverview World manages rendering and global game state for a single play session.
 *
 * Responsibilities:
 * - Hold references to main game objects (character, level, UI bars, thrown bottles)
 * - Render the scene and HUD each animation frame
 * - Provide helpers for drawing, mirroring sprites and showing end-of-game UI
 *
 * Note: Gameplay logic (events, collisions, throw handling, etc.) is implemented
 * in WorldLogic which this class extends. Ensure WorldLogic is loaded before this file.
 *
 * @class World
 */
class World extends WorldLogic {
    /** @type {Character} Player character instance. */
    character = new Character();

    /** @type {Level} Current level definition (enemies, background, collectables). */
    level = level1;

    /** @type {HTMLCanvasElement} Canvas used for rendering. */
    canvas;

    /** @type {CanvasRenderingContext2D} 2D drawing context of the canvas. */
    ctx;

    /** @type {Keyboard} Keyboard input state wrapper. */
    keyboard;

    /** @type {number} Camera offset on the x axis applied when rendering. */
    camera_x = 0;

    /** @type {number} Collected coin amount (0-100). */
    coinAmount = 0;

    /** @type {number} Current bottle amount (0-100). */
    bottleAmount = 0;

    /** @type {number} Boss health percentage (0-100). */
    bossHealthAmount = 100;

    /** @type {StatusBar} Health status bar UI. */
    healthBar = new StatusBar("health", 0, 20, 100);

    /** @type {StatusBar} Coin status bar UI. */
    coinBar = new StatusBar("coin", 45, 20, 0);

    /** @type {StatusBar} Bottle status bar UI. */
    bottleBar = new StatusBar("bottle", 90, 20, 0);

    /** @type {StatusBar} Boss health bar UI. */
    bossHealthBar = new StatusBar("boss", 6, 440, 100);

    /** @type {ThrowableObject[]} Active thrown bottles in the world. */
    bottleThrow = [];

    /** @type {boolean} Prevent repeated end-of-game sound/sequence triggers. */
    playedSound = false;

    /**
     * Construct a World instance, initialize rendering context and start loops.
     *
     * @param {HTMLCanvasElement} canvas - Canvas element used for rendering.
     * @param {Keyboard} keyboard - Shared keyboard input state object.
     */
    constructor(canvas, keyboard){
        super();
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.setWorld();
        this.draw();
        this.run();
    }

    /**
     * Attach this world reference to the character so game objects can access it.
     *
     * @returns {void}
     */
    setWorld(){
        this.character.world = this;
    }

    /**
     * Main render entry: clear canvas, draw world objects and UI, schedule next frame.
     *
     * @returns {void}
     */
   draw() {
        this.clearCanvas();
        this.drawGameWorld();
        this.drawUI();
        this.scheduleNextFrame();
    }

    /**
     * Start the recurring update loop for game events.
     *
     * @returns {void}
     */
    run(){
        setStoppableInterval(() => this.events(), 10);
    }

    /**
     * Periodic update: run collision checks, throw logic, boss triggers and game over.
     *
     * @returns {void}
     */
    events(){
        this.checkCollisions(this.level.enemies); 
        this.checkCollisions(this.level.coins);
        this.checkCollisions(this.level.bottle);
        this.checkThrow();
        this.startBossFight();
        this.gameOver();
    }

    /**
     * Clear the whole canvas prior to drawing the next frame.
     *
     * @returns {void}
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draw world objects in the intended draw order and apply camera translation.
     *
     * @returns {void}
     */
    drawGameWorld() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.bottle);
        this.addObjectsToMap(this.bottleThrow);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.coins);
        this.addToMap(this.character);
        this.ctx.translate(-this.camera_x, 0);
    }

    /**
     * Draw HUD elements (health, coin, bottle bars and boss bar when active).
     *
     * @returns {void}
     */
    drawUI() {
        this.addToMap(this.healthBar);
        this.addToMap(this.coinBar);
        this.addToMap(this.bottleBar);
        if (this.level.enemies[3].startBossFight) {
            this.addToMap(this.bossHealthBar);
        }
    }

    /**
     * Schedule the next animation frame and call draw() again.
     *
     * @returns {void}
     */
    scheduleNextFrame() {
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    /**
     * Draw multiple drawable objects by delegating to addToMap.
     *
     * @param {Array<DrawableObject>} objectArray - Array of drawable objects.
     * @returns {void}
     */
    addObjectsToMap(objectArray){
        objectArray.forEach(object => {
            this.addToMap(object)
        })
    }

    /**
     * Draw a single drawable object. Handles mirroring when otherDirection is set.
     *
     * @param {DrawableObject} mo - Object to render.
     * @returns {void}
     */
    addToMap(mo){
        if(mo.otherDirection){
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        if(mo.otherDirection){
            this.flipImageBack(mo);
        }
    }

    /**
     * Flip the canvas horizontally to render a mirrored sprite.
     * Adjusts the object's x temporarily to compensate for the transform.
     *
     * @param {DrawableObject} mo - Object being flipped for rendering.
     * @returns {void}
     */
    flipImage(mo){
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restore canvas transform after mirrored rendering and correct the object's x.
     *
     * @param {DrawableObject} mo - Object that was flipped.
     * @returns {void}
     */
    flipImageBack(mo){
        mo.x = mo.x * -1;
        this.ctx.restore(); 
    }

    /**
     * Trigger the end-of-game sequence: pause background music, play end sound,
     * show overlay and stop the game loop after a delay.
     *
     * @param {"win"|"lose"} type - Result type.
     * @param {string} imagePath - Path to overlay image to display.
     * @param {HTMLAudioElement} sound - Sound to play for the result.
     * @returns {void}
     */
    selectGameEnd(type, imagePath, sound){
        GameSounds.BACKGROUND_MUSIK.pause();
        GameSounds.playAudio(sound, 0.2, false);
        this.showWinScreen(imagePath, type);
        this.playedSound = true;
        setStoppableInterval(() => stopGame(), 2000);
    }

    /**
     * Show the win/lose overlay and set the corresponding image.
     *
     * @param {string} imagePath - Image to display in the overlay.
     * @param {"win"|"lose"} type - Result type.
     * @returns {void}
     */
    showWinScreen(imagePath, type) {
        let overlay = document.getElementById("winLoseContent");
        let imageContainer = document.getElementById("winLoseContentImg");

        overlay.classList.remove("d-none");
        if(type === "win"){
            imageContainer.innerHTML = `<img src="${imagePath}" alt="win screen">`;
        }
    }
}
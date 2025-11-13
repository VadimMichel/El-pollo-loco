/**
 * @fileoverview World manages the game state for a single play session:
 * - contains the main character, current level and UI status bars
 * - runs the main game loop (drawing, updating, collision checks)
 * - handles throwables, boss start logic and end-of-game handling
 *
 * The World instance is responsible for coordinating interactions between
 * game objects and for rendering the whole scene onto the provided canvas.
 *
 * @class World
 */
class World{
    /** @type {Character} The player character instance. */
    character = new Character();

    /** @type {Level} Current level definition (enemies, background, collectables). */
    level = level1;

    /** @type {HTMLCanvasElement} Canvas element used for rendering. */
    canvas;

    /** @type {CanvasRenderingContext2D} 2D drawing context of the canvas. */
    ctx;

    /** @type {Keyboard} Keyboard input state wrapper. */
    keyboard;

    /** @type {number} Camera offset on the x axis (applied via ctx.translate). */
    camera_x = 0;

    /** @type {number} Current collected coin percentage (0-100). */
    coinAmount = 0;

    /** @type {number} Current bottle amount percentage (0-100). */
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

    /** @type {ThrowableObject[]} Array of active thrown bottles. */
    bottleThrow = [];

    /** @type {boolean} Flag to prevent repeated end-of-game sound triggers. */
    playedSound = false;

    /**
     * Create the World instance and start the main loops.
     *
     * @param {HTMLCanvasElement} canvas - Canvas used for rendering.
     * @param {Keyboard} keyboard - Shared input state instance.
     */
    constructor(canvas, keyboard){
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.setWorld();
        this.draw();
        this.run();
    }

    /**
     * Wire the world reference into the character so components can access the world.
     *
     * @returns {void}
     */
    setWorld(){
        this.character.world = this;
    }

    /**
     * Check collisions and interactions between the provided array of objects
     * and the player/throwables. This method orchestrates hit / collect behaviors.
     *
     * @param {Array<MovableObject>} array - Array to check (enemies, coins, bottles).
     * @returns {void}
     */
    checkCollisions(array){
        array.forEach((object, i) => {
            if (this.isCharacterHitByEnemy(object, array)){
                if(this.isTheObjectABoss(object)){
                    this.character.recievedDamage = 100;
                }
                this.characterisHitByEnemy();  
            }else if(this.doesCharacterJumpOnEnemy(object, array)){
                this.characterJumpOnEnemy(i, object);
            }else if (this.isCollectingCoin(object, array)){
                this.collectCoin(i);
            }else if (this.doesCharactertouchBottle(object, array)){
                this.characterCollectBottle(i);
            }else{
                this.bottleHitObject(array, object);
            }
        })
    }

    /**
     * Evaluate whether any thrown bottles hit the given object and handle bottle lifecycle.
     *
     * @param {Array<MovableObject>} array - The array currently being checked (used to identify enemies).
     * @param {MovableObject} object - The target object from the array.
     * @returns {void}
     */
    bottleHitObject(array, object){
        this.bottleThrow.forEach((throwObj, j) => {
            if (this.doesBottleHitEnemy(object, array, throwObj)) {
                GameSounds.playAudio(GameSounds.CHICKEN_NOISE, 0.1, false);
                object.getHit();
                this.bottleBreak(j, throwObj);
                if(this.isTheObjectABoss(object)){
                    this.changeBossHealthBarAmount();
                    object.speed += 0.2;
                }
            }else if(this.bottleThrow[j].y > 350){
                this.bottleBreak(j, throwObj);
            }
        });
    }

    /**
     * Start recurring non-render update loop (events) using a stoppable interval.
     *
     * @returns {void}
     */
    run(){
        setStoppableInterval(() => this.events(), 10);
    }

    /**
     * Periodic game update: collision checks, throw handling, boss start and game over detection.
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
     * Trigger boss fight flag when character passes the threshold.
     *
     * @returns {void}
     */
    startBossFight(){
        if(this.character.x > 2150){
            this.level.enemies[3].startBossFight = true;
        }
    }

    /**
     * Detect end-of-game conditions (player dead or boss dead) and trigger end sequence once.
     *
     * @returns {void}
     */
    gameOver(){
        if(this.character.isDead() && !this.playedSound){
            this.selectGameEnd("lose", "./img/You won, you lost/Game over A.png", GameSounds.LOSE);
        }else if(this.level.enemies[3].isDead() && !this.playedSound){
            this.selectGameEnd("win", "./img/You won, you lost/You Win A.png", GameSounds.WIN);
        }
    }

    /**
     * Handle throw input: create a new ThrowableObject when allowed and update bottle UI.
     *
     * @returns {void}
     */
    checkThrow(){
        if(this.dPressedAndSomeBottleLeft() && this.bossFightNotStartet() || this.bossStartAnimationIsOver() && this.dPressedAndSomeBottleLeft()){
            let bottleThrow = new ThrowableObject(this.character.x + 70, this.character.y + 100);
            this.bottleThrow.push(bottleThrow);
            this.bottleAmount -= 20;
            this.bottleBar.setPercentage(this.bottleAmount)
            this.bottleThrow.lastHit = new Date().getTime()
        }
    }

    /**
     * Main render entry: clear canvas, draw world and UI, and schedule next frame.
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
     * Clear the entire canvas.
     *
     * @returns {void}
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draw all world objects in the correct order. Applies camera translation.
     *
     * @returns {void}
     */
    drawGameWorld() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.coins);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.bottle);
        this.addObjectsToMap(this.bottleThrow);
        this.addObjectsToMap(this.level.clouds);
        this.ctx.translate(-this.camera_x, 0);
    }

    /**
     * Draw HUD elements (health, coins, bottles and boss bar if active).
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
     * Request the next animation frame and call draw again.
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
     * Add multiple objects to the map by delegating to addToMap.
     *
     * @param {Array<DrawableObject>} objectArray - Objects to draw.
     * @returns {void}
     */
    addObjectsToMap(objectArray){
        objectArray.forEach(object => {
            this.addToMap(object)
        })
    }

    /**
     * Draw a single drawable object, handling horizontal flipping when required.
     *
     * @param {DrawableObject} mo - Movable/Drawable object to render.
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
     * Flip the canvas horizontally for rendering mirrored sprites.
     * Also negates the object's x to account for the transform.
     *
     * @param {DrawableObject} mo - Object to flip for rendering.
     * @returns {void}
     */
    flipImage(mo){
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restore the canvas transform and correct the object's x after mirrored rendering.
     *
     * @param {DrawableObject} mo - Object that was flipped.
     * @returns {void}
     */
    flipImageBack(mo){
        mo.x = mo.x * -1;
        this.ctx.restore(); 
    }

    /**
     * Trigger game end sequence: stop background music, play end sound, show overlay and stop the game loop.
     *
     * @param {"win"|"lose"} type - End type used to select UI behaviour.
     * @param {string} imagePath - Path to the overlay image to display.
     * @param {HTMLAudioElement} sound - Sound to play on game end.
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
     * Display the win/lose overlay and set the appropriate image.
     *
     * @param {string} imagePath - Image to show in the overlay.
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

    /**
     * Mark a thrown bottle as collided (plays break sound once) and flag the object.
     *
     * @param {number} j - Index of the thrown bottle in bottleThrow array.
     * @param {ThrowableObject} object - The thrown bottle instance.
     * @returns {void}
     */
    bottleBreak(j, object){
        if(!this.bottleThrow[j].collided){
            GameSounds.playAudio(GameSounds.GLASS_SHATTER, 0.1, false);
        }
        object.collided = true;
    }

    /**
     * Return true when the character is colliding with an enemy (not from top).
     *
     * @param {MovableObject} object - Target object.
     * @param {Array} array - The array being checked (used to identify enemies).
     * @returns {boolean}
     */
    isCharacterHitByEnemy(object, array){
        return this.character.isCollading(object) && array == this.level.enemies && !this.character.isCollidingFromTop(object) && !object.isDead()
    }

    /**
     * Handle character being hit by an enemy: play hurt sound (once) and reduce energy.
     *
     * @returns {void}
     */
    characterisHitByEnemy(){
        if(!this.character.isHurt() && !this.character.isDead()){
            GameSounds.playAudio(GameSounds.HURT_SOUND, 0.2, false);
            this.character.j = 0;
        }
        this.character.getHit();
        this.healthBar.setPercentage(this.character.energy);
    }

    /**
     * Handle character jumping on an enemy: play sound, damage enemy and make character jump.
     *
     * @param {number} i - index in enemy array.
     * @param {MovableObject} object - The enemy object.
     * @returns {void}
     */
    characterJumpOnEnemy(i, object){
        GameSounds.playAudio(GameSounds.CHICKEN_NOISE, 0.1, false);
        object.getHit();
        this.character.jump();
    }

    /**
     * Return true if the character is stomping an enemy (from top).
     *
     * @param {MovableObject} object - The object being tested.
     * @param {Array} array - The array under consideration.
     * @returns {boolean}
     */
    doesCharacterJumpOnEnemy(object, array){
        return this.character.isCollidingFromTop(object) && array == this.level.enemies && !object.isDead() && this.character.speedY < 0;
    }
    
    /**
     * Collect a coin: play sound, update coin count/UI and remove the coin from level.
     *
     * @param {number} i - Index of the coin in the coins array.
     * @returns {void}
     */
    collectCoin(i){
        GameSounds.playAudio(GameSounds.COIN, 0.2, false)
        this.coinAmount += 20;
        this.coinBar.setPercentage(this.coinAmount);
        this.level.coins.splice(i, 1);
    }

    /**
     * Return true when the character collides with a coin in the coins array.
     *
     * @param {MovableObject} object
     * @param {Array} array
     * @returns {boolean}
     */
    isCollectingCoin(object, array){
        return this.character.isCollading(object) && array == this.level.coins;
    }

    /**
     * Return true when the character collides with a bottle (collectable) and there is capacity.
     *
     * @param {MovableObject} object
     * @param {Array} array
     * @returns {boolean}
     */
    doesCharactertouchBottle(object, array){
        return this.character.isCollading(object) && array == this.level.bottle && this.bottleAmount < 100;
    }

    /**
     * Pick up a bottle: play sound, increase bottle count, update UI and remove bottle from level.
     *
     * @param {number} i - Index of the bottle in the level array.
     * @returns {void}
     */
    characterCollectBottle(i){
        GameSounds.playAudio(GameSounds.COLLECT_BOTTLE, 0.2, false);
        this.bottleAmount += 20;
        this.bottleBar.setPercentage(this.bottleAmount);
        this.level.bottle.splice(i, 1);
    }

    /**
     * Return true when a thrown bottle collides with an enemy object.
     *
     * @param {MovableObject} object - Target object.
     * @param {Array} array - The array being checked.
     * @param {ThrowableObject} throwObj - Thrown bottle to test.
     * @returns {boolean}
     */
    doesBottleHitEnemy(object, array, throwObj){
        return throwObj.isCollading(object) && array == this.level.enemies && !object.isDead();
    }

    /**
     * Return true if the provided object is the level's boss (index 3).
     *
     * @param {MovableObject} object
     * @returns {boolean}
     */
    isTheObjectABoss(object){
        return object == this.level.enemies[3]
    }

    /**
     * Update the boss health status bar to reflect the boss's current energy.
     *
     * @returns {void}
     */
    changeBossHealthBarAmount(){
        this.bossHealthBar.setPercentage(this.level.enemies[3].energy)
    }

    /**
     * Return true when throw key/conditions allow throwing and there is at least one bottle.
     *
     * @returns {boolean}
     */
    dPressedAndSomeBottleLeft(){
        return this.keyboard.D && this.bottleAmount > 0 && this.bottleThrow.length < 1;
    }

    /**
     * Return true if boss fight has not been started yet.
     *
     * @returns {boolean}
     */
    bossFightNotStartet(){
        return !this.level.enemies[3].startBossFight;
    }

    /**
     * Return true when the boss start animation counter reached the expected value.
     *
     * @returns {boolean}
     */
    bossStartAnimationIsOver(){
        return this.level.enemies[3].startAnimation == 6;
    }
}
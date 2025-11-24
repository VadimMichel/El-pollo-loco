/**
 * @fileoverview WorldLogic encapsulates gameplay logic for World:
 * - collision detection and reaction
 * - throwable (bottle) handling and lifecycle
 * - periodic game events (run / events)
 * - boss start & game over checks
 *
 * This class assumes it will be used as a superclass for World (no module exports).
 * Methods reference instance fields that must exist on the derived World class
 * (e.g. level, character, bottleThrow, healthBar, coinBar, bottleBar, keyboard).
 *
 * @class WorldLogic
 */
class WorldLogic {
    /**
     * Iterate an object array and handle interactions between the character,
     * environment objects and thrown bottles.
     *
     * @param {Array<MovableObject>} array - Array of world objects (enemies, coins, bottles).
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
     * Check thrown bottles for collisions with the given object and handle break logic.
     *
     * @param {Array<MovableObject>} array - Array that contains the target object.
     * @param {MovableObject} object - The target object to test against.
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
     * Trigger boss fight when the character passes the configured X threshold.
     *
     * @returns {void}
     */
    startBossFight(){
        if(this.character.x > 2150){
            this.level.enemies[3].startBossFight = true;
        }
    }

    /**
     * Evaluate end-of-game conditions and invoke the end sequence once.
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
     * Handle throw input and create a new ThrowableObject when allowed; if throwing is not possible, an error sound is played.
     *
     * @returns {void}
     */
    checkThrow(){
        if(this.dPressedAndSomeBottleLeft() && (this.bossFightNotStartet() || this.bossStartAnimationIsOver())){
            let bottleThrow = new ThrowableObject(this.character.x + 70, this.character.y + 100);
            this.bottleThrow.push(bottleThrow);
            this.bottleAmount -= 20;
            this.bottleBar.setPercentage(this.bottleAmount)
            this.bottleThrow.lastHit = new Date().getTime()
        } else if(this.dPressedAndNoBottleLeft() || this.dPressedAndSomeBottleLeft() && (!this.bossFightNotStartet() || !this.bossStartAnimationIsOver())){
            GameSounds.playAudio(GameSounds.BOTTLE_ERROR, 0.3, false);
        }
    }

    /**
     * Mark a thrown bottle as collided and play break sound once.
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
     * Determine if the character is colliding with an enemy (not from top).
     *
     * @param {MovableObject} object - Target object.
     * @param {Array} array - The array being checked.
     * @returns {boolean}
     */
    isCharacterHitByEnemy(object, array){
        return this.character.isCollading(object) && array == this.level.enemies && !this.character.isCollidingFromTop(object) && !object.isDead()
    }

    /**
     * Apply hit effects to the character when struck by an enemy.
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
     * Handle character jumping on an enemy: damage enemy 
     * and make the character bounce at half the normal jump height.
     *
     * @param {number} i - Index of the enemy.
     * @param {MovableObject} object - The enemy object.
     * @returns {void}
     */
    characterJumpOnEnemy(i, object){
        GameSounds.playAudio(GameSounds.CHICKEN_NOISE, 0.1, false);
        object.getHit();
        this.character.jump(18);
        this.character.speedY /= 2;
    }

    /**
     * Check whether the character is stomping an enemy from above.
     *
     * @param {MovableObject} object
     * @param {Array} array
     * @returns {boolean}
     */
    doesCharacterJumpOnEnemy(object, array){
        return this.character.isCollidingFromTop(object) && array == this.level.enemies && !object.isDead() && this.character.speedY < 0;
    }

    /**
     * Collect a coin: play sound, update UI and remove the coin.
     *
     * @param {number} i - Coin index in array.
     * @returns {void}
     */
    collectCoin(i){
        GameSounds.playAudio(GameSounds.COIN, 0.2, false)
        this.coinAmount += 20;
        this.coinBar.setPercentage(this.coinAmount);
        this.level.coins.splice(i, 1);
    }

    /**
     * Return true when the character collides with a coin.
     *
     * @param {MovableObject} object
     * @param {Array} array
     * @returns {boolean}
     */
    isCollectingCoin(object, array){
        return this.character.isCollading(object) && array == this.level.coins;
    }

    /**
     * Return true when the character collides with a pickup bottle and has capacity.
     *
     * @param {MovableObject} object
     * @param {Array} array
     * @returns {boolean}
     */
    doesCharactertouchBottle(object, array){
        return this.character.isCollading(object) && array == this.level.bottle && this.bottleAmount < 100;
    }

    /**
     * Pick up a bottle: play sound, increment count and remove from level.
     *
     * @param {number} i - Index in the level.bottle array.
     * @returns {void}
     */
    characterCollectBottle(i){
        GameSounds.playAudio(GameSounds.COLLECT_BOTTLE, 0.2, false);
        this.bottleAmount += 20;
        this.bottleBar.setPercentage(this.bottleAmount);
        this.level.bottle.splice(i, 1);
    }

    /**
     * Check if a specific thrown bottle collides with the given target.
     *
     * @param {MovableObject} object - Target object.
     * @param {Array} array - Array being checked.
     * @param {ThrowableObject} throwObj - Thrown bottle.
     * @returns {boolean}
     */
    doesBottleHitEnemy(object, array, throwObj){
        return throwObj.isCollading(object) && array == this.level.enemies && !object.isDead();
    }

    /**
     * Return true if the object is the level's boss (assumed at index 3).
     *
     * @param {MovableObject} object
     * @returns {boolean}
     */
    isTheObjectABoss(object){
        return object == this.level.enemies[3]
    }

    /**
     * Update the boss health UI to match the boss energy.
     *
     * @returns {void}
     */
    changeBossHealthBarAmount(){
        this.bossHealthBar.setPercentage(this.level.enemies[3].energy)
    }

    /**
     * Return true when the throw key is pressed and bottles are available.
     *
     * @returns {boolean}
     */
    dPressedAndSomeBottleLeft(){
        return this.keyboard.D && this.bottleAmount > 0 && this.bottleThrow.length < 1;
    }

    /**
     * Return true when the throw key is pressed, has zero bottles left,
     * and there is no active thrown bottle.
     * 
     * @returns {boolean} 
    */
    dPressedAndNoBottleLeft(){
        return this.keyboard.D && this.bottleAmount == 0 && this.bottleThrow.length < 1;
    }

    /**
     * Return true when boss fight hasn't been started yet.
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

/**
 * Restart the game: reset flags, reinitialize level, and start game loop.
 *
 * @returns {void}
 */
function restartGame(){
    // reset playedSound flag so gameOver() can trigger again
    if (world) {
        world.playedSound = false;
    }
    
    // ... rest of restart logic (clear intervals, reinit level, etc.)
    initLevel();
    world = new World(canvas, keyboard);
    world.run();
    showGameUI();
    playBackgroundMusic();
}
class World{
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    coinAmount = 0;
    bottleAmount = 0;
    bossHealthAmount = 100;
    healthBar = new StatusBar("health", 0, 20, 100);
    coinBar = new StatusBar("coin", 45, 20, 0);
    bottleBar = new StatusBar("bottle", 90, 20, 0);
    bossHealthBar = new StatusBar("boss", 6, 440, 100);
    bottleThrow = [];
    playedSound = false;

    constructor(canvas, keyboard){
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.setWorld();
        this.draw();
        this.run();
    }

    setWorld(){
        this.character.world = this;
    }

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
            }
            this.bottleThrow.forEach((throwObj, j) => {
                if (this.doesBottleHitEnemy(object, array, throwObj)) {
                    GameSounds.playAudio(GameSounds.CHICKEN_NOISE, 0.1, false);
                    object.getHit();
                    this.bottleBreak(j, this.bottleThrow, 8);
                    if(this.isTheObjectABoss(object)){
                        this.changeBossHealthBarAmount();
                        object.speed++;
                        console.log(object)
                    }
                }else if(this.bottleThrow[j].y > 300){
                    this.bottleBreak(j, this.bottleThrow, 8);
                }
            });
        })
    }

    run(){
        setStoppableInterval(() => this.events(), 10);
    }

    events(){
        this.checkCollisions(this.level.enemies); 
        this.checkCollisions(this.level.coins);
        this.checkCollisions(this.level.bottle);
        this.checkThrow();
        this.startBossFight();
        this.gameOver();
    }

    startBossFight(){
        if(this.character.x > 2150){
            this.level.enemies[3].startBossFight = true;
        }
    }

    gameOver(){
        if(this.character.isDead() && !this.playedSound){
            GameSounds.BACKGROUND_MUSIK.pause();
            GameSounds.playAudio(GameSounds.LOSE, 0.2, false);
            setStoppableInterval(() => stopGame(), 2000);
            document.getElementById("winLoseContent").classList.remove("d-none");
            this.playedSound = true;
        }else if(this.level.enemies[3].isDead() && !this.playedSound){
            GameSounds.BACKGROUND_MUSIK.pause();
            GameSounds.playAudio(GameSounds.WIN, 0.2, false);
            setStoppableInterval(() => stopGame(), 2000);
            document.getElementById("winLoseContent").classList.remove("d-none");
            document.getElementById("winLoseContentImg").innerHTML = '<img src="./img/You won, you lost/You Win A.png" alt="">'
            this.playedSound = true;
        }
    }

    deleteImage(i, array, immageArrayLength){
        if(array[i].j < immageArrayLength){
            array.splice(i, 1) 
       }
    }

    checkThrow(){
        if(this.dPressedAndSomeBottleLeft() && this.bossFightNotStartet() || this.bossStartAnimationIsOver() && this.dPressedAndSomeBottleLeft()){
            console.log("bottle")
            let bottleThrow = new ThrowableObject(this.character.x + 70, this.character.y + 100);
            this.bottleThrow.push(bottleThrow);
            this.bottleAmount -= 20;
            this.bottleBar.setPercentage(this.bottleAmount)
            this.bottleThrow.lastHit = new Date().getTime()
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.coins);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.bottle);
        this.addObjectsToMap(this.bottleThrow);
        this.addObjectsToMap(this.level.clouds);
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.healthBar);
        this.addToMap(this.coinBar);
        this.addToMap(this.bottleBar);
        if(this.level.enemies[3].startBossFight){
            this.addToMap(this.bossHealthBar);
        }
        this.ctx.translate(this.camera_x, 0);
        this.ctx.translate(-this.camera_x, 0);

        let self = this;
        requestAnimationFrame(function ()   {
            self.draw();
        });
    } 

    addObjectsToMap(objectArray){
        objectArray.forEach(object => {
            this.addToMap(object)
        })
    }

    addToMap(mo){
        if(mo.otherDirection){
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        //mo.drawFrameOfset(this.ctx);
        //mo.drawFrame(this.ctx);
        if(mo.otherDirection){
            this.flipImageBack(mo);
        }
    }

    flipImage(mo){
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo){
        mo.x = mo.x * -1;
        this.ctx.restore(); 
    }

    bottleBreak(j, array, immageArrayLength){
        if(!this.bottleThrow[j].collided){
            GameSounds.playAudio(GameSounds.GLASS_SHATTER, 0.1, false);
        }
        this.bottleThrow[j].collided = true;
        this.deleteImage(j, array, immageArrayLength); 
    }

    isCharacterHitByEnemy(object, array){
        return this.character.isCollading(object) && array == this.level.enemies && !this.character.isCollidingFromTop(object) && !object.isDead()
    }

    characterisHitByEnemy(){
        if(!this.character.isHurt() && !this.character.isDead()){
            GameSounds.playAudio(GameSounds.HURT_SOUND, 0.2, false);
            this.character.j = 0;
        }
        this.character.getHit();
        this.healthBar.setPercentage(this.character.energy);
    }

    characterJumpOnEnemy(i, object){
        GameSounds.playAudio(GameSounds.CHICKEN_NOISE, 0.1, false);
        object.getHit();
        this.character.jump();
    }

    doesCharacterJumpOnEnemy(object, array){
        return this.character.isCollidingFromTop(object) && array == this.level.enemies && !object.isDead() && this.character.speedY < 0;
    }
    
    collectCoin(i){
        GameSounds.playAudio(GameSounds.COIN, 0.2, false)
        this.coinAmount += 20;
        this.coinBar.setPercentage(this.coinAmount);
        this.level.coins.splice(i, 1);
    }

    isCollectingCoin(object, array){
        return this.character.isCollading(object) && array == this.level.coins;
    }

    doesCharactertouchBottle(object, array){
        return this.character.isCollading(object) && array == this.level.bottle
    }

    characterCollectBottle(i){
        GameSounds.playAudio(GameSounds.COLLECT_BOTTLE, 0.2, false);
        this.bottleAmount += 20;
        this.bottleBar.setPercentage(this.bottleAmount);
        this.level.bottle.splice(i, 1);
    }

    doesBottleHitEnemy(object, array, throwObj){
        return throwObj.isCollading(object) && array == this.level.enemies;
    }

    isTheObjectABoss(object){
        return object == this.level.enemies[3]
    }

    changeBossHealthBarAmount(){
        this.bossHealthBar.setPercentage(this.level.enemies[3].energy)
    }

    dPressedAndSomeBottleLeft(){
        return this.keyboard.D && this.bottleAmount > 0 && this.bottleThrow.length < 1;
    }

    bossFightNotStartet(){
        return !this.level.enemies[3].startBossFight;
    }

    bossStartAnimationIsOver(){
        return this.level.enemies[3].startAnimation == 6;
    }
}